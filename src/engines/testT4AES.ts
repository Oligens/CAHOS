/**
 * TEST T4 — AES-256
 * Chiffrement et déchiffrement réels avec Web Crypto API
 */

export interface AESResult {
  encrypted: boolean;
  decrypted: boolean;
  ciphertext: string;
  plaintext: string;
  keyValid: boolean;
  wrongKeyRejected: boolean;
  time: number;
}

// Convertir ArrayBuffer en base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convertir base64 en ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convertir string en ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

// Convertir ArrayBuffer en string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

// Générer une clé AES-256
async function generateAESKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Importer une clé depuis base64
async function importKey(keyBase64: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(keyBase64);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Exporter une clé en base64
async function exportKey(key: CryptoKey): Promise<string> {
  const keyData = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(keyData);
}

// Chiffrer avec AES-256-GCM
async function aesEncrypt(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = stringToArrayBuffer(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoded
  );
  
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

// Déchiffrer avec AES-256-GCM
async function aesDecrypt(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    ciphertext
  );
  
  return arrayBufferToString(decrypted);
}

// Test T4 — Chiffrement/déchiffrement AES-256
export async function runTestT4(): Promise<{
  passed: boolean;
  test: string;
  algorithm: string;
  keyLength: number;
  plaintext: string;
  ciphertext: string;
  decrypted: string;
  keyValid: boolean;
  wrongKeyRejected: boolean;
  encryptionTime: number;
  decryptionTime: number;
  error?: string;
}> {
  const start = performance.now();
  
  try {
    const plaintext = 'Document confidentiel CAHOS - Test T4';
    
    // Générer une clé
    const key = await generateAESKey();
    const keyBase64 = await exportKey(key);
    
    // Chiffrer
    const encStart = performance.now();
    const { ciphertext, iv } = await aesEncrypt(plaintext, key);
    const encryptionTime = performance.now() - encStart;
    
    // Déchiffrer avec la bonne clé
    const decStart = performance.now();
    const decrypted = await aesDecrypt(ciphertext, iv, key);
    const decryptionTime = performance.now() - decStart;
    
    // Tester avec une mauvaise clé
    let wrongKeyRejected = false;
    try {
      const wrongKey = await generateAESKey();
      await aesDecrypt(ciphertext, iv, wrongKey);
      wrongKeyRejected = false; // N'aurait pas dû fonctionner
    } catch (e) {
      wrongKeyRejected = true; // Correctement rejeté
    }
    
    const keyValid = decrypted === plaintext;
    const totalTime = performance.now() - start;
    
    return {
      passed: keyValid && wrongKeyRejected,
      test: 'Chiffrement/déchiffrement AES-256-GCM',
      algorithm: 'AES-256-GCM',
      keyLength: 256,
      plaintext,
      ciphertext: ciphertext.substring(0, 50) + '...',
      decrypted,
      keyValid,
      wrongKeyRejected,
      encryptionTime,
      decryptionTime,
    };
  } catch (error) {
    const totalTime = performance.now() - start;
    return {
      passed: false,
      test: 'Chiffrement/déchiffrement AES-256-GCM',
      algorithm: 'AES-256-GCM',
      keyLength: 256,
      plaintext: '',
      ciphertext: '',
      decrypted: '',
      keyValid: false,
      wrongKeyRejected: false,
      encryptionTime: 0,
      decryptionTime: 0,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Dérivation de clé depuis un mot de passe (PBKDF2)
export async function deriveKeyFromPassword(
  password: string,
  salt: BufferSource
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}
