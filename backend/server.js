// Mock Backend Server for EISHRO Platform
// Provides basic API endpoints for testing

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('public/assets'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Mock data stores
const stores = new Map();
const orders = new Map();
const products = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EISHRO Backend Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Store creation endpoint
app.post('/api/stores/create-with-images', upload.fields([
  { name: 'storeImage', maxCount: 1 },
  { name: 'sliderImages', maxCount: 10 },
  { name: 'productImages', maxCount: 50 }
]), (req, res) => {
  try {
    
    
    const storeId = `store_${Date.now()}`;
    const storeSlug = req.body.storeSlug || `store-${storeId}`;
    
    const storeData = {
      id: storeId,
      slug: storeSlug,
      name: req.body.storeName,
      nameEn: req.body.storeNameEn,
      description: req.body.description,
      icon: req.body.icon,
      color: req.body.color,
      categories: JSON.parse(req.body.categories || '[]'),
      images: {
        store: req.files.storeImage ? req.files.storeImage[0].path : null,
        slider: req.files.sliderImages ? req.files.sliderImages.map(f => f.path) : [],
        products: req.files.productImages ? req.files.productImages.map(f => f.path) : []
      },
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    stores.set(storeId, storeData);
    
    
    
    res.json({
      success: true,
      message: 'تم إنشاء المتجر بنجاح',
      data: {
        storeId,
        slug: storeSlug,
        name: storeData.name
      }
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'فشل في إنشاء المتجر',
      error: error.message
    });
  }
});

// Store validation endpoint
app.post('/api/stores/validate', (req, res) => {
  try {
    const { storeSlug, storeName } = req.body;
    
    // Simple validation
    const errors = [];
    
    if (!storeSlug || storeSlug.length < 3) {
      errors.push('Slug must be at least 3 characters long');
    }
    
    if (!storeName || storeName.length < 2) {
      errors.push('Store name must be at least 2 characters long');
    }
    
    // Check if slug already exists
    const existingStore = Array.from(stores.values()).find(s => s.slug === storeSlug);
    if (existingStore) {
      errors.push('Store slug already exists');
    }
    
    res.json({
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      message: errors.length === 0 ? 'Validation passed' : 'Validation failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
});

// Get all stores endpoint
app.get('/api/stores', (req, res) => {
  try {
    const storesList = Array.from(stores.values()).map(store => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      status: store.status,
      createdAt: store.createdAt
    }));
    
    res.json({
      success: true,
      data: storesList,
      count: storesList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message
    });
  }
});

// Notify when available endpoint
app.post('/api/stores/unavailable/notify', (req, res) => {
  try {
    
    
    const notificationId = `notif_${Date.now()}`;
    const notificationData = {
      id: notificationId,
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // In a real implementation, this would send notifications via email/SMS
    
    
    res.json({
      success: true,
      message: 'تم تسجيل طلب الإشعار بنجاح',
      data: {
        notificationId,
        estimatedResponse: '24-48 ساعة'
      }
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: 'فشل في معالجة طلب الإشعار',
      error: error.message
    });
  }
});

// Push notification endpoint
app.post('/api/send-push', (req, res) => {
  try {
    
    
    // Mock push notification sending
    res.json({
      success: true,
      message: 'Push notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send push notification',
      error: error.message
    });
  }
});

// Mock orders endpoint
app.get('/api/orders', (req, res) => {
  try {
    const ordersList = Array.from(orders.values());
    
    res.json({
      success: true,
      data: ordersList,
      count: ordersList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Mock products endpoint
app.get('/api/products', (req, res) => {
  try {
    const productsList = Array.from(products.values());
    
    res.json({
      success: true,
      data: productsList,
      count: productsList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  
  
  
  
  
});

module.exports = app;
