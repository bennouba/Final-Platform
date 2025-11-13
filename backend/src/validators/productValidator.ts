import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).max(2000).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().positive().required(),
  category: Joi.string().max(100).optional(),
  sku: Joi.string().max(50).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().positive().optional(),
  category: Joi.string().max(100).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
});

export const getProductsSchema = Joi.object({
  page: Joi.number().positive().default(1),
  limit: Joi.number().positive().max(100).default(10),
  category: Joi.string().optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string().valid('name', 'price', 'createdAt').default('createdAt'),
  order: Joi.string().valid('ASC', 'DESC').default('DESC'),
});

export const getProductByIdSchema = Joi.object({
  productId: Joi.string().uuid().required(),
});
