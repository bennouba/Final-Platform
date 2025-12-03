import { Router } from 'express';
import { createStoreWithFiles, createStoreWithImages, validateStoreData, checkStoreExists, cleanupStoreAndUsers, createUnavailableNotification, listUnavailableByStore, uploadSliderImage } from '@controllers/storeController';
import { uploadBothImages, storeImageUpload } from '@middleware/storeImageUpload';
import logger from '@utils/logger';
import { sendSuccess } from '@utils/response';
import Store from '@models/Store';

const router = Router();

router.post('/create-with-files', createStoreWithFiles);

router.post('/create-with-images', (req, res, next) => {
  logger.info('📥 Received POST /create-with-images');
  uploadBothImages(req, res, (err: any) => {
    if (err) {
      logger.error('❌ Upload middleware error:', err);
      if (!res.headersSent) {
        return res.status(400).json({ 
          success: false, 
          error: `Upload error: ${err.message}`,
          code: 'UPLOAD_ERROR'
        });
      }
      return;
    }
    logger.info('✅ Upload middleware passed, proceeding to controller');
    next();
  });
}, (req, res, next) => {
  createStoreWithImages(req, res, next).catch((err: any) => {
    logger.error('❌ Uncaught error in createStoreWithImages:', err);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });
});

router.post('/validate', validateStoreData);
router.post('/check-exists', checkStoreExists);
router.post('/cleanup', cleanupStoreAndUsers);

router.get('/list', async (req, res, next) => {
  try {
    const stores = await Store.findAll({
      attributes: ['id', 'name', 'slug', 'description', 'logo', 'status', 'createdAt', 'updatedAt']
    });
    
    logger.info(`✅ Retrieved ${stores.length} stores`);
    
    sendSuccess(res, {
      message: 'Stores retrieved successfully',
      stores,
      total: stores.length
    }, 200, 'Stores retrieved');
  } catch (error) {
    logger.error('Error retrieving stores:', error);
    next(error);
  }
});

router.post('/unavailable/notify', createUnavailableNotification);
router.get('/unavailable/by-store/:slug', listUnavailableByStore);
router.post('/:storeSlug/upload-slider-image', storeImageUpload.single('sliderImage_0'), uploadSliderImage);

export default router;
