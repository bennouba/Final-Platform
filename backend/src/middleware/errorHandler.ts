import { Response, NextFunction } from 'express';
import { AuthRequest } from '@shared-types/index';
import { sendError } from '@utils/response';
import { ERROR_CODES, HTTP_STATUS } from '@config/constants';
import logger from '@utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: any,
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    sendError(res, error.message, error.statusCode, error.code);
    return;
  }

  if (error.name === 'ValidationError') {
    const details = error.details?.reduce((acc: any, detail: any) => {
      acc[detail.path.join('.')] = detail.message;
      return acc;
    }, {});

    sendError(
      res,
      'Validation error',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      details
    );
    return;
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.fields ? Object.keys(error.fields)[0] : 'unknown';
    sendError(
      res,
      `${field} already exists`,
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.DUPLICATE_EMAIL,
      { field }
    );
    return;
  }

  if (error.name === 'SequelizeValidationError') {
    const details = error.errors?.reduce((acc: any, err: any) => {
      acc[err.path] = err.message;
      return acc;
    }, {});

    sendError(
      res,
      'Database validation error',
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      details
    );
    return;
  }

  if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeDatabaseError') {
    logger.error('Database error:', error);
    sendError(
      res,
      'Database error occurred',
      HTTP_STATUS.INTERNAL_ERROR,
      ERROR_CODES.DATABASE_ERROR
    );
    return;
  }

  sendError(
    res,
    error.message || 'Internal server error',
    error.statusCode || HTTP_STATUS.INTERNAL_ERROR,
    ERROR_CODES.INTERNAL_ERROR
  );
};

export const notFoundHandler = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const error = new AppError(
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.originalUrl} not found`,
    ERROR_CODES.NOT_FOUND
  );
  next(error);
};
