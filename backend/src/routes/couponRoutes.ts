import { Router, Request, Response, NextFunction } from 'express';
import * as couponController from '@controllers/couponController';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validation';
import {
  createCouponSchema,
  validateCouponSchema,
  updateCouponSchema,
  getCouponsSchema,
} from '@validators/couponValidator';

const router = Router();

router.post(
  '/',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(createCouponSchema)(req, res, next),
  couponController.createCoupon
);

router.get(
  '/',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(getCouponsSchema)(req, res, next),
  couponController.getCoupons
);

router.post(
  '/validate',
  (req: Request, res: Response, next: NextFunction) => validate(validateCouponSchema)(req, res, next),
  couponController.validateCoupon
);

router.put(
  '/:couponId',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(updateCouponSchema)(req, res, next),
  couponController.updateCoupon
);

router.delete('/:couponId', authenticate, couponController.deleteCoupon);

export default router;
