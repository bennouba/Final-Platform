import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import config, { isProduction } from '@config/environment';
import { API_PREFIX } from '@config/constants';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler';
import logger from '@utils/logger';
import routes from '@routes/index';

const app: Express = express();

app.use((req, res, next) => {
  req.setTimeout(600000);
  res.setTimeout(600000);
  next();
});

app.use(helmet());

app.use(
  cors({
    origin: isProduction
      ? config.frontend.production
      : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
          if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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

let basePath = process.cwd();
if (basePath.endsWith('backend')) {
  basePath = path.join(basePath, '..');
}

const publicPath = path.join(basePath, 'backend', 'public');
const assetsPath = path.join(publicPath, 'assets');

logger.info(`📁 Static assets configuration:`);
logger.info(`   Base Path: ${basePath}`);
logger.info(`   Public Path: ${publicPath}`);
logger.info(`   Assets Path: ${assetsPath}`);

app.use('/assets', express.static(assetsPath, { 
  maxAge: '1h',
  etag: false,
  dotfiles: 'allow'
}));

app.use('/', express.static(publicPath, {
  maxAge: '1d',
  etag: false
}));

app.use((req: Request, res: Response, next: NextFunction): void => {
  if (!req.path.startsWith('/api')) {
    logger.info(`${req.method} ${req.path}`);
  }
  next();
});

app.use(routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
