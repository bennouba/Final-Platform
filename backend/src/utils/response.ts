import { Response } from 'express';
import { SuccessResponse, ErrorResponse, PaginatedResponse } from '@shared-types/index';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode = 200
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500,
  code?: string,
  details?: Record<string, unknown>
): Response => {
  const response: ErrorResponse = {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details }),
  };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): Response => {
  return sendSuccess(res, data, 201, message);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

export const sendUnauthorized = (
  res: Response,
  error = 'Unauthorized',
  details?: Record<string, unknown>
): Response => {
  return sendError(res, error, 401, 'UNAUTHORIZED', details);
};

export const sendForbidden = (
  res: Response,
  error = 'Forbidden',
  details?: Record<string, unknown>
): Response => {
  return sendError(res, error, 403, 'FORBIDDEN', details);
};

export const sendNotFound = (
  res: Response,
  error = 'Resource not found',
  details?: Record<string, unknown>
): Response => {
  return sendError(res, error, 404, 'NOT_FOUND', details);
};

export const sendBadRequest = (
  res: Response,
  error: string,
  details?: Record<string, unknown>
): Response => {
  return sendError(res, error, 400, 'VALIDATION_ERROR', details);
};

export const sendValidationError = (
  res: Response,
  errors: Record<string, string[]>
): Response => {
  return sendBadRequest(
    res,
    'Validation error',
    Object.entries(errors).reduce((acc, [field, messages]) => {
      acc[field] = messages;
      return acc;
    }, {} as Record<string, string[]>)
  );
};
