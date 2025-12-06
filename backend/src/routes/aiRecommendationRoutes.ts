import express, { Router } from 'express';
import {
  getProductRecommendations,
  getContentRecommendations,
  getSimilarProducts,
  getPersonalizedFeed,
  getSeasonalRecommendations,
  trackProductView,
  getRecommendationStats,
  getUserProfile,
} from '@controllers/aiRecommendationController';

const router: Router = express.Router();

router.get('/products/:userId', getProductRecommendations);
router.get('/content/:userId', getContentRecommendations);
router.get('/similar/:productId', getSimilarProducts);
router.get('/feed/:userId', getPersonalizedFeed);
router.get('/seasonal', getSeasonalRecommendations);
router.get('/stats', getRecommendationStats);
router.get('/profile/:userId', getUserProfile);
router.post('/track/:userId/:productId', trackProductView);

export default router;
