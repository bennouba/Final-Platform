import express, { Router } from 'express';
import {
  initializeLoyaltyAccount,
  addPointsToOrder,
  redeemPoints,
  confirmRedemption,
  useRedemption,
  setLoyaltyConfig,
  getUserLoyaltyStatus,
  getPointsAnalytics,
  getLoyaltyLeaderboard,
  expireOldPoints,
} from '@controllers/loyaltyController';

const router: Router = express.Router();

router.post('/account/initialize/:userId', initializeLoyaltyAccount);
router.post('/points/add', addPointsToOrder);
router.post('/redeem', redeemPoints);
router.post('/redemption/:redemptionId/confirm', confirmRedemption);
router.post('/redemption/use', useRedemption);
router.post('/config', setLoyaltyConfig);
router.get('/status/:userId', getUserLoyaltyStatus);
router.get('/analytics/:userId', getPointsAnalytics);
router.get('/leaderboard', getLoyaltyLeaderboard);
router.post('/expire-points', expireOldPoints);

export default router;
