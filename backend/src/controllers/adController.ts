import { Request, Response } from 'express';
import StoreAd from '@models/StoreAd';
import Store from '@models/Store';
import logger from '@utils/logger';

export const getStoreAds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;

    let store = await Store.findOne({
      where: { slug: storeId }
    });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({
        where: { merchantId: storeId }
      });
    }
    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const ads = await StoreAd.findAll({
      where: { storeId: store.id, isActive: true },
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: ads });
  } catch (error) {
    logger.error('Error fetching store ads:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ads' });
  }
};

export const createStoreAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;
    const { templateId, title, description, placement, imageUrl, linkUrl } = req.body;

    if (!templateId || !title || !description || !placement) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    let store = await Store.findOne({
      where: { slug: storeId }
    });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({
        where: { merchantId: storeId }
      });
    }
    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const ad = await StoreAd.create({
      storeId: store.id,
      templateId,
      title: title.slice(0, 100),
      description: description.slice(0, 1000),
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      placement,
      isActive: true,
    });

    logger.info(`Ad created for store ${storeId}: ${ad.id}`);
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    logger.error('Error creating store ad:', error);
    res.status(500).json({ success: false, error: 'Failed to create ad' });
  }
};

export const updateStoreAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId, adId } = req.params;
    const { templateId, title, description, placement, isActive } = req.body;

    let store = await Store.findOne({
      where: { slug: storeId }
    });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({
        where: { merchantId: storeId }
      });
    }
    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const ad = await StoreAd.findOne({
      where: { id: adId, storeId: store.id },
    });

    if (!ad) {
      res.status(404).json({ success: false, error: 'Ad not found' });
      return;
    }

    await ad.update({
      ...(templateId && { templateId }),
      ...(title && { title: title.slice(0, 100) }),
      ...(description && { description: description.slice(0, 1000) }),
      ...(placement && { placement }),
      ...(isActive !== undefined && { isActive }),
    });

    logger.info(`Ad updated: ${adId}`);
    res.json({ success: true, data: ad });
  } catch (error) {
    logger.error('Error updating store ad:', error);
    res.status(500).json({ success: false, error: 'Failed to update ad' });
  }
};

export const deleteStoreAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId, adId } = req.params;

    let store = await Store.findOne({
      where: { slug: storeId }
    });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({
        where: { merchantId: storeId }
      });
    }
    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const ad = await StoreAd.findOne({
      where: { id: adId, storeId: store.id },
    });

    if (!ad) {
      res.status(404).json({ success: false, error: 'Ad not found' });
      return;
    }

    await ad.destroy();

    logger.info(`Ad deleted: ${adId}`);
    res.json({ success: true, message: 'Ad deleted successfully' });
  } catch (error) {
    logger.error('Error deleting store ad:', error);
    res.status(500).json({ success: false, error: 'Failed to delete ad' });
  }
};

export const bulkDeleteStoreAds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;
    const { adIds } = req.body;

    if (!adIds || !Array.isArray(adIds)) {
      res.status(400).json({ success: false, error: 'adIds must be an array' });
      return;
    }

    let store = await Store.findOne({
      where: { slug: storeId }
    });
    if (!store) {
      store = await Store.findByPk(storeId);
    }
    if (!store) {
      store = await Store.findOne({
        where: { merchantId: storeId }
      });
    }
    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    const deleted = await StoreAd.destroy({
      where: { storeId: store.id, id: adIds },
    });

    logger.info(`${deleted} ads deleted for store ${storeId}`);
    res.json({ success: true, message: `${deleted} ads deleted` });
  } catch (error) {
    logger.error('Error bulk deleting store ads:', error);
    res.status(500).json({ success: false, error: 'Failed to delete ads' });
  }
};
