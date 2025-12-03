import { Router } from 'express';
import {
  getStoreAds,
  createStoreAd,
  updateStoreAd,
  deleteStoreAd,
  bulkDeleteStoreAds,
} from '@controllers/adController';

const router = Router();

router.get('/store/:storeId', getStoreAds);
router.post('/store/:storeId', createStoreAd);
router.put('/store/:storeId/:adId', updateStoreAd);
router.delete('/store/:storeId/:adId', deleteStoreAd);
router.post('/store/:storeId/bulk-delete', bulkDeleteStoreAds);

export default router;
