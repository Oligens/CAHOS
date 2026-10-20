/**
 * TEST T2 — XOR PÉDAGOGIQUE
 * Chiffrement XOR avec analyse de fréquences pour retrouver la clé
 */

export interface XORResult {
  key: string;
  keyHex: string;
  decrypted: string;
  confidence: number;
}

// Chiffrement XOR avec clé répétée
export function xorEncrypt(text: string, key: string): string {
  const result: number[] = [];
  for (let i = 0; i < text.length; i++) {
    result.push(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return String.fromCharCode(...result);
}

// Déchiffrement XOR (identique au chiffrement)
export function xorDecrypt(ciphertext: string, key: string): string {
  return xorEncrypt(ciphertext, key);
}

// Convertir en hexadécimal
export function toHex(str: string): string {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ');
}

// Convertir depuis hexadécimal
export function fromHex(hex: string): string {
  return hex
    .split(' ')
    .map(h => String.fromCharCode(parseInt(h, 16)))
    .join('');
}

// Indice de coïncidence (pour détecter la longueur de clé)
function indexOfCoincidence(text: string): number {
  const freq: Record<string, number> = {};
  let total = 0;
  
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
    total++;
  }
  
  if (total <= 1) return 0;
  
  let sum = 0;
  for (const count of Object.values(freq)) {
    sum += count * (count - 1);
  }
  
  return sum / (total * (total - 1));
}

// Test de Kasiski pour trouver la longueur de clé
function findKeyLength(ciphertext: string, maxKeyLen: number = 10): number {
  let bestLength = 1;
  let bestScore = 0;
  
  // IC attendu pour le français : ~0.065
  const expectedIC = 0.065;
  
  for (let keyLen = 1; keyLen <= maxKeyLen; keyLen++) {
    // Diviser le texte en colonnes
    const columns: string[] = Array.from({ length: keyLen }, () => '');
    for (let i = 0; i < ciphertext.length; i++) {
      columns[i % keyLen] += ciphertext[i];
    }
    
    // Calculer l'IC moyen des colonnes
    let totalIC = 0;
    for (const col of columns) {
      totalIC += indexOfCoincidence(col);
    }
    const avgIC = totalIC / keyLen;
    
    // Plus l'IC est proche de 0.065, plus c'est probable
    const score = 1 / (1 + Math.abs(avgIC - expectedIC) * 100);
    
    if (score > bestScore) {
      bestScore = score;
      bestLength = keyLen;
    }
  }
  
  return bestLength;
}

// Trouver la clé XOR par analyse de fréquences
export function xorCrack(ciphertext: string, maxKeyLen: number = 5): XORResult[] {
  const results: XORResult[] = [];
  
  // Fréquences attendues pour du texte ASCII imprimable
  const targetFreq = ' etaoinshrdlu'.split('');
  
  const keyLen = findKeyLength(ciphertext, maxKeyLen);
  
  // Pour chaque position de la clé
  const keyChars: string[] = [];
  
  for (let pos = 0; pos < keyLen; pos++) {
    // Extraire les caractères à cette position
    const column: string[] = [];
    for (let i = pos; i < ciphertext.length; i += keyLen) {
      column.push(ciphertext[i]);
    }
    
    // Tester chaque valeur de clé possible (0-255)
    let bestKeyChar = ' ';
    let bestScore = -1;
    
    for (let keyVal = 32; keyVal < 127; keyVal++) {
      const keyChar = String.fromCharCode(keyVal);
      const decrypted = column.map(c => String.fromCharCode(c.charCodeAt(0) ^ keyVal));
      
      // Score basé sur la fréquence des caractères imprimables courants
      let score = 0;
      for (const char of decrypted) {
        const code = char.charCodeAt(0);
        if (code >= 32 && code < 127) {
          score += 1;
          if (targetFreq.includes(char.toLowerCase())) score += 2;
          if (char === ' ') score += 3;
        } else {
          score -= 5; // Pénalité pour caractères non-imprimables
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestKeyChar = keyChar;
      }
    }
    
    keyChars.push(bestKeyChar);
  }
  
  const key = keyChars.join('');
  const decrypted = xorDecrypt(ciphertext, key);
  
  // Calculer la confiance
  let printableCount = 0;
  for (const char of decrypted) {
    const code = char.charCodeAt(0);
    if (code >= 32 && code < 127) printableCount++;
  }
  const confidence = (printableCount / decrypted.length) * 100;
  
  results.push({
    key,
    keyHex: toHex(key),
    decrypted,
    confidence,
  });
  
  return results;
}

// Test T2
export function runTestT2(): {
  passed: boolean;
  input: string;
  inputHex: string;
  expected: string;
  result: string;
  key: string;
  keyHex: string;
  confidence: number;
  time: number;
} {
  const start = performance.now();
  
  const plaintext = 'Bonjour le monde';
  const key = 'KEY';
  const encrypted = xorEncrypt(plaintext, key);
  
  // Tenter de retrouver la clé
  const results = xorCrack(encrypted, 5);
  const bestResult = results[0];
  
  const time = performance.now() - start;
  
  return {
    passed: bestResult.confidence > 80 && bestResult.decrypted.length === plaintext.length,
    input: encrypted,
    inputHex: toHex(encrypted),
    expected: plaintext,
    result: bestResult.decrypted,
    key: bestResult.key,
    keyHex: bestResult.keyHex,
    confidence: bestResult.confidence,
    time,
  };
}
