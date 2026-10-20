/**
 * TEST T1 — CHIFFRE DE CÉSAR
 * Implémentation réelle et vérifiable
 */

export interface CaesarResult {
  shift: number;
  decrypted: string;
  confidence: number;
}

// Chiffrement César
export function caesarEncrypt(text: string, shift: number): string {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      if (char.match(/[A-Z]/)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return char;
    })
    .join('');
}

// Déchiffrement César
export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, 26 - shift);
}

// Analyse de fréquences pour deviner le décalage
export function caesarCrack(ciphertext: string): CaesarResult[] {
  const results: CaesarResult[] = [];
  
  // Fréquences typiques du français
  const frenchFreq = {
    'e': 14.7, 's': 7.9, 'a': 7.6, 'i': 7.5, 't': 7.2,
    'n': 7.1, 'r': 6.5, 'u': 6.3, 'l': 5.4, 'o': 5.3,
  };
  
  for (let shift = 0; shift < 26; shift++) {
    const decrypted = caesarDecrypt(ciphertext, shift);
    const lowerText = decrypted.toLowerCase();
    
    // Calculer le score basé sur les fréquences
    let score = 0;
    const letterCounts: Record<string, number> = {};
    let totalLetters = 0;
    
    for (const char of lowerText) {
      if (char.match(/[a-z]/)) {
        letterCounts[char] = (letterCounts[char] || 0) + 1;
        totalLetters++;
      }
    }
    
    if (totalLetters > 0) {
      for (const [letter, expectedFreq] of Object.entries(frenchFreq)) {
        const actualFreq = ((letterCounts[letter] || 0) / totalLetters) * 100;
        score += Math.abs(actualFreq - expectedFreq);
      }
    }
    
    // Score plus bas = meilleure correspondance
    const confidence = Math.max(0, 100 - score);
    
    results.push({
      shift,
      decrypted,
      confidence,
    });
  }
  
  // Trier par confiance décroissante
  return results.sort((a, b) => b.confidence - a.confidence);
}

// Test T1
export function runTestT1(): {
  passed: boolean;
  input: string;
  expected: string;
  result: string;
  shift: number;
  time: number;
} {
  const start = performance.now();
  
  const plaintext = 'SECRET';
  const shift = 3;
  const encrypted = caesarEncrypt(plaintext, shift);
  
  // Tenter de déchiffrer sans connaître le décalage
  const results = caesarCrack(encrypted);
  const bestResult = results[0];
  
  const time = performance.now() - start;
  
  return {
    passed: bestResult.decrypted.toUpperCase() === plaintext,
    input: encrypted,
    expected: plaintext,
    result: bestResult.decrypted.toUpperCase(),
    shift: bestResult.shift,
    time,
  };
}
