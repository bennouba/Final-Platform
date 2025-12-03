import crypto from 'crypto';
import logger from '@utils/logger';

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  saltRounds: number;
}

class SecurityManager {
  private config: EncryptionConfig;
  private modernEncryptionKey: Buffer;
  private legacyEncryptionKey: Buffer;
  private readonly SENSITIVE_FIELDS = [
    'password',
    'credit_card',
    'cvv',
    'transaction_id',
    'secure_hash',
    'gateway_response'
  ];

  constructor() {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      saltRounds: 12
    };

    this.modernEncryptionKey = this.getModernKey();
    this.legacyEncryptionKey = this.getLegacyKey();
  }

  private getModernKey(): Buffer {
    const keyEnv = process.env.ENCRYPTION_KEY;
    if (keyEnv) {
      return Buffer.from(keyEnv, 'hex');
    }

    const key = crypto.randomBytes(this.config.keyLength);
    logger.warn('⚠️  Using generated encryption key. Set ENCRYPTION_KEY environment variable for production!');
    return key;
  }

  private getLegacyKey(): Buffer {
    const keyEnv = process.env.LEGACY_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
    if (keyEnv) {
      return Buffer.from(keyEnv, 'hex');
    }

    return crypto.randomBytes(this.config.keyLength);
  }

  private encryptModern(text: string): string {
    try {
      const iv = crypto.randomBytes(this.config.ivLength);
      const cipher = crypto.createCipheriv(this.config.algorithm, this.modernEncryptionKey, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return `v2:${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
    } catch (error) {
      logger.error('Modern encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private decryptModern(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts[0] !== 'v2' || parts.length !== 4) {
        throw new Error('Invalid modern encryption format');
      }

      const [, iv, encrypted, authTag] = parts;

      const decipher = crypto.createDecipheriv(
        this.config.algorithm,
        this.modernEncryptionKey,
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Modern decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  private encryptLegacy(text: string): string {
    try {
      const cipher = crypto.createCipher('aes-256-gcm', this.legacyEncryptionKey);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return `v1:${encrypted}`;
    } catch (error) {
      logger.error('Legacy encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private decryptLegacy(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts[0] !== 'v1') {
        throw new Error('Invalid legacy encryption format');
      }

      const decipher = crypto.createDecipher('aes-256-gcm', this.legacyEncryptionKey);
      let decrypted = decipher.update(parts[1], 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Legacy decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  encrypt(text: string): string {
    return this.encryptModern(text);
  }

  decrypt(encryptedText: string): string {
    try {
      if (!encryptedText) {
        throw new Error('Cannot decrypt empty text');
      }

      const version = encryptedText.split(':')[0];

      switch (version) {
        case 'v2':
          return this.decryptModern(encryptedText);
        case 'v1':
          return this.decryptLegacy(encryptedText);
        default:
          logger.warn('Unknown encryption version, trying legacy...');
          return this.decryptLegacy(encryptedText);
      }
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  migrateEncryption(oldEncrypted: string): string {
    try {
      const decrypted = this.decryptLegacy(oldEncrypted);
      return this.encryptModern(decrypted);
    } catch (error) {
      logger.error('Encryption migration failed:', error);
      throw new Error('Failed to migrate encryption');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, this.config.saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  sanitizeData(data: any, fields: string[] = this.SENSITIVE_FIELDS): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };

    fields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  containsSensitiveData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    return this.SENSITIVE_FIELDS.some(field =>
      Object.prototype.hasOwnProperty.call(data, field) && data[field]
    );
  }

  generatePaymentHash(data: Record<string, any>, secret: string): string {
    const sortedKeys = Object.keys(data).sort();
    const values = sortedKeys.map(key => String(data[key])).join('');

    return crypto.createHmac('sha256', secret)
      .update(values)
      .digest('hex');
  }

  validateDataIntegrity(data: any, expectedHash: string, secret: string): boolean {
    try {
      const calculatedHash = this.generatePaymentHash(data, secret);
      return crypto.timingSafeEqual(
        Buffer.from(calculatedHash, 'hex'),
        Buffer.from(expectedHash, 'hex')
      );
    } catch (error) {
      logger.error('Data integrity validation failed:', error);
      return false;
    }
  }
}

export const securityManager = new SecurityManager();
export default securityManager;
