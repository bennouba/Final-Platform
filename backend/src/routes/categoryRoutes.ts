import { Router, Request, Response, NextFunction } from 'express';
import * as categoryController from '@controllers/categoryController';
import { authenticate, optional } from '@middleware/auth';
import { validate } from '@middleware/validation';
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoryByIdSchema,
  listCategoriesSchema,
  updateCategorySchema,
} from '@validators/categoryValidator';

const router = Router();

router.get(
  '/',
  optional,
  (req: Request, res: Response, next: NextFunction) => validate(listCategoriesSchema)(req, res, next),
  categoryController.getCategories,
);

router.get(
  '/:categoryId',
  optional,
  (req: Request, res: Response, next: NextFunction) => validate(getCategoryByIdSchema)(req, res, next),
  categoryController.getCategoryById,
);

router.post(
  '/',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(createCategorySchema)(req, res, next),
  categoryController.createCategory,
);

router.put(
  '/:categoryId',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(updateCategorySchema)(req, res, next),
  categoryController.updateCategory,
);

router.delete(
  '/:categoryId',
  authenticate,
  (req: Request, res: Response, next: NextFunction) => validate(deleteCategorySchema)(req, res, next),
  categoryController.deleteCategory,
);

export default router;
