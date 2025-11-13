import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

import config, { isProduction } from '@config/environment';
import { API_PREFIX } from '@config/constants';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler';
import logger from '@utils/logger';
import routes from '@routes/index';

const app: Express = express();

app.use(helmet());

app.use(
  cors({
    origin: isProduction ? config.frontend.production : config.frontend.development,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(`${API_PREFIX}/`, limiter);

app.get('/health', (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.environment,
  });
});

app.use((req: Request, res: Response, next: NextFunction): void => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use(routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
