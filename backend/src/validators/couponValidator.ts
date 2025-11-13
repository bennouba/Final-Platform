import Joi from 'joi';

export const createCouponSchema = Joi.object({
  code: Joi.string().min(3).max(50).required().uppercase(),
  discountPercentage: Joi.number().min(1).max(100).required(),
  discountAmount: Joi.number().min(0).optional(),
  minOrderAmount: Joi.number().min(0).optional(),
  maxOrderAmount: Joi.number().min(0).optional(),
  maxUses: Joi.number().integer().positive().optional(),
  maxUsage: Joi.number().integer().positive().optional(),
  maxUsesPerUser: Joi.number().integer().positive().optional(),
  expiresAt: Joi.date().iso().optional(),
  isActive: Joi.boolean().optional(),
});

export const validateCouponSchema = Joi.object({
  couponCode: Joi.string().required().uppercase(),
  orderTotal: Joi.number().positive().required(),
});

export const updateCouponSchema = Joi.object({
  discountPercentage: Joi.number().min(1).max(100).optional(),
  discountAmount: Joi.number().min(0).optional(),
  minOrderAmount: Joi.number().min(0).optional(),
  maxOrderAmount: Joi.number().min(0).optional(),
  maxUses: Joi.number().integer().positive().optional(),
  maxUsage: Joi.number().integer().positive().optional(),
  maxUsesPerUser: Joi.number().integer().positive().optional(),
  expiresAt: Joi.date().iso().optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

export const getCouponsSchema = Joi.object({
  page: Joi.number().positive().default(1),
  limit: Joi.number().positive().max(100).default(10),
});
