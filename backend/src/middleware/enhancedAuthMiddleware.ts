import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '@shared-types/index';
import { sendUnauthorized, sendError } from '@utils/response';
import logger from '@utils/logger';

export interface TwoFactorOptions {
  enabled: boolean;
  method: '2fa' | 'email' | 'sms';
  timeout: number;
}

export interface SessionSecurityOptions {
  maxConcurrentSessions: number;
  enableDeviceFingerprinting: boolean;
  enableGeoLocation: boolean;
}

interface DeviceFingerprint {
  userAgent: string;
  ipAddress: string;
  timestamp: number;
}

interface SessionData {
  id: string;
  userId: string;
  fingerprint: DeviceFingerprint;
  createdAt: number;
  lastActivity: number;
}

/**
 * Enhanced Authentication Manager
 * Handles 2FA, device fingerprinting, session management
 */
class EnhancedAuthenticationManager {
  private twoFactorCodes: Map<string, { code: string; expiresAt: number; attempts: number }> = new Map();
  private activeSessions: Map<string, SessionData[]> = new Map();
  private blockedUsers: Map<string, { expiresAt: number }> = new Map();

  constructor(private options: { twoFactorTimeout?: number } = {}) {
    this.cleanupExpiredData();
  }

  /**
   * Generate 2FA Code
   */
  generate2FACode(userId: string, method: 'email' | 'sms' = 'email'): {
    code: string;
    expiresAt: number;
    method: string;
  } {
    const code = Math.random().toString().slice(2, 8);
    const expiresAt = Date.now() + (this.options.twoFactorTimeout || 5 * 60 * 1000);

    this.twoFactorCodes.set(`${userId}:${method}`, {
      code,
      expiresAt,
      attempts: 0,
    });

    logger.info(`2FA code generated for user ${userId} via ${method}`);

    return {
      code,
      expiresAt,
      method,
    };
  }

  /**
   * Verify 2FA Code
   */
  verify2FACode(userId: string, code: string, method: 'email' | 'sms' = 'email'): {
    valid: boolean;
    remaining: number;
  } {
    const key = `${userId}:${method}`;
    const codeData = this.twoFactorCodes.get(key);

    if (!codeData) {
      logger.warn(`2FA code not found for user ${userId}`);
      return { valid: false, remaining: 0 };
    }

    if (Date.now() > codeData.expiresAt) {
      logger.warn(`2FA code expired for user ${userId}`);
      this.twoFactorCodes.delete(key);
      return { valid: false, remaining: 0 };
    }

    codeData.attempts++;

    if (codeData.attempts > 3) {
      logger.warn(`Too many 2FA attempts for user ${userId}`);
      this.twoFactorCodes.delete(key);
      return { valid: false, remaining: 0 };
    }

    if (code === codeData.code) {
      logger.info(`2FA code verified successfully for user ${userId}`);
      this.twoFactorCodes.delete(key);
      return { valid: true, remaining: 0 };
    }

    return { valid: false, remaining: 3 - codeData.attempts };
  }

  /**
   * Create Device Fingerprint
   */
  createDeviceFingerprint(req: AuthRequest): DeviceFingerprint {
    return {
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || '',
      timestamp: Date.now(),
    };
  }

  /**
   * Compare Device Fingerprints
   */
  compareFingerprints(fp1: DeviceFingerprint, fp2: DeviceFingerprint): boolean {
    return fp1.userAgent === fp2.userAgent && fp1.ipAddress === fp2.ipAddress;
  }

  /**
   * Register Session
   */
  registerSession(userId: string, sessionId: string, fingerprint: DeviceFingerprint): void {
    const sessions = this.activeSessions.get(userId) || [];

    const newSession: SessionData = {
      id: sessionId,
      userId,
      fingerprint,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };

    sessions.push(newSession);
    this.activeSessions.set(userId, sessions);

    logger.info(`Session registered for user ${userId}: ${sessionId}`);
  }

  /**
   * Update Session Activity
   */
  updateSessionActivity(userId: string, sessionId: string): boolean {
    const sessions = this.activeSessions.get(userId);
    if (!sessions) return false;

    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      session.lastActivity = Date.now();
      return true;
    }

    return false;
  }

  /**
   * Verify Session Integrity
   */
  verifySessionIntegrity(
    userId: string,
    sessionId: string,
    fingerprint: DeviceFingerprint
  ): { valid: boolean; reason?: string } {
    const sessions = this.activeSessions.get(userId);
    if (!sessions) {
      return { valid: false, reason: 'No active sessions' };
    }

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }

    if (!this.compareFingerprints(session.fingerprint, fingerprint)) {
      logger.warn(`Session fingerprint mismatch for user ${userId}`);
      return { valid: false, reason: 'Device fingerprint mismatch' };
    }

    return { valid: true };
  }

  /**
   * Terminate Session
   */
  terminateSession(userId: string, sessionId: string): boolean {
    const sessions = this.activeSessions.get(userId);
    if (!sessions) return false;

    const index = sessions.findIndex((s) => s.id === sessionId);
    if (index > -1) {
      sessions.splice(index, 1);
      if (sessions.length === 0) {
        this.activeSessions.delete(userId);
      }
      return true;
    }

    return false;
  }

  /**
   * Terminate All Sessions
   */
  terminateAllSessions(userId: string): void {
    this.activeSessions.delete(userId);
    logger.info(`All sessions terminated for user ${userId}`);
  }

  /**
   * Invalidate User (Block Login)
   */
  invalidateUser(userId: string, duration: number = 15 * 60 * 1000): void {
    this.blockedUsers.set(userId, {
      expiresAt: Date.now() + duration,
    });
    this.terminateAllSessions(userId);
    logger.warn(`User ${userId} invalidated until ${new Date(Date.now() + duration).toISOString()}`);
  }

  /**
   * Check if User is Blocked
   */
  isUserBlocked(userId: string): boolean {
    const blocked = this.blockedUsers.get(userId);
    if (!blocked) return false;

    if (Date.now() > blocked.expiresAt) {
      this.blockedUsers.delete(userId);
      return false;
    }

    return true;
  }

  /**
   * Cleanup Expired Data
   */
  private cleanupExpiredData(): void {
    setInterval(() => {
      const now = Date.now();

      for (const [key, data] of this.twoFactorCodes.entries()) {
        if (now > data.expiresAt) {
          this.twoFactorCodes.delete(key);
        }
      }

      for (const [userId, sessions] of this.activeSessions.entries()) {
        const activeSessions = sessions.filter((s) => now - s.lastActivity < 24 * 60 * 60 * 1000);
        if (activeSessions.length === 0) {
          this.activeSessions.delete(userId);
        } else {
          this.activeSessions.set(userId, activeSessions);
        }
      }

      for (const [userId, blocked] of this.blockedUsers.entries()) {
        if (now > blocked.expiresAt) {
          this.blockedUsers.delete(userId);
        }
      }
    }, 60 * 1000);
  }

  /**
   * Get Active Sessions for User
   */
  getActiveSessions(userId: string): SessionData[] {
    return this.activeSessions.get(userId) || [];
  }
}

export const enhancedAuthManager = new EnhancedAuthenticationManager({
  twoFactorTimeout: 5 * 60 * 1000,
});

/**
 * Middleware: Device Fingerprint Verification
 */
export const deviceFingerprintVerification = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user?.id) {
      next();
      return;
    }

    const fingerprint = enhancedAuthManager.createDeviceFingerprint(req);
    const sessionId = req.sessionID;

    if (sessionId) {
      const verification = enhancedAuthManager.verifySessionIntegrity(
        req.user.id,
        sessionId,
        fingerprint
      );

      if (!verification.valid) {
        logger.warn(`Device fingerprint verification failed for user ${req.user.id}: ${verification.reason}`);
        sendUnauthorized(res, 'Session verification failed. Please login again.');
        enhancedAuthManager.terminateAllSessions(req.user.id);
        return;
      }

      enhancedAuthManager.updateSessionActivity(req.user.id, sessionId);
    }

    next();
  } catch (error) {
    logger.error('Device fingerprint verification error:', error);
    next();
  }
};

/**
 * Middleware: Check if User is Blocked
 */
export const checkUserBlockStatus = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user?.id) {
      next();
      return;
    }

    if (enhancedAuthManager.isUserBlocked(req.user.id)) {
      logger.warn(`Blocked user attempted access: ${req.user.id}`);
      sendUnauthorized(res, 'Your account has been temporarily blocked. Please try again later.');
      return;
    }

    next();
  } catch (error) {
    logger.error('User block status check error:', error);
    next();
  }
};

/**
 * Middleware: Require 2FA Verification
 */
export const require2FA = (method: 'email' | 'sms' = 'email') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const verificationCode = req.headers['x-2fa-code'] as string;

      if (!verificationCode || !req.user?.id) {
        sendError(res, '2FA verification required', 403, '2FA_REQUIRED');
        return;
      }

      const verification = enhancedAuthManager.verify2FACode(req.user.id, verificationCode, method);

      if (!verification.valid) {
        sendError(
          res,
          '2FA code invalid or expired',
          403,
          '2FA_INVALID',
          { remaining: verification.remaining }
        );
        return;
      }

      next();
    } catch (error) {
      logger.error('2FA verification middleware error:', error);
      sendError(res, '2FA verification failed', 500);
    }
  };
};

/**
 * Middleware: Session Timeout Protection
 */
export const sessionTimeout = (timeoutMs: number = 30 * 60 * 1000) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.session) {
        next();
        return;
      }

      if (req.session.lastActivity) {
        const elapsed = Date.now() - req.session.lastActivity;

        if (elapsed > timeoutMs) {
          logger.info(`Session timeout for user ${req.user?.id}`);
          req.session.destroy(() => {
            sendUnauthorized(res, 'Your session has expired. Please login again.');
          });
          return;
        }
      }

      req.session.lastActivity = Date.now();
      next();
    } catch (error) {
      logger.error('Session timeout middleware error:', error);
      next();
    }
  };
};

/**
 * Middleware: Concurrent Session Limit
 */
export const concurrentSessionLimit = (maxSessions: number = 3) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user?.id) {
        next();
        return;
      }

      const activeSessions = enhancedAuthManager.getActiveSessions(req.user.id);

      if (activeSessions.length >= maxSessions) {
        logger.warn(
          `Concurrent session limit exceeded for user ${req.user.id}. Active: ${activeSessions.length}, Max: ${maxSessions}`
        );
        sendError(
          res,
          `Maximum concurrent sessions (${maxSessions}) exceeded. Please logout from other devices.`,
          403,
          'SESSION_LIMIT_EXCEEDED'
        );
        return;
      }

      next();
    } catch (error) {
      logger.error('Concurrent session limit middleware error:', error);
      next();
    }
  };
};

export default EnhancedAuthenticationManager;
