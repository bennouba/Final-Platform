import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { securityManager } from '@security/index';
import { sendError, sendUnauthorized } from '@utils/response';
import logger from '@utils/logger';

export interface SecurityRequest extends Request {
  csrfToken?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

/**
 * CSRF Protection Middleware
 * Generates and validates CSRF tokens for state-changing operations
 */
export const csrfProtection = (req: SecurityRequest, res: Response, next: NextFunction): void => {
  try {
    const sessionId = req.sessionID || req.headers['x-session-id'] as string || req.ip;

    if (!sessionId) {
      logger.warn('CSRF protection: No session identifier');
      sendError(res, 'Session identifier required', 400);
      return;
    }

    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      const token = securityManager.generateCSRFToken(sessionId);
      res.setHeader('X-CSRF-Token', token);
      next();
      return;
    }

    const token =
      (req.headers['x-csrf-token'] as string) ||
      (req.body?.csrfToken as string) ||
      (req.query?.csrfToken as string);

    if (!token) {
      logger.warn(`CSRF protection: No token provided for ${req.method} ${req.path}`);
      sendError(res, 'CSRF token missing', 403, 'CSRF_TOKEN_MISSING');
      return;
    }

    if (!securityManager.verifyCSRFToken(sessionId, token)) {
      logger.warn(`CSRF protection: Invalid token for ${req.method} ${req.path}`);
      sendError(res, 'CSRF token invalid', 403, 'CSRF_TOKEN_INVALID');
      return;
    }

    next();
  } catch (error) {
    logger.error('CSRF protection error:', error);
    sendError(res, 'CSRF protection failed', 500);
  }
};

/**
 * XSS Protection Middleware
 * Sanitizes request body to prevent XSS attacks
 */
export const xssProtection = (req: SecurityRequest, res: Response, next: NextFunction): void => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = securityManager.sanitizeXSS(req.body, 'moderate');
    }

    if (req.query && typeof req.query === 'object') {
      const sanitizedQuery: Record<string, any> = {};
      for (const [key, value] of Object.entries(req.query)) {
        sanitizedQuery[key] = securityManager.sanitizeXSS(value, 'strict');
      }
      req.query = sanitizedQuery;
    }

    if (req.params && typeof req.params === 'object') {
      const sanitizedParams: Record<string, any> = {};
      for (const [key, value] of Object.entries(req.params)) {
        sanitizedParams[key] = securityManager.sanitizeXSS(value, 'strict');
      }
      req.params = sanitizedParams;
    }

    next();
  } catch (error) {
    logger.error('XSS protection error:', error);
    sendError(res, 'XSS protection failed', 500);
  }
};

/**
 * SQL Injection Prevention Middleware
 * Validates input for SQL injection patterns
 */
export const sqlInjectionPrevention = (req: SecurityRequest, res: Response, next: NextFunction): void => {
  try {
    const validateInput = (data: any, path: string = ''): boolean => {
      if (!data || typeof data !== 'object') {
        return securityManager.validateInputForSQLInjection(data, path);
      }

      if (Array.isArray(data)) {
        return data.every((item, index) =>
          validateInput(item, `${path}[${index}]`)
        );
      }

      for (const [key, value] of Object.entries(data)) {
        if (!securityManager.validateInputForSQLInjection(key, `${path}.${key}`) ||
            !validateInput(value, `${path}.${key}`)) {
          return false;
        }
      }

      return true;
    };

    if (!validateInput(req.body, 'body')) {
      logger.warn(`SQL injection attempt detected in body for ${req.method} ${req.path}`);
      sendError(res, 'Suspicious input detected', 400, 'SUSPICIOUS_INPUT');
      return;
    }

    if (!validateInput(req.query, 'query')) {
      logger.warn(`SQL injection attempt detected in query for ${req.method} ${req.path}`);
      sendError(res, 'Suspicious input detected', 400, 'SUSPICIOUS_INPUT');
      return;
    }

    if (!validateInput(req.params, 'params')) {
      logger.warn(`SQL injection attempt detected in params for ${req.method} ${req.path}`);
      sendError(res, 'Suspicious input detected', 400, 'SUSPICIOUS_INPUT');
      return;
    }

    next();
  } catch (error) {
    logger.error('SQL injection prevention error:', error);
    sendError(res, 'Security validation failed', 500);
  }
};

/**
 * Authentication Hardening Middleware
 * Tracks login attempts and implements account lockout
 */
export const authenticationHardening = (identifier: string) => {
  return (req: SecurityRequest, res: Response, next: NextFunction): void => {
    try {
      const loginIdentifier = req.body?.[identifier] || req.ip || 'unknown';

      const { allowed, remainingAttempts } = securityManager.trackLoginAttempt(
        String(loginIdentifier).toLowerCase()
      );

      if (!allowed) {
        logger.warn(`Authentication hardening: Account lockout for ${loginIdentifier}`);
        sendUnauthorized(res, 'Too many failed login attempts. Please try again later.');
        res.setHeader('Retry-After', securityManager.trackLoginAttempt(String(loginIdentifier).toLowerCase()));
        return;
      }

      res.setHeader('X-Remaining-Attempts', String(remainingAttempts));
      next();
    } catch (error) {
      logger.error('Authentication hardening error:', error);
      next();
    }
  };
};

/**
 * Reset login attempts after successful authentication
 */
export const resetAuthenticationAttempts = (identifier: string) => {
  return (req: SecurityRequest, res: Response, next: NextFunction): void => {
    try {
      const loginIdentifier = req.body?.[identifier] || req.ip || 'unknown';
      securityManager.resetLoginAttempts(String(loginIdentifier).toLowerCase());
      next();
    } catch (error) {
      logger.error('Reset authentication attempts error:', error);
      next();
    }
  };
};

/**
 * Advanced Rate Limiting with endpoint-specific configuration
 */
export const createAdvancedRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: options.message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req: Request) => req.ip || 'unknown'),
    skip: (req: Request) => {
      if (options.skipSuccessfulRequests && req.statusCode >= 200 && req.statusCode < 300) {
        return true;
      }
      if (options.skipFailedRequests && (req.statusCode >= 400 || req.statusCode >= 500)) {
        return true;
      }
      return false;
    },
  });
};

/**
 * Endpoint-specific rate limiters
 */
export const rateLimiters = {
  auth: createAdvancedRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  }),

  api: createAdvancedRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: 'Too many API requests, please try again later',
  }),

  upload: createAdvancedRateLimiter({
    windowMs: 1 * 60 * 60 * 1000,
    max: 10,
    message: 'Too many upload requests, please try again later',
  }),

  payment: createAdvancedRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: 'Too many payment requests, please try again later',
  }),

  search: createAdvancedRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: 'Too many search requests, please try again later',
  }),

  createEndpointLimiter: (windowMs: number, max: number) => {
    return createAdvancedRateLimiter({ windowMs, max });
  },
};

/**
 * Security Headers Middleware
 * Set security-related HTTP headers
 */
export const securityHeaders = (req: SecurityRequest, res: Response, next: NextFunction): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

/**
 * Comprehensive security middleware that applies all protections
 */
export const comprehensiveSecurityMiddleware = (req: SecurityRequest, res: Response, next: NextFunction): void => {
  try {
    sqlInjectionPrevention(req, res, () => {
      xssProtection(req, res, () => {
        securityHeaders(req, res, next);
      });
    });
  } catch (error) {
    logger.error('Comprehensive security middleware error:', error);
    sendError(res, 'Security check failed', 500);
  }
};

/**
 * Middleware to sanitize response data before sending
 */
export const sanitizeResponse = (req: SecurityRequest, res: Response, next: NextFunction): void => {
  const originalJson = res.json;

  res.json = function (data: any) {
    try {
      const sanitized = securityManager.sanitizeXSS(data, 'moderate');
      return originalJson.call(this, sanitized);
    } catch (error) {
      logger.error('Response sanitization error:', error);
      return originalJson.call(this, data);
    }
  };

  next();
};
