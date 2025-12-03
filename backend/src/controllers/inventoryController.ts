import { Request, Response } from 'express';
import Product from '@models/Product';
import Store from '@models/Store';
import logger from '@utils/logger';
import { Op } from 'sequelize';

const LOW_STOCK_THRESHOLD = 5;

export const checkLowStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;

    let store = await Store.findOne({ where: { slug: storeId } });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({ where: { merchantId: storeId } });
    }

    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const lowStockProducts = await Product.findAll({
      where: {
        storeId: store.id,
        quantity: { [Op.lte]: LOW_STOCK_THRESHOLD }
      },
      order: [['quantity', 'ASC']],
    });

    const alerts = lowStockProducts.map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      threshold: LOW_STOCK_THRESHOLD,
      type: product.quantity === 0 ? 'out_of_stock' : 'low_stock',
      severity: product.quantity === 0 ? 'critical' : 'high',
      sku: product.sku,
    }));

    logger.info(`Found ${alerts.length} products with low stock for store ${storeId}`);
    res.json({ success: true, data: alerts, count: alerts.length });
  } catch (error) {
    logger.error('Error checking low stock:', error);
    res.status(500).json({ success: false, error: 'Failed to check stock' });
  }
};

export const getInventoryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;

    let store = await Store.findOne({ where: { slug: storeId } });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({ where: { merchantId: storeId } });
    }

    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const products = await Product.findAll({
      where: { storeId: store.id },
    });

    const stats = {
      totalProducts: products.length,
      totalStock: products.reduce((sum, p) => sum + p.quantity, 0),
      lowStockCount: products.filter(p => p.quantity > 0 && p.quantity <= LOW_STOCK_THRESHOLD).length,
      outOfStockCount: products.filter(p => p.quantity === 0).length,
      inStockCount: products.filter(p => p.quantity > 0).length,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error getting inventory stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get inventory stats' });
  }
};

export const updateProductQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId, productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      res.status(400).json({ success: false, error: 'Invalid quantity' });
      return;
    }

    let store = await Store.findOne({ where: { slug: storeId } });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({ where: { merchantId: storeId } });
    }

    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const product = await Product.findOne({
      where: { id: productId, storeId: store.id },
    });

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    const wasLowStock = product.quantity <= LOW_STOCK_THRESHOLD;
    const isNowLowStock = quantity <= LOW_STOCK_THRESHOLD && quantity > 0;
    const isNowOutOfStock = quantity === 0;

    await product.update({
      quantity,
      inStock: quantity > 0,
    });

    const alert = wasLowStock && !isNowLowStock && !isNowOutOfStock ? {
      type: 'stock_replenished',
      message: `تم تجديد مخزون المنتج "${product.name}"`,
    } : isNowOutOfStock ? {
      type: 'out_of_stock',
      message: `تنبيه عاجل: المنتج "${product.name}" نفد من المخزون!`,
    } : isNowLowStock ? {
      type: 'low_stock',
      message: `تنبيه: مخزون "${product.name}" منخفض. الكمية: ${quantity}`,
    } : null;

    logger.info(`Product quantity updated: ${productId} to ${quantity}`);
    res.json({
      success: true,
      data: product,
      alert: alert,
    });
  } catch (error) {
    logger.error('Error updating product quantity:', error);
    res.status(500).json({ success: false, error: 'Failed to update quantity' });
  }
};
