import request from 'supertest';
import express, { Express } from 'express';
import { securityManager } from '@security/index';
import {
  csrfProtection,
  xssProtection,
  sqlInjectionPrevention,
  securityHeaders,
  comprehensiveSecurityMiddleware,
} from '@middleware/securityMiddleware';

jest.mock('@utils/logger');
jest.mock('@utils/response');

describe('Security Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
      req.sessionID = 'test-session-123';
      next();
    });

    app.use(securityHeaders);
    app.use(comprehensiveSecurityMiddleware);
  });

  describe('CSRF Protection Integration', () => {
    beforeEach(() => {
      app.get('/api/get-csrf-token', csrfProtection, (req, res) => {
        const token = req.headers['x-csrf-token'];
        res.json({ token });
      });

      app.post('/api/protected', csrfProtection, (req, res) => {
        res.json({ success: true });
      });
    });

    it('should get CSRF token from GET request', async () => {
      const response = await request(app)
        .get('/api/get-csrf-token')
        .expect(200);

      expect(response.headers['x-csrf-token']).toBeDefined();
    });

    it('should accept POST with valid CSRF token', async () => {
      const tokenResponse = await request(app).get('/api/get-csrf-token');
      const token = tokenResponse.headers['x-csrf-token'];

      const postResponse = await request(app)
        .post('/api/protected')
        .set('x-csrf-token', token)
        .send({ data: 'test' });

      expect(postResponse.status).toBe(200);
    });

    it('should reject POST without CSRF token', async () => {
      const response = await request(app)
        .post('/api/protected')
        .send({ data: 'test' });

      expect(response.status).toBe(403);
    });

    it('should reject POST with invalid CSRF token', async () => {
      const response = await request(app)
        .post('/api/protected')
        .set('x-csrf-token', 'invalid-token')
        .send({ data: 'test' });

      expect(response.status).toBe(403);
    });

    it('should accept CSRF token from request body', async () => {
      const tokenResponse = await request(app).get('/api/get-csrf-token');
      const token = tokenResponse.headers['x-csrf-token'];

      const postResponse = await request(app)
        .post('/api/protected')
        .send({ data: 'test', csrfToken: token });

      expect(postResponse.status).toBe(200);
    });
  });

  describe('XSS Protection Integration', () => {
    beforeEach(() => {
      app.post('/api/xss-test', xssProtection, (req, res) => {
        res.json({ received: req.body });
      });

      app.get('/api/xss-query', xssProtection, (req, res) => {
        res.json({ query: req.query });
      });
    });

    it('should sanitize XSS in request body', async () => {
      const response = await request(app)
        .post('/api/xss-test')
        .send({ name: '<script>alert("xss")</script>Hello' });

      expect(response.status).toBe(200);
      expect(response.body.received.name).not.toContain('<script>');
    });

    it('should sanitize XSS in query parameters', async () => {
      const response = await request(app)
        .get('/api/xss-query')
        .query({ search: '<img src=x onerror="alert(1)">' });

      expect(response.status).toBe(200);
      expect(response.body.query.search).not.toContain('onerror');
    });

    it('should preserve safe content', async () => {
      const response = await request(app)
        .post('/api/xss-test')
        .send({ name: 'John Doe', email: 'john@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.received.name).toBe('John Doe');
      expect(response.body.received.email).toBe('john@example.com');
    });
  });

  describe('SQL Injection Prevention Integration', () => {
    beforeEach(() => {
      app.post('/api/safe-query', sqlInjectionPrevention, (req, res) => {
        res.json({ received: req.body });
      });

      app.get('/api/search', sqlInjectionPrevention, (req, res) => {
        res.json({ query: req.query });
      });
    });

    it('should accept normal input', async () => {
      const response = await request(app)
        .post('/api/safe-query')
        .send({ username: 'john', password: 'secure123' });

      expect(response.status).toBe(200);
    });

    it('should reject SQL injection in body', async () => {
      const response = await request(app)
        .post('/api/safe-query')
        .send({ username: "admin' OR '1'='1", password: 'anything' });

      expect(response.status).toBe(400);
    });

    it('should reject SQL injection in query', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ id: '1; DROP TABLE users; --' });

      expect(response.status).toBe(400);
    });

    it('should reject SQL keywords', async () => {
      const response = await request(app)
        .post('/api/safe-query')
        .send({ data: 'SELECT * FROM users' });

      expect(response.status).toBe(400);
    });
  });

  describe('Security Headers Integration', () => {
    beforeEach(() => {
      app.get('/api/headers', (req, res) => {
        res.json({ success: true });
      });
    });

    it('should include security headers in response', async () => {
      const response = await request(app).get('/api/headers');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['content-security-policy']).toBeDefined();
    });

    it('should include referrer policy header', async () => {
      const response = await request(app).get('/api/headers');
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    it('should include permissions policy header', async () => {
      const response = await request(app).get('/api/headers');
      expect(response.headers['permissions-policy']).toBeDefined();
    });
  });

  describe('Combined Security Protections', () => {
    beforeEach(() => {
      app.post('/api/user/register', csrfProtection, sqlInjectionPrevention, xssProtection, (req, res) => {
        res.json({ success: true, user: req.body });
      });
    });

    it('should apply all protections in sequence', async () => {
      const tokenResponse = await request(app).get('/api/get-csrf-token');
      const token = tokenResponse.headers['x-csrf-token'];

      const response = await request(app)
        .post('/api/user/register')
        .set('x-csrf-token', token)
        .send({
          username: 'john_doe',
          email: 'john@example.com',
          password: 'SecurePass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject if any protection fails', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          username: "admin' OR '1'='1",
          email: 'attacker@example.com',
          password: 'pass',
        });

      expect(response.status).toBe(400);
    });

    it('should work with nested objects', async () => {
      const tokenResponse = await request(app).get('/api/get-csrf-token');
      const token = tokenResponse.headers['x-csrf-token'];

      app.post('/api/nested', csrfProtection, comprehensiveSecurityMiddleware, (req, res) => {
        res.json({ received: req.body });
      });

      const response = await request(app)
        .post('/api/nested')
        .set('x-csrf-token', token)
        .send({
          user: {
            profile: {
              bio: 'I am a developer',
              interests: ['coding', 'security', 'testing'],
            },
          },
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      app.post('/api/edge-case', comprehensiveSecurityMiddleware, (req, res) => {
        res.json({ received: req.body });
      });
    });

    it('should handle empty requests', async () => {
      const response = await request(app)
        .post('/api/edge-case')
        .send({});

      expect(response.status).toBe(200);
    });

    it('should handle null values', async () => {
      const response = await request(app)
        .post('/api/edge-case')
        .send({ value: null });

      expect(response.status).toBe(200);
    });

    it('should handle special characters', async () => {
      const response = await request(app)
        .post('/api/edge-case')
        .send({ value: '!@#$%^&*()_+-=[]{}|;:\'",.<>?/' });

      expect(response.status).toBe(200);
    });

    it('should handle unicode characters', async () => {
      const response = await request(app)
        .post('/api/edge-case')
        .send({ value: 'مرحبا العالم 你好世界 Привет мир' });

      expect(response.status).toBe(200);
    });

    it('should handle large payloads', async () => {
      const largeData = 'x'.repeat(10000);
      const response = await request(app)
        .post('/api/edge-case')
        .send({ value: largeData });

      expect(response.status).toBe(200);
    });
  });

  describe('Performance Under Load', () => {
    beforeEach(() => {
      app.post('/api/perf-test', comprehensiveSecurityMiddleware, (req, res) => {
        res.json({ success: true });
      });
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() =>
          request(app)
            .post('/api/perf-test')
            .send({ test: 'data' })
        );

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should maintain consistent response times', async () => {
      const times: number[] = [];

      for (let i = 0; i < 5; i++) {
        const start = Date.now();
        await request(app)
          .post('/api/perf-test')
          .send({ test: 'data' });
        times.push(Date.now() - start);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxDeviation = Math.max(...times.map((t) => Math.abs(t - avgTime)));

      expect(maxDeviation).toBeLessThan(100);
    });
  });
});
