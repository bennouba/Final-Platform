import { Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AuthRequest } from '@shared-types/index';
import { sendBadRequest } from '@utils/response';
import logger from '@utils/logger';

export const validate = (schema: Schema) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(
        {
          body: req.body,
          params: req.params,
          query: req.query,
        },
        {
          abortEarly: false,
          stripUnknown: true,
        }
      );

      if (error) {
        const errors: Record<string, string[]> = {};

        error.details.forEach((detail) => {
          const path = detail.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(detail.message);
        });

        logger.warn('Validation error:', { errors, path: req.path });
        sendBadRequest(res, 'Validation failed', errors);
        return;
      }

      req.body = value.body || {};
      req.params = value.params || {};
      req.query = value.query || {};

      next();
    } catch (error) {
      logger.error('Validation middleware error:', error);
      sendBadRequest(res, 'Validation error occurred');
    }
  };
};
