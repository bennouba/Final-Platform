import crypto from 'crypto';
import xss from 'xss';
import logger from '@utils/logger';

export interface SecurityConfig {
  enableCSRFProtection: boolean;
  enableXSSProtection: boolean;
  enableSQLInjectionPrevention: boolean;
  enableAuthenticationHardening: boolean;
  enableRateLimiting: boolean;
  csrfTokenLength: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export const defaultSecurityConfig: SecurityConfig = {
  enableCSRFProtection: true,
  enableXSSProtection: true,
  enableSQLInjectionPrevention: true,
  enableAuthenticationHardening: true,
  enableRateLimiting: true,
  csrfTokenLength: 32,
  sessionTimeout: 24 * 60 * 60 * 1000,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,
};

class ComprehensiveSecurityManager {
  private config: SecurityConfig;
  private csrfTokens: Map<string, { token: string; createdAt: number }> = new Map();
  private loginAttempts: Map<string, { count: number; timestamp: number }> = new Map();
  private xssOptions = {
    whiteList: {
      p: [],
      br: [],
      strong: [],
      em: [],
      u: [],
      h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
      ul: [], ol: [], li: [],
      a: ['href', 'title'],
      img: ['src', 'alt'],
      table: [], thead: [], tbody: [], tr: [], th: [], td: [],
    },
    stripIgnoreTag: true,
    stripLeakage: true,
    css: false,
    onTagAttr: (tag: string, name: string, value: string) => {
      if (name === 'href' || name === 'src') {
        if (value.toLowerCase().startsWith('javascript:') || 
            value.toLowerCase().startsWith('data:') ||
            value.toLowerCase().startsWith('vbscript:')) {
          return '';
        }
      }
      return `${name}="${this.escapeHtml(value)}"`;
    },
  };

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultSecurityConfig, ...config };
    this.cleanupTokens();
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  private cleanupTokens(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.csrfTokens.entries()) {
        if (now - value.createdAt > 24 * 60 * 60 * 1000) {
          this.csrfTokens.delete(key);
        }
      }
      for (const [key, value] of this.loginAttempts.entries()) {
        if (now - value.timestamp > this.config.lockoutDuration) {
          this.loginAttempts.delete(key);
        }
      }
    }, 60 * 60 * 1000);
  }

  /**
   * SQL INJECTION PREVENTION
   * Validates input for potential SQL injection patterns
   */
  validateInputForSQLInjection(input: any, fieldName: string = 'input'): boolean {
    if (!input) return true;

    const sqlInjectionPatterns = [
      /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|JAVASCRIPT|ONERROR|ONCLICK)\b)/gi,
      /(-{2}|\/\*|\*\/|;|'|")/g,
      /(xp_|sp_|cmd\.exe|powershell|bash|sh)\b/gi,
      /(<script|<iframe|<img|<svg|javascript:|data:|vbscript:)/gi,
      /(\||&|`|\$\()/g,
    ];

    const stringInput = String(input).toLowerCase();

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(stringInput)) {
        logger.warn(`SQL Injection attempt detected in field: ${fieldName}`, {
          input: input.substring(0, 100),
          pattern: pattern.source,
        });
        return false;
      }
    }

    return true;
  }

  sanitizeInputForSQL(input: any): any {
    if (input === null || input === undefined) {
      return null;
    }

    if (typeof input === 'string') {
      if (!this.validateInputForSQLInjection(input)) {
        throw new Error('Suspicious input detected');
      }
      return input.trim().replace(/\0/g, '\\0').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    }

    if (typeof input === 'object') {
      if (Array.isArray(input)) {
        return input.map((item) => this.sanitizeInputForSQL(item));
      }
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(input)) {
        if (!this.validateInputForSQLInjection(key, `key: ${key}`)) {
          throw new Error(`Suspicious key detected: ${key}`);
        }
        sanitized[key] = this.sanitizeInputForSQL(value);
      }
      return sanitized;
    }

    return input;
  }

  /**
   * CSRF PROTECTION
   * Generate and verify CSRF tokens
   */
  generateCSRFToken(sessionId: string): string {
    const token = crypto.randomBytes(this.config.csrfTokenLength).toString('hex');
    this.csrfTokens.set(sessionId, {
      token: crypto.createHash('sha256').update(token).digest('hex'),
      createdAt: Date.now(),
    });
    return token;
  }

  verifyCSRFToken(sessionId: string, token: string): boolean {
    if (!sessionId || !token) {
      logger.warn('CSRF verification failed: missing sessionId or token');
      return false;
    }

    const storedToken = this.csrfTokens.get(sessionId);
    if (!storedToken) {
      logger.warn(`CSRF verification failed: token not found for session ${sessionId}`);
      return false;
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const isValid = crypto.timingSafeEqual(
      Buffer.from(tokenHash),
      Buffer.from(storedToken.token)
    );

    if (isValid) {
      this.csrfTokens.delete(sessionId);
    }

    return isValid;
  }

  /**
   * XSS PREVENTION
   * Sanitize user input and encode output
   */
  sanitizeXSS(input: any, level: 'strict' | 'moderate' | 'permissive' = 'moderate'): any {
    if (input === null || input === undefined) {
      return null;
    }

    if (typeof input === 'string') {
      let sanitized = xss(input, this.xssOptions);

      if (level === 'strict') {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
      }

      return sanitized;
    }

    if (typeof input === 'object') {
      if (Array.isArray(input)) {
        return input.map((item) => this.sanitizeXSS(item, level));
      }
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeXSS(value, level);
      }
      return sanitized;
    }

    return input;
  }

  encodeOutput(text: string, type: 'html' | 'attribute' | 'javascript' | 'url' = 'html'): string {
    if (!text) return '';

    switch (type) {
      case 'html':
        return this.escapeHtml(text);

      case 'attribute':
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

      case 'javascript':
        return text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r');

      case 'url':
        return encodeURIComponent(text);

      default:
        return this.escapeHtml(text);
    }
  }

  /**
   * AUTHENTICATION HARDENING
   * Enhanced authentication mechanisms
   */
  trackLoginAttempt(identifier: string): { allowed: boolean; remainingAttempts: number } {
    const now = Date.now();
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt || now - attempt.timestamp > this.config.lockoutDuration) {
      this.loginAttempts.set(identifier, { count: 1, timestamp: now });
      return { allowed: true, remainingAttempts: this.config.maxLoginAttempts - 1 };
    }

    if (attempt.count >= this.config.maxLoginAttempts) {
      logger.warn(`Account locked due to excessive login attempts: ${identifier}`);
      return { allowed: false, remainingAttempts: 0 };
    }

    attempt.count++;
    attempt.timestamp = now;
    return {
      allowed: true,
      remainingAttempts: this.config.maxLoginAttempts - attempt.count,
    };
  }

  resetLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  generatePasswordHash(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha256')
      .toString('hex');
  }

  generateSecureRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Password must be at least 8 characters');

    if (password.length >= 12) score++;
    else if (password.length >= 8) feedback.push('Longer passwords are stronger');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Add numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('Add special characters for extra security');

    return {
      valid: score >= 4,
      score,
      feedback,
    };
  }

  /**
   * API RATE LIMITING
   * Advanced rate limiting with multiple strategies
   */
  createRateLimitStore() {
    const requests: Map<string, number[]> = new Map();

    return {
      recordRequest: (key: string, windowMs: number = 60000): boolean => {
        const now = Date.now();
        const times = requests.get(key) || [];

        const validTimes = times.filter((time) => now - time < windowMs);

        validTimes.push(now);
        requests.set(key, validTimes);

        return true;
      },

      isRateLimited: (key: string, max: number, windowMs: number = 60000): boolean => {
        const now = Date.now();
        const times = requests.get(key) || [];

        const validTimes = times.filter((time) => now - time < windowMs);

        return validTimes.length >= max;
      },

      getRemaining: (key: string, max: number, windowMs: number = 60000): number => {
        const now = Date.now();
        const times = requests.get(key) || [];

        const validTimes = times.filter((time) => now - time < windowMs);

        return Math.max(0, max - validTimes.length);
      },

      reset: (key: string): void => {
        requests.delete(key);
      },

      cleanup: (): void => {
        const now = Date.now();
        for (const [key, times] of requests.entries()) {
          const validTimes = times.filter((time) => now - time < 60 * 60 * 1000);
          if (validTimes.length === 0) {
            requests.delete(key);
          } else {
            requests.set(key, validTimes);
          }
        }
      },
    };
  }
}

export const securityManager = new ComprehensiveSecurityManager();
export default ComprehensiveSecurityManager;
