import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from '@utils/logger';

export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousRequests: number;
  timestamp: number;
}

class AdvancedSecurityMiddleware {
  private metrics: Map<string, SecurityMetrics> = new Map();
  private suspiciousIPs: Map<string, number> = new Map();
  private ddosThreshold = 100;
  private ddosWindow = 60000;

  getEnhancedHelmet() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xFrameOptions: { action: 'deny' },
      xContentTypeOptions: { nosniff: true },
      xXssProtection: { mode: 'block' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      permissionsPolicy: {
        features: {
          geolocation: ["'none'"],
          microphone: ["'none'"],
          camera: ["'none'"],
          payment: ["'none'"],
          usb: ["'none'"],
          gyroscope: ["'none'"],
          magnetometer: ["'none'"],
        },
      },
    });
  }

  getEnhancedRateLimiting() {
    return {
      auth: rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: 'Too many authentication attempts',
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req: Request) => req.method === 'OPTIONS',
        keyGenerator: (req: Request) => `auth:${req.ip}:${req.body?.email || 'unknown'}`,
      }),

      api: rateLimit({
        windowMs: 60 * 1000,
        max: 100,
        message: 'Too many API requests',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req: Request) => `api:${req.ip}`,
      }),

      upload: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 20,
        message: 'Too many upload attempts',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req: Request) => `upload:${req.ip}`,
      }),

      payment: rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 3,
        message: 'Too many payment attempts',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req: Request) => `payment:${req.ip}`,
      }),

      search: rateLimit({
        windowMs: 60 * 1000,
        max: 60,
        message: 'Too many search requests',
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req: Request) => `search:${req.ip}`,
      }),
    };
  }

  ddosDetectionMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const window = this.ddosWindow;

      let metrics = this.metrics.get(ip);
      if (!metrics || now - metrics.timestamp > window) {
        metrics = {
          totalRequests: 0,
          blockedRequests: 0,
          suspiciousRequests: 0,
          timestamp: now,
        };
        this.metrics.set(ip, metrics);
      }

      metrics.totalRequests++;

      if (metrics.totalRequests > this.ddosThreshold) {
        metrics.blockedRequests++;

        if (!this.suspiciousIPs.has(ip)) {
          this.suspiciousIPs.set(ip, 1);
        } else {
          this.suspiciousIPs.set(ip, (this.suspiciousIPs.get(ip) || 0) + 1);
        }

        logger.warn(`DDoS Detection: Potential attack from IP ${ip}`, {
          requestCount: metrics.totalRequests,
          timestamp: new Date().toISOString(),
        });

        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: 60,
        });
      }

      res.setHeader('X-RateLimit-Limit', this.ddosThreshold);
      res.setHeader(
        'X-RateLimit-Remaining',
        Math.max(0, this.ddosThreshold - metrics.totalRequests)
      );

      next();
    };
  }

  ipWhitelistMiddleware(whitelist: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.connection.remoteAddress;

      if (!whitelist.includes(ip!)) {
        logger.warn(`IP not whitelisted: ${ip}`);
        return res.status(403).json({ error: 'IP not whitelisted' });
      }

      next();
    };
  }

  ipBlacklistMiddleware(blacklist: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.connection.remoteAddress;

      if (blacklist.includes(ip!)) {
        logger.warn(`IP blacklisted: ${ip}`);
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    };
  }

  requestSignatureMiddleware(secret: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const signature = req.headers['x-signature'] as string;
      const timestamp = req.headers['x-timestamp'] as string;

      if (!signature || !timestamp) {
        return res.status(400).json({ error: 'Missing signature or timestamp' });
      }

      const now = Date.now();
      const requestTime = parseInt(timestamp, 10);

      if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
        return res.status(401).json({ error: 'Request expired' });
      }

      const crypto = require('crypto');
      const body = JSON.stringify(req.body || '');
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${body}${timestamp}`)
        .digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        logger.warn('Invalid request signature', { ip: req.ip });
        return res.status(401).json({ error: 'Invalid signature' });
      }

      next();
    };
  }

  requestValidationMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const contentType = req.headers['content-type'];

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (!contentType || !contentType.includes('application/json')) {
          return res
            .status(400)
            .json({ error: 'Content-Type must be application/json' });
        }
      }

      if (req.headers['accept-encoding']) {
        const encodings = req.headers['accept-encoding'].split(',');
        if (
          !encodings.some(enc =>
            ['gzip', 'deflate', 'br', 'identity'].some(a =>
              enc.toLowerCase().includes(a)
            )
          )
        ) {
          return res.status(400).json({
            error: 'Unsupported Accept-Encoding',
          });
        }
      }

      next();
    };
  }

  getUserAgentValidationMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const userAgent = req.headers['user-agent'] || '';

      if (!userAgent) {
        logger.warn('Request with no User-Agent', { ip: req.ip });
      }

      if (userAgent.length > 500) {
        return res.status(400).json({
          error: 'Invalid User-Agent',
        });
      }

      next();
    };
  }

  methodValidationMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

      if (!allowedMethods.includes(req.method)) {
        logger.warn(`Invalid HTTP method: ${req.method}`, { ip: req.ip });
        return res.status(405).json({
          error: 'Method not allowed',
        });
      }

      next();
    };
  }

  sizeLimitMiddleware(options: { bodyLimit: number; paramLimit: number } = {
    bodyLimit: 1024 * 100,
    paramLimit: 2048,
  }) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'GET' || req.method === 'HEAD') {
        const querySize = new URLSearchParams(req.url.split('?')[1] || '').toString().length;
        if (querySize > options.paramLimit) {
          return res.status(413).json({
            error: 'Query string too large',
          });
        }
      }

      next();
    };
  }

  getMetrics() {
    const metricsArray = Array.from(this.metrics.entries()).map(([ip, metrics]) => ({
      ip,
      ...metrics,
    }));

    const suspiciousArray = Array.from(this.suspiciousIPs.entries()).map(([ip, count]) => ({
      ip,
      suspiciousCount: count,
    }));

    return {
      allMetrics: metricsArray,
      suspiciousIPs: suspiciousArray,
      totalMonitoredIPs: this.metrics.size,
      totalBlockedIPs: this.suspiciousIPs.size,
    };
  }

  resetMetrics() {
    this.metrics.clear();
    this.suspiciousIPs.clear();
    logger.info('Security metrics reset');
  }

  cleanupOldMetrics() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000;

    for (const [ip, metrics] of this.metrics.entries()) {
      if (now - metrics.timestamp > maxAge) {
        this.metrics.delete(ip);
      }
    }
  }
}

export const advancedSecurityMiddleware = new AdvancedSecurityMiddleware();
export default AdvancedSecurityMiddleware;
