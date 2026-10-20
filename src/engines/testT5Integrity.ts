/**
 * TEST T5 — INTÉGRITÉ
 * Vérification d'intégrité avec SHA-256
 * Détecte les fichiers altérés et rejette les résultats invalides
 */

export interface IntegrityResult {
  hash: string;
  verified: boolean;
  tampered: boolean;
  originalHash: string;
  currentHash: string;
  match: boolean;
  time: number;
}

// Convertir ArrayBuffer en hex
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Calculer le hash SHA-256 d'un texte
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Calculer le hash SHA-256 d'un ArrayBuffer
export async function sha256Buffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return bufferToHex(hashBuffer);
}

// Vérifier l'intégrité d'un fichier
export async function verifyIntegrity(
  originalContent: string,
  currentContent: string
): Promise<IntegrityResult> {
  const start = performance.now();
  
  const originalHash = await sha256(originalContent);
  const currentHash = await sha256(currentContent);
  const match = originalHash === currentHash;
  
  const time = performance.now() - start;
  
  return {
    hash: currentHash,
    verified: match,
    tampered: !match,
    originalHash,
    currentHash,
    match,
    time,
  };
}

// Simuler une altération de fichier
export function tamperContent(content: string): string {
  // Ajouter un caractère aléatoire
  const pos = Math.floor(Math.random() * content.length);
  const char = String.fromCharCode(Math.floor(Math.random() * 256));
  return content.slice(0, pos) + char + content.slice(pos + 1);
}

// Test T5 — Vérification d'intégrité
export async function runTestT5(): Promise<{
  passed: boolean;
  test: string;
  originalContent: string;
  originalHash: string;
  tamperedContent: string;
  tamperedHash: string;
  validFileDetected: boolean;
  tamperedFileDetected: boolean;
  time: number;
  error?: string;
}> {
  const start = performance.now();
  
  try {
    const originalContent = 'Document original CAHOS - Test T5 - Intégrité';
    const originalHash = await sha256(originalContent);
    
    // Test 1 : Vérifier un fichier valide
    const validResult = await verifyIntegrity(originalContent, originalContent);
    
    // Test 2 : Vérifier un fichier altéré
    const tamperedContent = tamperContent(originalContent);
    const tamperedHash = await sha256(tamperedContent);
    const tamperedResult = await verifyIntegrity(originalContent, tamperedContent);
    
    const time = performance.now() - start;
    
    return {
      passed: validResult.match && !tamperedResult.match,
      test: 'Vérification d\'intégrité SHA-256',
      originalContent,
      originalHash,
      tamperedContent,
      tamperedHash,
      validFileDetected: validResult.match,
      tamperedFileDetected: !tamperedResult.match,
      time,
    };
  } catch (error) {
    const time = performance.now() - start;
    return {
      passed: false,
      test: 'Vérification d\'intégrité SHA-256',
      originalContent: '',
      originalHash: '',
      tamperedContent: '',
      tamperedHash: '',
      validFileDetected: false,
      tamperedFileDetected: false,
      time,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Vérifier l'intégrité de plusieurs fichiers
export async function verifyMultipleFiles(
  files: Record<string, string>
): Promise<{
  filename: string;
  hash: string;
  verified: boolean;
}[]> {
  const results = [];
  
  for (const [filename, content] of Object.entries(files)) {
    const hash = await sha256(content);
    results.push({
      filename,
      hash,
      verified: true, // Dans un vrai scénario, on comparerait avec un hash de référence
    });
  }
  
  return results;
}
