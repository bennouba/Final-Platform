import { Router, Request, Response, NextFunction } from 'express';
import * as productController from '@controllers/productController';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validation';
import {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductByIdSchema,
} from '@validators/productValidator';

const router = Router();

router.post(
  '/',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(createProductSchema)(req, res, next),
  productController.createProduct
);

router.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => validate(getProductsSchema)(req, res, next),
  productController.getProducts
);

router.get('/:productId', productController.getProductById);

router.put(
  '/:productId',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(updateProductSchema)(req, res, next),
  productController.updateProduct
);

router.delete('/:productId', authenticate, productController.deleteProduct);

export default router;
