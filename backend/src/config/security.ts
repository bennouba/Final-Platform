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
  private encryptionKey: Buffer;
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

    // Generate or load encryption key
    this.encryptionKey = this.getEncryptionKey();
  }

  /**
   * Get or generate encryption key
   */
  private getEncryptionKey(): Buffer {
    const keyEnv = process.env.ENCRYPTION_KEY;
    if (keyEnv) {
      return Buffer.from(keyEnv, 'hex');
    }

    // Generate new key (in production, this should be stored securely)
    const key = crypto.randomBytes(this.config.keyLength);
    logger.warn('⚠️  Using generated encryption key. Set ENCRYPTION_KEY environment variable for production!');
    return key;
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.config.ivLength);
      const cipher = crypto.createCipher(this.config.algorithm, this.encryptionKey);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Return format: iv:encrypted
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];

      const decipher = crypto.createDecipher(this.config.algorithm, this.encryptionKey);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, this.config.saltRounds);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Sanitize data by removing sensitive fields
   */
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

  /**
   * Check if data contains sensitive information
   */
  containsSensitiveData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    return this.SENSITIVE_FIELDS.some(field =>
      Object.prototype.hasOwnProperty.call(data, field) && data[field]
    );
  }

  /**
   * Generate secure hash for payment verification
   */
  generatePaymentHash(data: Record<string, any>, secret: string): string {
    const sortedKeys = Object.keys(data).sort();
    const values = sortedKeys.map(key => String(data[key])).join('');

    return crypto.createHmac('sha256', secret)
      .update(values)
      .digest('hex');
  }

  /**
   * Validate data integrity
   */
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

  /**
   * Rate limiting helper
   */
  generateRateLimitKey(identifier: string, action: string): string {
    return crypto.createHash('sha256')
      .update(`${identifier}:${action}:${Date.now()}`)
      .digest('hex');
  }
}

// Export singleton instance
const securityManager = new SecurityManager();

export default securityManager;

// Export class for testing
export { SecurityManager };
