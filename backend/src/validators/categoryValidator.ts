import Joi from 'joi';

const categoryIdParam = Joi.object({
  categoryId: Joi.number().integer().positive().required(),
});

export const listCategoriesSchema = Joi.object({
  body: Joi.object({}).default({}),
  params: Joi.object({}).default({}),
  query: Joi.object({
    storeId: Joi.number().integer().positive().optional(),
    includeInactive: Joi.boolean().optional(),
    search: Joi.string().max(120).allow('').optional(),
  }).default({}),
});

export const getCategoryByIdSchema = Joi.object({
  body: Joi.object({}).default({}),
  params: categoryIdParam,
  query: Joi.object({}).default({}),
});

export const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    nameAr: Joi.string().max(120).allow('', null).optional(),
    description: Joi.string().max(1000).allow('', null).optional(),
    image: Joi.string().max(500).allow('', null).optional(),
    sortOrder: Joi.number().integer().min(0).default(0),
    isActive: Joi.boolean().default(true),
    storeId: Joi.number().integer().positive().optional(),
  }),
  params: Joi.object({}).default({}),
  query: Joi.object({}).default({}),
});

export const updateCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).optional(),
    nameAr: Joi.string().max(120).allow('', null).optional(),
    description: Joi.string().max(1000).allow('', null).optional(),
    image: Joi.string().max(500).allow('', null).optional(),
    sortOrder: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),
    storeId: Joi.number().integer().positive().optional(),
  }).min(1),
  params: categoryIdParam,
  query: Joi.object({}).default({}),
});

export const deleteCategorySchema = Joi.object({
  body: Joi.object({}).default({}),
  params: categoryIdParam,
  query: Joi.object({}).default({}),
});
