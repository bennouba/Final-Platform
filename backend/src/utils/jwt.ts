import jwt from 'jsonwebtoken';
import config from '@config/environment';
import { JWTPayload } from '@shared-types/index';
import logger from './logger';

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expire,
    });
    return token;
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw new Error('Failed to generate authentication token');
  }
};

export const generateRefreshToken = (userId: string): string => {
  try {
    const token = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpire,
    });
    return token;
  } catch (error) {
    logger.error('Refresh token generation failed:', error);
    throw new Error('Failed to generate refresh token');
  }
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid token');
    }
    return null;
  }
};

export const verifyRefreshToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };
    return decoded;
  } catch (error) {
    logger.warn('Refresh token verification failed');
    return null;
  }
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded || !decoded.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
