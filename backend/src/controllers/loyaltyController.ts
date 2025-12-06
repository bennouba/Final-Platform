import { Request, Response } from 'express';
import LoyaltyService from '@services/loyaltyService';

export const initializeLoyaltyAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const account = await LoyaltyService.initializeLoyaltyAccount(parseInt(userId));

    res.json({
      success: true,
      data: account,
      message: 'Loyalty account initialized',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addPointsToOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, orderAmount } = req.body;

    const points = await LoyaltyService.addPointsToOrder(parseInt(orderId), parseFloat(orderAmount));

    res.json({
      success: true,
      data: { points, orderId },
      message: `${points} points added to order`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const redeemPoints = async (req: Request, res: Response) => {
  try {
    const { userId, pointsAmount, rewardId, rewardName, rewardValue, rewardType } = req.body;

    const redemption = await LoyaltyService.redeemPoints(
      parseInt(userId),
      parseInt(pointsAmount),
      rewardId,
      rewardName,
      parseFloat(rewardValue),
      rewardType
    );

    res.json({
      success: true,
      data: redemption,
      message: 'Reward redeemed successfully',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const confirmRedemption = async (req: Request, res: Response) => {
  try {
    const { redemptionId } = req.params;

    const redemption = await LoyaltyService.confirmRedemption(parseInt(redemptionId));

    res.json({
      success: true,
      data: redemption,
      message: 'Redemption confirmed',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const useRedemption = async (req: Request, res: Response) => {
  try {
    const { redemptionId, orderId } = req.body;

    const redemption = await LoyaltyService.useRedemption(parseInt(redemptionId), parseInt(orderId));

    res.json({
      success: true,
      data: redemption,
      message: 'Redemption used',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const setLoyaltyConfig = async (req: Request, res: Response) => {
  try {
    const config = req.body;

    LoyaltyService.setConfig(config);

    res.json({
      success: true,
      message: 'Loyalty configuration updated',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserLoyaltyStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const status = await LoyaltyService.getUserLoyaltyStatus(parseInt(userId));

    if (!status) {
      return res.status(404).json({ success: false, error: 'Loyalty account not found' });
    }

    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPointsAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const analytics = await LoyaltyService.getPointsAnalytics(parseInt(userId));

    if (!analytics) {
      return res.status(404).json({ success: false, error: 'Loyalty account not found' });
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLoyaltyLeaderboard = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await LoyaltyService.getLoyaltyLeaderboard(parseInt(limit as string));

    res.json({
      success: true,
      data: leaderboard,
      count: leaderboard.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const expireOldPoints = async (req: Request, res: Response) => {
  try {
    const expiredCount = await LoyaltyService.expireOldPoints();

    res.json({
      success: true,
      data: { expiredCount },
      message: `${expiredCount} loyalty accounts had points expired`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
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
};
