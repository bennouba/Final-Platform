import { Request, Response } from 'express';
import AIRecommendationService from '@services/aiRecommendationService';

export const getProductRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const recommendations = await AIRecommendationService.getProductRecommendations(
      parseInt(userId),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getContentRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 8 } = req.query;

    const recommendations = await AIRecommendationService.getContentRecommendations(
      parseInt(userId),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSimilarProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { limit = 5 } = req.query;

    const similarProducts = await AIRecommendationService.getSimilarProducts(
      parseInt(productId),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: similarProducts,
      count: similarProducts.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPersonalizedFeed = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const feed = await AIRecommendationService.getPersonalizedFeed(
      parseInt(userId),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: feed,
      count: feed.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSeasonalRecommendations = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const recommendations = await AIRecommendationService.getSeasonalRecommendations(
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const trackProductView = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    await AIRecommendationService.trackProductView(parseInt(userId), parseInt(productId));

    res.json({
      success: true,
      message: 'Product view tracked',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRecommendationStats = async (req: Request, res: Response) => {
  try {
    const stats = await AIRecommendationService.getRecommendationStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await AIRecommendationService.buildUserProfile(parseInt(userId));

    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getProductRecommendations,
  getContentRecommendations,
  getSimilarProducts,
  getPersonalizedFeed,
  getSeasonalRecommendations,
  trackProductView,
  getRecommendationStats,
  getUserProfile,
};
