import { Request, Response, NextFunction } from 'express';
import {
  csrfProtection,
  xssProtection,
  sqlInjectionPrevention,
  authenticationHardening,
  securityHeaders,
  sanitizeResponse,
} from '@middleware/securityMiddleware';
import { securityManager } from '@security/index';

jest.mock('@security/index');
jest.mock('@utils/logger');
jest.mock('@utils/response');

describe('Security Middleware Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/api/test',
      ip: '127.0.0.1',
      sessionID: 'test-session-123',
      headers: {},
      body: {},
      query: {},
      params: {},
    };

    res = {
      setHeader: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe('CSRF Protection Middleware', () => {
    beforeEach(() => {
      (securityManager.generateCSRFToken as jest.Mock).mockReturnValue('mock-csrf-token');
      (securityManager.verifyCSRFToken as jest.Mock).mockReturnValue(true);
    });

    it('should generate CSRF token for GET requests', (done) => {
      req.method = 'GET';

      csrfProtection(req as any, res as any, () => {
        expect(securityManager.generateCSRFToken).toHaveBeenCalledWith('test-session-123');
        expect(res.setHeader).toHaveBeenCalledWith('X-CSRF-Token', 'mock-csrf-token');
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should verify CSRF token for POST requests', (done) => {
      req.method = 'POST';
      req.headers = { 'x-csrf-token': 'valid-token' };

      csrfProtection(req as any, res as any, () => {
        expect(securityManager.verifyCSRFToken).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should reject POST requests without CSRF token', (done) => {
      req.method = 'POST';
      req.headers = {};

      csrfProtection(req as any, res as any, () => {
        expect(next).not.toHaveBeenCalled();
        done();
      });
    });

    it('should accept CSRF token from body', (done) => {
      req.method = 'PUT';
      req.body = { csrfToken: 'body-token' };

      csrfProtection(req as any, res as any, () => {
        expect(securityManager.verifyCSRFToken).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('XSS Protection Middleware', () => {
    beforeEach(() => {
      (securityManager.sanitizeXSS as jest.Mock).mockImplementation((input) => {
        if (typeof input === 'string') {
          return input.replace(/<[^>]*>/g, '');
        }
        return input;
      });
    });

    it('should sanitize request body', (done) => {
      req.body = { name: '<script>alert("xss")</script>' };

      xssProtection(req as any, res as any, () => {
        expect(securityManager.sanitizeXSS).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should sanitize query parameters', (done) => {
      req.query = { search: '<img src=x onerror="alert(1)">' };

      xssProtection(req as any, res as any, () => {
        expect(securityManager.sanitizeXSS).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should sanitize URL parameters', (done) => {
      req.params = { id: '<svg onload="alert(1)">' };

      xssProtection(req as any, res as any, () => {
        expect(securityManager.sanitizeXSS).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should handle null body gracefully', (done) => {
      req.body = null;

      xssProtection(req as any, res as any, () => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('SQL Injection Prevention Middleware', () => {
    beforeEach(() => {
      (securityManager.validateInputForSQLInjection as jest.Mock).mockReturnValue(true);
    });

    it('should validate body for SQL injection', (done) => {
      req.body = { username: 'admin', password: 'password' };

      sqlInjectionPrevention(req as any, res as any, () => {
        expect(securityManager.validateInputForSQLInjection).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should reject SQL injection attempts in query', (done) => {
      req.query = { id: "1; DROP TABLE users; --" };
      (securityManager.validateInputForSQLInjection as jest.Mock).mockReturnValue(false);

      sqlInjectionPrevention(req as any, res as any, () => {
        expect(next).not.toHaveBeenCalled();
        done();
      });
    });

    it('should validate nested objects', (done) => {
      req.body = {
        user: {
          profile: {
            bio: 'normal text',
          },
        },
      };

      sqlInjectionPrevention(req as any, res as any, () => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should validate array inputs', (done) => {
      req.body = {
        ids: [1, 2, 3],
      };

      sqlInjectionPrevention(req as any, res as any, () => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Authentication Hardening Middleware', () => {
    beforeEach(() => {
      (securityManager.trackLoginAttempt as jest.Mock).mockReturnValue({
        allowed: true,
        remainingAttempts: 5,
      });
    });

    it('should allow login with remaining attempts', (done) => {
      req.body = { email: 'test@example.com', password: 'password' };
      const middleware = authenticationHardening('email');

      middleware(req as any, res as any, () => {
        expect(securityManager.trackLoginAttempt).toHaveBeenCalledWith('test@example.com');
        expect(res.setHeader).toHaveBeenCalledWith('X-Remaining-Attempts', '5');
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should block login after max attempts', (done) => {
      (securityManager.trackLoginAttempt as jest.Mock).mockReturnValue({
        allowed: false,
        remainingAttempts: 0,
      });
      req.body = { email: 'test@example.com', password: 'wrong' };
      const middleware = authenticationHardening('email');

      middleware(req as any, res as any, () => {
        expect(next).not.toHaveBeenCalled();
        done();
      });
    });

    it('should use IP address as fallback identifier', (done) => {
      req.body = {};
      req.ip = '192.168.1.1';
      const middleware = authenticationHardening('email');

      middleware(req as any, res as any, () => {
        expect(securityManager.trackLoginAttempt).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Security Headers Middleware', () => {
    it('should set all security headers', (done) => {
      securityHeaders(req as any, res as any, () => {
        expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
        expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
        expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
        expect(res.setHeader).toHaveBeenCalledWith('Strict-Transport-Security', expect.any(String));
        expect(res.setHeader).toHaveBeenCalledWith('Content-Security-Policy', expect.any(String));
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should include correct CSP values', (done) => {
      securityHeaders(req as any, res as any, () => {
        const cspCalls = (res.setHeader as jest.Mock).mock.calls.filter(
          (call) => call[0] === 'Content-Security-Policy'
        );
        expect(cspCalls.length).toBeGreaterThan(0);
        expect(cspCalls[0][1]).toContain("default-src 'self'");
        done();
      });
    });
  });

  describe('Response Sanitization Middleware', () => {
    it('should sanitize response data', (done) => {
      const responseData = { message: 'Hello <script>alert(1)</script>' };
      (securityManager.sanitizeXSS as jest.Mock).mockReturnValue({
        message: 'Hello alert(1)',
      });

      const originalJson = jest.fn();
      res.json = originalJson as any;

      sanitizeResponse(req as any, res as any, () => {
        const modifiedJson = res.json;
        if (modifiedJson) {
          modifiedJson.call(res, responseData);
          expect(securityManager.sanitizeXSS).toHaveBeenCalled();
        }
        expect(next).toHaveBeenCalled();
        done();
      });
    });

    it('should handle sanitization errors gracefully', (done) => {
      (securityManager.sanitizeXSS as jest.Mock).mockImplementation(() => {
        throw new Error('Sanitization error');
      });

      const originalJson = jest.fn();
      res.json = originalJson as any;

      sanitizeResponse(req as any, res as any, () => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in CSRF protection', (done) => {
      req.sessionID = undefined;
      req.headers = {};
      req.ip = undefined;

      csrfProtection(req as any, res as any, () => {
        expect(next).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle errors in XSS protection', (done) => {
      (securityManager.sanitizeXSS as jest.Mock).mockImplementation(() => {
        throw new Error('XSS error');
      });
      req.body = { data: 'test' };

      xssProtection(req as any, res as any, () => {
        expect(next).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
