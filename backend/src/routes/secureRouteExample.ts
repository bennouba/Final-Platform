import { Router } from 'express';
import { authenticate } from '@middleware/auth';
import {
  rateLimiters,
  csrfProtection,
} from '@middleware/securityMiddleware';
import {
  authenticationHardening,
  resetAuthenticationAttempts,
  require2FA,
  deviceFingerprintVerification,
  checkUserBlockStatus,
  concurrentSessionLimit,
  sessionTimeout,
} from '@middleware/enhancedAuthMiddleware';

const router = Router();

/**
 * EXAMPLE 1: Secure Login Route with Authentication Hardening
 * Protections: Rate Limiting, Input Validation, Login Attempts Tracking, 2FA
 */
router.post(
  '/login',
  rateLimiters.auth,
  authenticationHardening('email'),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
      }

      // Find user and verify password logic here
      // If credentials valid, reset login attempts
      resetAuthenticationAttempts(email)(req, res, () => {
        // Generate 2FA code and send via email
        const twoFACode = Math.random().toString().slice(2, 8);

        res.json({
          success: true,
          message: '2FA code sent to your email',
          requiresVerification: true,
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

/**
 * EXAMPLE 2: 2FA Verification Route
 * Protections: 2FA Code Verification, Rate Limiting
 */
router.post(
  '/verify-2fa',
  rateLimiters.auth,
  require2FA('email'),
  async (req, res) => {
    try {
      // User is already verified if middleware passes
      res.json({
        success: true,
        message: '2FA verification successful',
        token: 'jwt_token_here',
      });
    } catch (error) {
      res.status(500).json({ error: '2FA verification failed' });
    }
  }
);

/**
 * EXAMPLE 3: Secure API Endpoint with All Protections
 * Protections: Authentication, CSRF, Rate Limiting, Device Fingerprint,
 *             User Block Status, Session Timeout, Concurrent Session Limit
 */
router.post(
  '/api/sensitive-operation',
  authenticate,
  csrfProtection,
  rateLimiters.api,
  deviceFingerprintVerification,
  checkUserBlockStatus,
  sessionTimeout(30 * 60 * 1000),
  concurrentSessionLimit(3),
  async (req, res) => {
    try {
      // All security checks passed, proceed with operation
      res.json({
        success: true,
        message: 'Sensitive operation completed safely',
      });
    } catch (error) {
      res.status(500).json({ error: 'Operation failed' });
    }
  }
);

/**
 * EXAMPLE 4: Payment/High-Value Operation Route
 * Protections: Enhanced Rate Limiting, CSRF, 2FA, Device Fingerprint
 */
router.post(
  '/api/payment',
  authenticate,
  rateLimiters.payment,
  csrfProtection,
  require2FA('email'),
  deviceFingerprintVerification,
  async (req, res) => {
    try {
      const { amount, recipient } = req.body;

      // Validate and process payment
      res.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: 'txn_123456',
      });
    } catch (error) {
      res.status(500).json({ error: 'Payment failed' });
    }
  }
);

/**
 * EXAMPLE 5: File Upload Route
 * Protections: Upload Rate Limiting, File Type Validation, CSRF
 */
router.post(
  '/api/upload',
  authenticate,
  rateLimiters.upload,
  csrfProtection,
  async (req, res) => {
    try {
      // File upload logic here with validation
      res.json({
        success: true,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

/**
 * EXAMPLE 6: Search Route with Query Protection
 * Protections: Search Rate Limiting, Input Sanitization (via middleware)
 */
router.get(
  '/api/search',
  rateLimiters.search,
  async (req, res) => {
    try {
      const { q, category, sort } = req.query;

      // Search logic here - inputs are already sanitized by middleware
      res.json({
        success: true,
        results: [],
      });
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  }
);

/**
 * EXAMPLE 7: Logout Route
 * Protections: Terminate user sessions securely
 */
router.post(
  '/logout',
  authenticate,
  async (req, res) => {
    try {
      // Terminate session logic here
      req.session?.destroy(() => {
        res.json({
          success: true,
          message: 'Logged out successfully',
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }
);

export default router;
