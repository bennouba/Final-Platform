// FILE: src/app.ts
// Main Express Application Entry Point

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import couponRoutes from './routes/couponRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARE ==========

// Security
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Request Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========== ROUTES ==========

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// ========== ERROR HANDLING ==========

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
});

// ========== DATABASE & SERVER ==========

// Initialize Database
async function startServer() {
  try {
    // Test Database Connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync Models
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

// ========================================
// FILE: src/config/database.ts
// Database Configuration

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'eishro_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// ========================================
// FILE: src/utils/moamalat.ts
// Moamalat Payment Gateway Hash Generator

import crypto from 'crypto';

export interface MoamalatHashParams {
  Amount: string;
  DateTimeLocalTrxn: string;
  MerchantId: string;
  MerchantReference: string;
  TerminalId: string;
}

export async function generateMoamalatHash(params: MoamalatHashParams): Promise<string> {
  const secret = process.env.MOAMALAT_SECRET || '';

  const message = `Amount=${params.Amount}&DateTimeLocalTrxn=${params.DateTimeLocalTrxn}&MerchantId=${params.MerchantId}&MerchantReference=${params.MerchantReference}&TerminalId=${params.TerminalId}`;

  const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'hex'));
  hmac.update(message);
  
  return hmac.digest('hex').toUpperCase();
}

export function getMoamalatConfig() {
  return {
    MID: process.env.MOAMALAT_MID || '10081014649',
    TID: process.env.MOAMALAT_TID || '99179395',
    ENV: process.env.MOAMALAT_ENV === 'production' ? 'production' : 'sandbox'
  };
}

// ========================================
// FILE: src/middleware/auth.ts
// JWT Authentication Middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ========================================
// FILE: src/controllers/paymentController.ts
// Payment Gateway Controller - CRITICAL

import { Request, Response } from 'express';
import { generateMoamalatHash, getMoamalatConfig, MoamalatHashParams } from '../utils/moamalat';

export const generateMoamalatHashHandler = async (req: Request, res: Response) => {
  try {
    const params: MoamalatHashParams = req.body;

    // Validate Required Fields
    if (!params.Amount || !params.DateTimeLocalTrxn || !params.MerchantId || 
        !params.MerchantReference || !params.TerminalId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate Hash
    const secureHash = await generateMoamalatHash(params);

    res.json({
      secureHash,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error generating hash:', error);
    res.status(500).json({ error: error.message || 'Failed to generate hash' });
  }
};

export const getMoamalatConfigHandler = (req: Request, res: Response) => {
  try {
    const config = getMoamalatConfig();
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// FILE: src/routes/paymentRoutes.ts
// Payment Routes - CRITICAL

import express from 'express';
import { generateMoamalatHashHandler, getMoamalatConfigHandler } from '../controllers/paymentController';

const router = express.Router();

// 🔴 CRITICAL ENDPOINTS
router.post('/moamalat/hash', generateMoamalatHashHandler);
router.get('/moamalat/config', getMoamalatConfigHandler);

export default router;

// ========================================
// FILE: src/controllers/orderController.ts
// Orders Management Controller

import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // Validate Request
    const { items, subtotal, shippingCost, customer, payment } = req.body;

    if (!items || !customer || !payment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Order Logic (TODO: Implement with DB)
    const orderId = `ESHRO-${Date.now()}`;

    res.status(201).json({
      id: orderId,
      status: 'pending',
      message: 'Order created successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Fetch from DB
    res.json({ id, message: 'Order fetched' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    // TODO: Fetch from DB
    res.json({ orders: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ========================================
// FILE: src/routes/orderRoutes.ts
// Orders Routes

import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { createOrder, getOrder, getUserOrders } from '../controllers/orderController';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/:id', getOrder);
router.get('/user/:userId', authMiddleware, getUserOrders);

export default router;

// ========================================
// Other stub controllers and routes
// (Will be implemented in production)

// Coupon Routes Stub
import express from 'express';
const couponRouter = express.Router();
couponRouter.post('/validate', (req, res) => res.json({ valid: true }));
export default couponRouter;

// Product Routes Stub
import express from 'express';
const productRouter = express.Router();
productRouter.get('/', (req, res) => res.json({ products: [] }));
export default productRouter;

// User Routes Stub
import express from 'express';
const userRouter = express.Router();
userRouter.get('/:id', (req, res) => res.json({ user: {} }));
export default userRouter;

// Auth Routes Stub
import express from 'express';
const authRouter = express.Router();
authRouter.post('/login', (req, res) => res.json({ token: 'temp-token' }));
authRouter.post('/register', (req, res) => res.json({ token: 'temp-token' }));
export default authRouter;
