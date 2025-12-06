import Joi, { ValidationError, Schema } from 'joi';
import logger from '@utils/logger';

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  data?: any;
}

export interface SanitizationOptions {
  maxLength?: number;
  allowHTML?: boolean;
  allowSpecialChars?: boolean;
  allowUnicode?: boolean;
  trimWhitespace?: boolean;
}

class AdvancedValidator {
  private patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    phone: /^(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    creditCard: /^[0-9]{13,19}$/,
    sqlInjection: /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|JAVASCRIPT|ONERROR|ONCLICK)\b|(-{2}|\/\*|\*\/|;|'|")|xp_|sp_|cmd\.exe|powershell|bash|sh|<script|<iframe|<img|<svg|javascript:|data:|vbscript:|\||&|`|\$\()/gi,
    xssPatterns: /<script|<iframe|javascript:|onerror=|onclick=|on\w+=/gi,
    pathTraversal: /\.\.\//g,
  };

  validateEmail(email: string): boolean {
    return this.patterns.email.test(email);
  }

  validateUrl(url: string): boolean {
    return this.patterns.url.test(url);
  }

  validatePhone(phone: string): boolean {
    return this.patterns.phone.test(phone);
  }

  validateIPv4(ip: string): boolean {
    return this.patterns.ipv4.test(ip);
  }

  validateCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (!this.patterns.creditCard.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  detectSQLInjection(input: string): boolean {
    return this.patterns.sqlInjection.test(input);
  }

  detectXSS(input: string): boolean {
    return this.patterns.xssPatterns.test(input);
  }

  detectPathTraversal(input: string): boolean {
    return this.patterns.pathTraversal.test(input);
  }

  sanitizeInput(
    input: any,
    options: SanitizationOptions = {}
  ): any {
    const {
      maxLength = 5000,
      allowHTML = false,
      allowSpecialChars = true,
      allowUnicode = true,
      trimWhitespace = true,
    } = options;

    if (input === null || input === undefined) {
      return null;
    }

    if (typeof input === 'string') {
      let sanitized = input;

      if (trimWhitespace) {
        sanitized = sanitized.trim();
      }

      if (!allowHTML) {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
      }

      if (!allowSpecialChars) {
        sanitized = sanitized.replace(/[^\w\s-]/g, '');
      }

      if (!allowUnicode) {
        sanitized = sanitized.replace(/[^\x00-\x7F]/g, '');
      }

      if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
      }

      return sanitized;
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item, options));
    }

    if (typeof input === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value, options);
      }
      return sanitized;
    }

    return input;
  }

  validateAgainstSchema(data: any, schema: Schema): ValidationResult {
    try {
      const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger.warn('Schema validation failed', {
          errors: error.details.map(d => ({
            path: d.path.join('.'),
            message: d.message,
            type: d.type,
          })),
        });

        return {
          valid: false,
          errors: [error],
        };
      }

      return {
        valid: true,
        data: value,
      };
    } catch (error) {
      logger.error('Schema validation error:', error);
      return {
        valid: false,
        errors: [error as ValidationError],
      };
    }
  }

  validatePasswordPolicy(password: string): {
    valid: boolean;
    score: number;
    requirements: Record<string, boolean>;
    feedback: string[];
  } {
    const requirements = {
      minLength8: password.length >= 8,
      minLength12: password.length >= 12,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonPatterns: !/^(password|123456|qwerty|abc123)/i.test(password),
      noUserDataLeakage: true,
    };

    let score = 0;
    const feedback: string[] = [];

    Object.entries(requirements).forEach(([key, value]) => {
      if (value) score++;
      else {
        switch (key) {
          case 'minLength8':
            feedback.push('Password must be at least 8 characters');
            break;
          case 'minLength12':
            feedback.push('Consider using 12+ characters for extra security');
            break;
          case 'hasLowercase':
            feedback.push('Add lowercase letters (a-z)');
            break;
          case 'hasUppercase':
            feedback.push('Add uppercase letters (A-Z)');
            break;
          case 'hasNumbers':
            feedback.push('Add numbers (0-9)');
            break;
          case 'hasSpecialChars':
            feedback.push('Add special characters (!@#$%^&*...)');
            break;
          case 'noCommonPatterns':
            feedback.push('Avoid common patterns like password123');
            break;
        }
      }
    });

    return {
      valid: score >= 5,
      score,
      requirements,
      feedback,
    };
  }

  validateFileUpload(
    file: any,
    options: {
      allowedMimeTypes?: string[];
      maxFileSize?: number;
      allowedExtensions?: string[];
    } = {}
  ): { valid: boolean; error?: string } {
    const {
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'],
      maxFileSize = 5 * 1024 * 1024,
      allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'],
    } = options;

    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed (${maxFileSize} bytes)`,
      };
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `File type ${file.mimetype} not allowed`,
      };
    }

    const extension = file.originalname.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension .${extension} not allowed`,
      };
    }

    if (this.detectPathTraversal(file.originalname)) {
      return {
        valid: false,
        error: 'File name contains path traversal attempts',
      };
    }

    return { valid: true };
  }

  validateJSON(input: string): { valid: boolean; data?: any; error?: string } {
    try {
      const data = JSON.parse(input);
      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  }

  validateUUID(uuid: string): boolean {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  }

  validateBase64(input: string): boolean {
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (!base64Pattern.test(input)) return false;
    try {
      return btoa(atob(input)) === input;
    } catch {
      return false;
    }
  }

  createCommonSchemas() {
    return {
      auth: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
      }),

      user: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(2).max(100).required(),
        phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
      }),

      product: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        description: Joi.string().max(5000).optional(),
        price: Joi.number().min(0).required(),
        category: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(0).required(),
      }),

      payment: Joi.object({
        amount: Joi.number().positive().required(),
        currency: Joi.string().length(3).required(),
        method: Joi.string().valid('card', 'bank', 'wallet').required(),
      }),

      pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sort: Joi.string().optional(),
      }),
    };
  }
}

export const advancedValidator = new AdvancedValidator();
export default AdvancedValidator;
