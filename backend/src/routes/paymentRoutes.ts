import { Router, Request, Response, NextFunction } from 'express';
import * as paymentController from '@controllers/paymentController';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validation';
import {
  generateMoamalatHashSchema,
  getPaymentStatusSchema,
  processMoamalatPaymentSchema,
  verifyPaymentSchema,
} from '@validators/paymentValidator';

const router = Router();

router.post(
  '/moamalat/hash',
  (req: Request, res: Response, next: NextFunction) => validate(generateMoamalatHashSchema)(req, res, next),
  paymentController.generateMoamalatHash
);

router.post(
  '/status',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(getPaymentStatusSchema)(req, res, next),
  paymentController.getPaymentStatus
);

router.post(
  '/refund',
  authenticate,
  paymentController.refundPayment
);

router.post('/webhook/moamalat', paymentController.handleMoamalatWebhook);

router.get('/moamalat/test', paymentController.testMoamalatConfig);

export default router;
