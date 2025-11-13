import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '@shared-types/index';
import Coupon from '@models/Coupon';
import { sendSuccess, sendCreated, sendError, sendNotFound, sendUnauthorized, sendPaginated } from '@utils/response';
import { calculatePagination } from '@utils/helpers';
import logger from '@utils/logger';

export const createCoupon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    if (req.user.role !== UserRole.ADMIN) {
      sendError(res, 'Only admins can create coupons', 403, 'FORBIDDEN');
      return;
    }

    const {
      code,
      discountPercentage,
      discountAmount,
      minOrderAmount,
      maxOrderAmount,
      maxUses,
      maxUsage,
      maxUsesPerUser,
      expiresAt,
      isActive,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (existingCoupon) {
      sendError(res, 'Coupon code already exists', 409, 'COUPON_EXISTS');
      return;
    }

    const resolvedMaxUses = maxUses ?? maxUsage ?? undefined;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercentage,
      ...(discountAmount !== undefined && { discountAmount }),
      ...(minOrderAmount !== undefined && { minOrderAmount }),
      ...(maxOrderAmount !== undefined && { maxOrderAmount }),
      ...(resolvedMaxUses !== undefined && { maxUses: resolvedMaxUses }),
      currentUses: 0,
      ...(maxUsesPerUser !== undefined && { maxUsesPerUser }),
      ...(isActive !== undefined && { isActive }),
      ...(expiresAt ? { expiresAt: new Date(expiresAt) } : {}),
    });

    logger.info(`Coupon created: ${code}`);

    sendCreated(res, coupon);
  } catch (error) {
    logger.error('Create coupon error:', error);
    next(error);
  }
};

export const getCoupons = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    if (req.user.role !== UserRole.ADMIN) {
      sendError(res, 'Only admins can view all coupons', 403, 'FORBIDDEN');
      return;
    }

    const { page = 1, limit = 10 } = req.query;
    const { page: validPage, limit: validLimit, offset } = calculatePagination(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 10
    );

    const { count, rows: coupons } = await Coupon.findAndCountAll({
      offset,
      limit: validLimit,
      order: [['createdAt', 'DESC']],
    });

    logger.info(`Fetched ${coupons.length} coupons`);

    sendPaginated(res, coupons, validPage, validLimit, count);
  } catch (error) {
    logger.error('Get coupons error:', error);
    next(error);
  }
};

export const validateCoupon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { couponCode, orderTotal } = req.body;

    const coupon = await Coupon.findOne({ where: { code: couponCode.toUpperCase() } });

    if (!coupon) {
      sendError(res, 'Coupon code not found', 404, 'COUPON_NOT_FOUND');
      return;
    }

    if (!coupon.isActive) {
      sendError(res, 'Coupon is not active', 400, 'COUPON_INACTIVE');
      return;
    }

    if (coupon.maxUses !== undefined && coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
      sendError(res, 'Coupon usage limit exceeded', 400, 'COUPON_LIMIT_EXCEEDED');
      return;
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      sendError(res, 'Coupon has expired', 400, 'COUPON_EXPIRED');
      return;
    }

    const discountAmount = (orderTotal * coupon.discountPercentage) / 100;
    const finalTotal = orderTotal - discountAmount;

    logger.info(`Coupon validated: ${couponCode}`);

    sendSuccess(res, {
      couponCode: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalTotal: Math.round(finalTotal * 100) / 100,
      valid: true,
    });
  } catch (error) {
    logger.error('Validate coupon error:', error);
    next(error);
  }
};

export const updateCoupon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    if (req.user.role !== UserRole.ADMIN) {
      sendError(res, 'Only admins can update coupons', 403, 'FORBIDDEN');
      return;
    }

    const couponId = Number(req.params.couponId);
    if (Number.isNaN(couponId)) {
      sendError(res, 'Invalid coupon identifier', 400, 'INVALID_COUPON_ID');
      return;
    }

    const {
      discountPercentage,
      discountAmount,
      minOrderAmount,
      maxOrderAmount,
      maxUses,
      maxUsage,
      maxUsesPerUser,
      expiresAt,
      isActive,
    } = req.body;

    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    const resolvedMaxUses = maxUses ?? maxUsage ?? undefined;

    await coupon.update({
      ...(discountPercentage !== undefined && { discountPercentage }),
      ...(discountAmount !== undefined && { discountAmount }),
      ...(minOrderAmount !== undefined && { minOrderAmount }),
      ...(maxOrderAmount !== undefined && { maxOrderAmount }),
      ...(resolvedMaxUses !== undefined && { maxUses: resolvedMaxUses }),
      ...(maxUsesPerUser !== undefined && { maxUsesPerUser }),
      ...(expiresAt ? { expiresAt: new Date(expiresAt) } : {}),
      ...(isActive !== undefined && { isActive }),
    });

    logger.info(`Coupon updated: ${couponId}`);

    sendSuccess(res, coupon);
  } catch (error) {
    logger.error('Update coupon error:', error);
    next(error);
  }
};

export const deleteCoupon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    if (req.user.role !== UserRole.ADMIN) {
      sendError(res, 'Only admins can delete coupons', 403, 'FORBIDDEN');
      return;
    }

    const couponId = Number(req.params.couponId);
    if (Number.isNaN(couponId)) {
      sendError(res, 'Invalid coupon identifier', 400, 'INVALID_COUPON_ID');
      return;
    }

    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    await coupon.destroy();

    logger.info(`Coupon deleted: ${couponId}`);

    sendSuccess(res, null, 200, 'Coupon deleted successfully');
  } catch (error) {
    logger.error('Delete coupon error:', error);
    next(error);
  }
};
