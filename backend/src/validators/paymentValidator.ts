import Joi from 'joi';
import { PaymentMethod, PaymentGateway } from '@shared-types/index';

export const generateMoamalatHashSchema = Joi.object({
  orderId: Joi.string().uuid().required().messages({
    'string.uuid': 'Order ID must be a valid UUID',
    'any.required': 'Order ID is required',
  }),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required',
  }),
  currency: Joi.string().length(3).default('LYD').messages({
    'string.length': 'Currency must be 3 characters',
  }),
});

export const processMoamalatPaymentSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('LYD'),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .default(PaymentMethod.IMMEDIATE),
});

export const getPaymentStatusSchema = Joi.object({
  orderId: Joi.string().uuid().required().messages({
    'string.uuid': 'Order ID must be a valid UUID',
    'any.required': 'Order ID is required',
  }),
});

export const verifyPaymentSchema = Joi.object({
  merchantReference: Joi.string().required(),
  systemReference: Joi.string().required(),
  secureHash: Joi.string().required(),
});
