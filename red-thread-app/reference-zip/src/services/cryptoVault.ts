/**
 * Web Crypto API AES-256-GCM Encrypted Storage Engine
 * Derives 256-bit encryption key using PBKDF2 with SHA-256
 */

export class CryptoVaultService {
  private static defaultSalt = new TextEncoder().encode('aegis-android-security-salt-2026');

  /**
   * Derives an AES-GCM key from a user passphrase or biometric key
   */
  private static async deriveKey(passphrase: string): Promise<CryptoKey> {
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
        salt: this.defaultSalt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts plain text string using AES-256-GCM
   */
  public static async encrypt(plainText: string, passphrase = 'aegis-master-vault-key'): Promise<{
    cipherTextBase64: string;
    ivHex: string;
    checksum: string;
  }> {
    const key = await this.deriveKey(passphrase);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedData = enc.encode(plainText);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedData
    );

    // Compute SHA-256 checksum of plain data for tamper detection
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);

    const cipherBytes = new Uint8Array(cipherBuffer);
    let binary = '';
    for (let i = 0; i < cipherBytes.byteLength; i++) {
      binary += String.fromCharCode(cipherBytes[i]);
    }
    const cipherTextBase64 = btoa(binary);

    const ivHex = Array.from(iv)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      cipherTextBase64,
      ivHex,
      checksum,
    };
  }

  /**
   * Decrypts AES-256-GCM ciphertext
   */
  public static async decrypt(
    cipherTextBase64: string,
    ivHex: string,
    passphrase = 'aegis-master-vault-key'
  ): Promise<string> {
    try {
      const key = await this.deriveKey(passphrase);
      
      const ivBytes = new Uint8Array(
        ivHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
      );

      const binary = atob(cipherTextBase64);
      const cipherBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        cipherBytes[i] = binary.charCodeAt(i);
      }

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBytes,
        },
        key,
        cipherBytes
      );

      const dec = new TextDecoder();
      return dec.decode(decryptedBuffer);
    } catch (err) {
      throw new Error('Decryption failed: Invalid passphrase or corrupted ciphertext');
    }
  }
}
