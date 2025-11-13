import { Response, NextFunction } from 'express';
import { AuthRequest, JWTPayload } from '@shared-types/index';
import { extractTokenFromHeader, verifyToken } from '@utils/jwt';
import { sendUnauthorized } from '@utils/response';
import logger from '@utils/logger';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      sendUnauthorized(res, 'Missing authorization header');
      return;
    }

    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      sendUnauthorized(res, 'Invalid authorization format');
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      sendUnauthorized(res, 'Invalid or expired token');
      return;
    }

    req.user = decoded as JWTPayload;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    sendUnauthorized(res, 'Authentication failed');
  }
};

export const optional = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      next();
      return;
    }

    const decoded = verifyToken(token);

    if (decoded) {
      req.user = decoded as JWTPayload;
    }

    next();
  } catch (error) {
    logger.warn('Optional authentication warning:', error);
    next();
  }
};
