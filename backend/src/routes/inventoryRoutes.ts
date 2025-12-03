import { Router } from 'express';
import {
  checkLowStock,
  getInventoryStats,
  updateProductQuantity,
} from '@controllers/inventoryController';

const router = Router();

router.get('/store/:storeId/low-stock', checkLowStock);
router.get('/store/:storeId/stats', getInventoryStats);
router.put('/store/:storeId/product/:productId/quantity', updateProductQuantity);

export default router;
