import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '@shared-types/index';
import { sendForbidden } from '@utils/response';
import logger from '@utils/logger';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        sendForbidden(res, 'User information not found');
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`Forbidden: User ${req.user.id} with role ${req.user.role} tried to access restricted resource`);
        sendForbidden(res, 'Insufficient permissions for this operation', {
          required: allowedRoles,
          current: req.user.role,
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      sendForbidden(res, 'Authorization check failed');
    }
  };
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireRole([UserRole.ADMIN])(req, res, next);
};

export const isMerchant = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireRole([UserRole.MERCHANT, UserRole.ADMIN])(req, res, next);
};

export const isCustomer = (req: AuthRequest, res: Response, next: NextFunction): void => {
  requireRole([UserRole.CUSTOMER, UserRole.MERCHANT, UserRole.ADMIN])(req, res, next);
};

export const requireOwnership = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      sendForbidden(res, 'User information not found');
      return;
    }

    const resourceUserId = req.params.userId || req.body.userId;

    if (req.user.id !== resourceUserId && req.user.role !== UserRole.ADMIN) {
      logger.warn(`Forbidden: User ${req.user.id} tried to access resource of user ${resourceUserId}`);
      sendForbidden(res, 'You do not have permission to access this resource');
      return;
    }

    next();
  } catch (error) {
    logger.error('Ownership check error:', error);
    sendForbidden(res, 'Ownership check failed');
  }
};
