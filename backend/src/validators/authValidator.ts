import Joi from 'joi';
import { UserRole } from '@shared-types/index';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character (!@#$%^&*)',
      'any.required': 'Password is required',
    }),
  firstName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 100 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 100 characters',
    'any.required': 'Last name is required',
  }),
  phone: Joi.string()
    .pattern(/^(\+218|0)?[0-9]{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Libyan number',
      'any.required': 'Phone number is required',
    }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.CUSTOMER)
    .messages({
      'any.only': `Role must be one of: ${Object.values(UserRole).join(', ')}`,
    }),
  storeName: Joi.string().max(255).optional().messages({
    'string.max': 'Store name must not exceed 255 characters',
  }),
  storeCategory: Joi.string().max(100).optional().messages({
    'string.max': 'Store category must not exceed 100 characters',
  }),
  storeDescription: Joi.string().max(1000).optional().messages({
    'string.max': 'Store description must not exceed 1000 characters',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*]/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'New password must contain uppercase, lowercase, number, and special character',
      'any.required': 'New password is required',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm password is required',
  }),
});
