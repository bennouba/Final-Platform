import { Router, Request, Response, NextFunction } from 'express';
import * as orderController from '@controllers/orderController';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validation';
import {
  createOrderSchema,
  getOrdersSchema,
  updateOrderStatusSchema,
  createManualOrderSchema,
} from '@validators/orderValidator';

const router = Router();

router.post(
  '/',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(createOrderSchema)(req, res, next),
  orderController.createOrder
);

router.get(
  '/',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(getOrdersSchema)(req, res, next),
  orderController.getOrders
);

router.post(
  '/manual',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(createManualOrderSchema)(req, res, next),
  orderController.createManualOrder
);

router.get('/unavailable', authenticate, orderController.getUnavailableForMerchant);

router.get('/:orderId', authenticate, orderController.getOrderById);

router.put(
  '/:orderId/status',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(updateOrderStatusSchema)(req, res, next),
  orderController.updateOrderStatus
);

router.delete('/:orderId', authenticate, orderController.cancelOrder);

export default router;
