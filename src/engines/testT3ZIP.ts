/**
 * TEST T3 — ARCHIVE ZIP
 * Création et extraction d'archives ZIP
 * Note : jszip ne supporte pas nativement le chiffrement ZIP
 * Ce test vérifie la capacité de création/extraction d'archives
 */

import JSZip from 'jszip';

export interface ZIPResult {
  created: boolean;
  extracted: boolean;
  files: string[];
  content: string;
  size: number;
  time: number;
}

// Créer une archive ZIP
export async function createZipArchive(
  files: Record<string, string>
): Promise<Uint8Array> {
  const zip = new JSZip();
  
  for (const [filename, content] of Object.entries(files)) {
    zip.file(filename, content);
  }
  
  const blob = await zip.generateAsync({ type: 'uint8array' });
  return blob;
}

// Extraire une archive ZIP
export async function extractZipArchive(
  zipData: Uint8Array
): Promise<Record<string, string>> {
  const zip = await JSZip.loadAsync(zipData);
  const files: Record<string, string> = {};
  
  const filePromises = Object.keys(zip.files).map(async filename => {
    const file = zip.files[filename];
    if (!file.dir) {
      const content = await file.async('string');
      files[filename] = content;
    }
  });
  
  await Promise.all(filePromises);
  return files;
}

// Test T3 — Création et extraction d'archive
export async function runTestT3(): Promise<{
  passed: boolean;
  test: string;
  filesCreated: string[];
  filesExtracted: string[];
  contentMatch: boolean;
  archiveSize: number;
  time: number;
  error?: string;
}> {
  const start = performance.now();
  
  try {
    // Créer une archive avec plusieurs fichiers
    const testFiles = {
      'document.txt': 'Ceci est un document de test pour CAHOS.',
      'data.csv': 'nom,valeur\nalpha,1\nbeta,2\ngamma,3',
      'readme.md': '# Test CAHOS\n\nArchive de validation T3.',
    };
    
    const zipData = await createZipArchive(testFiles);
    const archiveSize = zipData.length;
    
    // Extraire l'archive
    const extractedFiles = await extractZipArchive(zipData);
    
    // Vérifier que le contenu correspond
    let contentMatch = true;
    for (const [filename, expectedContent] of Object.entries(testFiles)) {
      if (extractedFiles[filename] !== expectedContent) {
        contentMatch = false;
        break;
      }
    }
    
    const time = performance.now() - start;
    
    return {
      passed: contentMatch && Object.keys(extractedFiles).length === 3,
      test: 'Création et extraction d\'archive ZIP',
      filesCreated: Object.keys(testFiles),
      filesExtracted: Object.keys(extractedFiles),
      contentMatch,
      archiveSize,
      time,
    };
  } catch (error) {
    const time = performance.now() - start;
    return {
      passed: false,
      test: 'Création et extraction d\'archive ZIP',
      filesCreated: [],
      filesExtracted: [],
      contentMatch: false,
      archiveSize: 0,
      time,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Test T3b — Simulation de test de mot de passe ZIP
// Note : jszip ne supporte pas le chiffrement ZIP natif
// Ce test montre comment un vrai outil fonctionnerait
export function simulateZipPasswordTest(): {
  method: string;
  note: string;
  tools: string[];
  approach: string;
} {
  return {
    method: 'Test de mot de passe sur archive ZIP chiffrée',
    note: 'jszip ne supporte pas nativement le chiffrement ZIP. Un outil spécialisé est nécessaire.',
    tools: ['7-Zip', 'John the Ripper (zip2john)', 'HashCat (mode 17200)', 'fcrackzip'],
    approach: `
1. Extraire le hash de l'archive (zip2john archive.zip > hash.txt)
2. Tester des mots de passe candidats contre le hash
3. Si un candidat fonctionne, extraire le contenu avec le mot de passe
4. Vérifier l'intégrité des fichiers extraits
    `.trim(),
  };
}
