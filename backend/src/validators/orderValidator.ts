import Joi from 'joi';
import { PaymentMethod, ShippingType } from '@shared-types/index';

export const createOrderSchema = Joi.object({
  customerFirstName: Joi.string().min(2).max(100).required(),
  customerLastName: Joi.string().min(2).max(100).required(),
  customerPhone: Joi.string()
    .pattern(/^(?:\+218|0)?[0-9]{9}$/)
    .required(),
  customerEmail: Joi.string().email().required(),
  customerAddress: Joi.string().min(5).max(500).required(),
  customerCity: Joi.string().min(2).max(100).required(),
  customerArea: Joi.string().min(2).max(100).required(),
  locationLatitude: Joi.number().optional(),
  locationLongitude: Joi.number().optional(),
  locationAccuracy: Joi.number().optional(),
  locationAddress: Joi.string().optional(),
  shippingType: Joi.string()
    .valid(...Object.values(ShippingType))
    .default(ShippingType.NORMAL),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
  couponCode: Joi.string().max(50).uppercase().optional(),
  notes: Joi.string().max(500).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        price: Joi.number().positive().optional(),
        size: Joi.string().max(50).optional(),
        color: Joi.string().max(50).optional(),
      })
    )
    .min(1)
    .required(),
});

export const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string().required(),
});

export const getOrdersSchema = Joi.object({
  page: Joi.number().positive().default(1),
  limit: Joi.number().positive().max(100).default(10),
  status: Joi.string().optional(),
});

export const getOrderByIdSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
});
