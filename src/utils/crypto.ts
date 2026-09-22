/**
 * Zero-Knowledge Client-Side End-to-End Encryption (E2EE) Engine
 * Implements Web Crypto API AES-256-GCM authenticated encryption
 * with PBKDF2 key derivation (100,000 SHA-256 iterations).
 */

const PBKDF2_ITERATIONS = 100000;
const SALT_BYTE_LENGTH = 16;
const IV_BYTE_LENGTH = 12; // Standard 96-bit IV for AES-GCM

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToBuffer(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function computeSHA256(data: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-256', enc.encode(data));
  return bufferToHex(digest);
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedPackage {
  ciphertext: string; // Base64
  iv: string; // Base64
  salt: string; // Base64
  checksum: string; // SHA-256 hex of original plaintext
  algorithm: 'AES-256-GCM';
  iterations: number;
  timestamp: string;
}

export async function encryptData(payload: unknown, passphrase: string): Promise<EncryptedPackage> {
  const jsonString = JSON.stringify(payload);
  const checksum = await computeSHA256(jsonString);

  // Generate cryptographically secure random salt & IV
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_BYTE_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_BYTE_LENGTH));

  const key = await deriveKey(passphrase, salt);
  const encodedPayload = new TextEncoder().encode(jsonString);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128, // 128-bit authentication tag
    },
    key,
    encodedPayload
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
    checksum,
    algorithm: 'AES-256-GCM',
    iterations: PBKDF2_ITERATIONS,
    timestamp: new Date().toISOString(),
  };
}

export async function decryptData(pkg: EncryptedPackage, passphrase: string): Promise<any> {
  const salt = base64ToBuffer(pkg.salt);
  const iv = base64ToBuffer(pkg.iv);
  const ciphertext = base64ToBuffer(pkg.ciphertext);

  const key = await deriveKey(passphrase, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
        tagLength: 128,
      },
      key,
      ciphertext as BufferSource
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    
    // Verify cryptographic integrity
    if (pkg.checksum) {
      const actualChecksum = await computeSHA256(decryptedText);
      if (actualChecksum !== pkg.checksum) {
        throw new Error('Cryptographic integrity check failed: payload was tampered with.');
      }
    }

    return JSON.parse(decryptedText);
  } catch (err: any) {
    throw new Error('Decryption failed. Invalid master passphrase or corrupted ciphertext.');
  }
}
