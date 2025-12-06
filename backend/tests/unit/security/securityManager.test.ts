import ComprehensiveSecurityManager from '@security/index';

jest.mock('@utils/logger');

describe('ComprehensiveSecurityManager Unit Tests', () => {
  let securityManager: ComprehensiveSecurityManager;

  beforeEach(() => {
    securityManager = new ComprehensiveSecurityManager();
  });

  describe('SQL Injection Prevention', () => {
    describe('validateInputForSQLInjection', () => {
      it('should accept normal input', () => {
        expect(securityManager.validateInputForSQLInjection('John Doe')).toBe(true);
        expect(securityManager.validateInputForSQLInjection('user@example.com')).toBe(true);
        expect(securityManager.validateInputForSQLInjection('Product description 123')).toBe(true);
      });

      it('should reject SQL keywords', () => {
        expect(securityManager.validateInputForSQLInjection('SELECT * FROM users')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('INSERT INTO table')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('DELETE FROM users')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('UPDATE users SET')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('DROP TABLE users')).toBe(false);
      });

      it('should reject SQL operators', () => {
        expect(securityManager.validateInputForSQLInjection("admin' OR '1'='1")).toBe(false);
        expect(securityManager.validateInputForSQLInjection('1; DROP TABLE users')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('1 UNION SELECT')).toBe(false);
      });

      it('should reject command execution attempts', () => {
        expect(securityManager.validateInputForSQLInjection('xp_cmdshell')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('sp_executesql')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('cmd.exe')).toBe(false);
      });

      it('should reject script injection patterns', () => {
        expect(securityManager.validateInputForSQLInjection('<script>alert(1)</script>')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('javascript:alert(1)')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('data:text/html,<script>alert(1)</script>')).toBe(false);
      });

      it('should handle null and undefined', () => {
        expect(securityManager.validateInputForSQLInjection(null)).toBe(true);
        expect(securityManager.validateInputForSQLInjection(undefined)).toBe(true);
      });

      it('should be case-insensitive', () => {
        expect(securityManager.validateInputForSQLInjection('select * from users')).toBe(false);
        expect(securityManager.validateInputForSQLInjection('Select * From Users')).toBe(false);
      });
    });

    describe('sanitizeInputForSQL', () => {
      it('should sanitize string input', () => {
        const input = "test'string";
        const result = securityManager.sanitizeInputForSQL(input);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

      it('should throw on malicious input', () => {
        expect(() => {
          securityManager.sanitizeInputForSQL('SELECT * FROM users');
        }).toThrow();
      });

      it('should sanitize arrays', () => {
        const input = ['value1', 'value2'];
        const result = securityManager.sanitizeInputForSQL(input);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
      });

      it('should sanitize objects', () => {
        const input = { name: 'John', email: 'john@example.com' };
        const result = securityManager.sanitizeInputForSQL(input);
        expect(typeof result).toBe('object');
        expect(result.name).toBe('John');
        expect(result.email).toBe('john@example.com');
      });

      it('should handle null values', () => {
        expect(securityManager.sanitizeInputForSQL(null)).toBe(null);
        expect(securityManager.sanitizeInputForSQL(undefined)).toBe(undefined);
      });
    });
  });

  describe('CSRF Protection', () => {
    describe('generateCSRFToken', () => {
      it('should generate a valid token', () => {
        const token = securityManager.generateCSRFToken('session-1');
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
      });

      it('should generate different tokens for same session', () => {
        const token1 = securityManager.generateCSRFToken('session-1');
        const token2 = securityManager.generateCSRFToken('session-1');
        expect(token1).not.toBe(token2);
      });

      it('should generate different tokens for different sessions', () => {
        const token1 = securityManager.generateCSRFToken('session-1');
        const token2 = securityManager.generateCSRFToken('session-2');
        expect(token1).not.toBe(token2);
      });
    });

    describe('verifyCSRFToken', () => {
      it('should verify valid token', () => {
        const sessionId = 'session-123';
        const token = securityManager.generateCSRFToken(sessionId);
        const isValid = securityManager.verifyCSRFToken(sessionId, token);
        expect(isValid).toBe(true);
      });

      it('should reject invalid token', () => {
        const sessionId = 'session-123';
        securityManager.generateCSRFToken(sessionId);
        const isValid = securityManager.verifyCSRFToken(sessionId, 'invalid-token');
        expect(isValid).toBe(false);
      });

      it('should reject missing session', () => {
        const token = securityManager.generateCSRFToken('session-123');
        const isValid = securityManager.verifyCSRFToken('unknown-session', token);
        expect(isValid).toBe(false);
      });

      it('should reject missing token', () => {
        securityManager.generateCSRFToken('session-123');
        const isValid = securityManager.verifyCSRFToken('session-123', '');
        expect(isValid).toBe(false);
      });

      it('should delete token after verification', () => {
        const sessionId = 'session-123';
        const token = securityManager.generateCSRFToken(sessionId);
        securityManager.verifyCSRFToken(sessionId, token);
        const secondVerify = securityManager.verifyCSRFToken(sessionId, token);
        expect(secondVerify).toBe(false);
      });

      it('should be resilient to timing attacks', () => {
        const sessionId = 'session-123';
        const validToken = securityManager.generateCSRFToken(sessionId);
        const invalidToken = 'a'.repeat(validToken.length);
        
        expect(() => {
          securityManager.verifyCSRFToken(sessionId, invalidToken);
        }).not.toThrow();
      });
    });
  });

  describe('XSS Prevention', () => {
    describe('sanitizeXSS', () => {
      it('should sanitize script tags in strict mode', () => {
        const input = '<script>alert("xss")</script>Hello';
        const result = securityManager.sanitizeXSS(input, 'strict');
        expect(result).not.toContain('<script>');
        expect(result).toContain('Hello');
      });

      it('should allow safe HTML in moderate mode', () => {
        const input = '<p>Hello <strong>World</strong></p>';
        const result = securityManager.sanitizeXSS(input, 'moderate');
        expect(result).toContain('Hello');
        expect(result).toContain('World');
      });

      it('should remove dangerous attributes', () => {
        const input = '<img src="x" onerror="alert(1)">';
        const result = securityManager.sanitizeXSS(input, 'moderate');
        expect(result).not.toContain('onerror');
      });

      it('should remove javascript: URLs', () => {
        const input = '<a href="javascript:alert(1)">Click</a>';
        const result = securityManager.sanitizeXSS(input, 'moderate');
        expect(result).not.toContain('javascript:');
      });

      it('should sanitize arrays', () => {
        const input = ['<script>alert(1)</script>', 'safe text'];
        const result = securityManager.sanitizeXSS(input, 'strict') as any[];
        expect(Array.isArray(result)).toBe(true);
        expect(result[1]).toBe('safe text');
      });

      it('should sanitize objects', () => {
        const input = { name: '<script>alert(1)</script>', bio: 'Developer' };
        const result = securityManager.sanitizeXSS(input, 'strict') as any;
        expect(result.name).not.toContain('<script>');
        expect(result.bio).toBe('Developer');
      });

      it('should handle null and undefined', () => {
        expect(securityManager.sanitizeXSS(null)).toBe(null);
        expect(securityManager.sanitizeXSS(undefined)).toBe(undefined);
      });
    });

    describe('encodeOutput', () => {
      it('should encode HTML entities', () => {
        const result = securityManager.encodeOutput('<script>', 'html');
        expect(result).toBe('&lt;script&gt;');
      });

      it('should encode attribute values', () => {
        const result = securityManager.encodeOutput('value"test', 'attribute');
        expect(result).toContain('&quot;');
      });

      it('should encode JavaScript strings', () => {
        const result = securityManager.encodeOutput('line1\nline2', 'javascript');
        expect(result).toContain('\\n');
      });

      it('should encode URLs', () => {
        const result = securityManager.encodeOutput('hello world', 'url');
        expect(result).toBe('hello%20world');
      });

      it('should handle empty strings', () => {
        expect(securityManager.encodeOutput('', 'html')).toBe('');
        expect(securityManager.encodeOutput('', 'url')).toBe('');
      });
    });
  });

  describe('Authentication Hardening', () => {
    describe('trackLoginAttempt', () => {
      it('should allow first login attempt', () => {
        const result = securityManager.trackLoginAttempt('user@example.com');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBeGreaterThan(0);
      });

      it('should increment attempt counter', () => {
        securityManager.trackLoginAttempt('user@example.com');
        const result = securityManager.trackLoginAttempt('user@example.com');
        expect(result.remainingAttempts).toBeLessThan(4);
      });

      it('should block after max attempts', () => {
        for (let i = 0; i < 5; i++) {
          securityManager.trackLoginAttempt('user@example.com');
        }
        const result = securityManager.trackLoginAttempt('user@example.com');
        expect(result.allowed).toBe(false);
        expect(result.remainingAttempts).toBe(0);
      });

      it('should track different identifiers separately', () => {
        securityManager.trackLoginAttempt('user1@example.com');
        const result = securityManager.trackLoginAttempt('user2@example.com');
        expect(result.allowed).toBe(true);
        expect(result.remainingAttempts).toBeGreaterThan(0);
      });
    });

    describe('resetLoginAttempts', () => {
      it('should reset login attempts', () => {
        securityManager.trackLoginAttempt('user@example.com');
        securityManager.trackLoginAttempt('user@example.com');
        securityManager.resetLoginAttempts('user@example.com');
        const result = securityManager.trackLoginAttempt('user@example.com');
        expect(result.remainingAttempts).toBeGreaterThan(3);
      });
    });

    describe('Password validation', () => {
      it('validatePasswordStrength - should validate strong password', () => {
        const result = securityManager.validatePasswordStrength('MyP@ssw0rd123');
        expect(result.valid).toBe(true);
        expect(result.score).toBeGreaterThanOrEqual(4);
      });

      it('validatePasswordStrength - should reject weak password', () => {
        const result = securityManager.validatePasswordStrength('weak');
        expect(result.valid).toBe(false);
        expect(result.feedback.length).toBeGreaterThan(0);
      });

      it('validatePasswordStrength - should provide feedback', () => {
        const result = securityManager.validatePasswordStrength('password');
        expect(Array.isArray(result.feedback)).toBe(true);
      });
    });

    describe('generateSecureRandomToken', () => {
      it('should generate random tokens', () => {
        const token1 = securityManager.generateSecureRandomToken(32);
        const token2 = securityManager.generateSecureRandomToken(32);
        expect(token1).not.toBe(token2);
      });

      it('should generate tokens of specified length', () => {
        const token = securityManager.generateSecureRandomToken(64);
        expect(token.length).toBe(128);
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should create rate limit store', () => {
      const store = securityManager.createRateLimitStore();
      expect(store).toBeDefined();
      expect(typeof store.recordRequest).toBe('function');
      expect(typeof store.isRateLimited).toBe('function');
      expect(typeof store.getRemaining).toBe('function');
    });

    it('should track requests', () => {
      const store = securityManager.createRateLimitStore();
      store.recordRequest('user-1', 60000);
      store.recordRequest('user-1', 60000);
      const remaining = store.getRemaining('user-1', 5, 60000);
      expect(remaining).toBe(3);
    });

    it('should detect rate limit exceeded', () => {
      const store = securityManager.createRateLimitStore();
      for (let i = 0; i < 5; i++) {
        store.recordRequest('user-1', 60000);
      }
      const isLimited = store.isRateLimited('user-1', 5, 60000);
      expect(isLimited).toBe(true);
    });

    it('should reset rate limit', () => {
      const store = securityManager.createRateLimitStore();
      store.recordRequest('user-1', 60000);
      store.reset('user-1');
      const remaining = store.getRemaining('user-1', 5, 60000);
      expect(remaining).toBe(5);
    });
  });
});
