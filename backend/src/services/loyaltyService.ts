import UserLoyaltyAccount from '@models/UserLoyaltyAccount';
import LoyaltyTransaction from '@models/LoyaltyTransaction';
import LoyaltyRedemption from '@models/LoyaltyRedemption';
import Order from '@models/Order';
import User from '@models/User';
import { Op } from 'sequelize';

interface LoyaltyConfig {
  pointsPerCurrency: number;
  currencyPerPoint: number;
  pointsExpiryDays: number;
  minOrderAmount: number;
  maxPointsPerOrder: number;
  tierThresholds: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

const DEFAULT_CONFIG: LoyaltyConfig = {
  pointsPerCurrency: 1,
  currencyPerPoint: 1,
  pointsExpiryDays: 365,
  minOrderAmount: 0,
  maxPointsPerOrder: 0,
  tierThresholds: {
    bronze: 0,
    silver: 5000,
    gold: 15000,
    platinum: 30000,
  },
};

export class LoyaltyService {
  private static config: LoyaltyConfig = DEFAULT_CONFIG;

  static setConfig(config: Partial<LoyaltyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  static async initializeLoyaltyAccount(userId: number): Promise<UserLoyaltyAccount> {
    const existing = await UserLoyaltyAccount.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    const account = await UserLoyaltyAccount.create({
      userId,
      totalPoints: 0,
      availablePoints: 0,
      tier: 'bronze',
      totalSpent: 0,
      totalOrders: 0,
      joinDate: new Date(),
      lastPointsUpdate: new Date(),
      isActive: true,
      isBlocked: false,
    });

    return account;
  }

  static async addPointsToOrder(orderId: number, orderAmount: number): Promise<number> {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const userId = order.get('userId') as number;
    let account = await UserLoyaltyAccount.findOne({ where: { userId } });

    if (!account) {
      account = await this.initializeLoyaltyAccount(userId);
    }

    if (orderAmount < this.config.minOrderAmount) {
      return 0;
    }

    let points = Math.floor(orderAmount * this.config.pointsPerCurrency);

    if (this.config.maxPointsPerOrder > 0) {
      points = Math.min(points, this.config.maxPointsPerOrder);
    }

    const balanceBefore = account.get('availablePoints') as number;
    const balanceAfter = balanceBefore + points;

    await account.update({
      totalPoints: (account.get('totalPoints') as number) + points,
      availablePoints: balanceAfter,
      lastPointsUpdate: new Date(),
    });

    await LoyaltyTransaction.create({
      userId,
      type: 'earned',
      pointsAmount: points,
      reason: 'شراء منتجات',
      relatedOrderId: orderId,
      balanceBefore,
      balanceAfter,
    });

    await this.updateTier(userId);

    return points;
  }

  static async redeemPoints(userId: number, pointsAmount: number, rewardId: string, rewardName: string, rewardValue: number, rewardType: string): Promise<LoyaltyRedemption> {
    const account = await UserLoyaltyAccount.findOne({ where: { userId } });
    if (!account) {
      throw new Error('Loyalty account not found');
    }

    const availablePoints = account.get('availablePoints') as number;
    if (availablePoints < pointsAmount) {
      throw new Error('Insufficient loyalty points');
    }

    if (account.get('isBlocked')) {
      throw new Error('Account is blocked');
    }

    const redeemCode = this.generateRedeemCode();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const redemption = await LoyaltyRedemption.create({
      userId,
      rewardId,
      rewardName,
      pointsSpent: pointsAmount,
      rewardValue,
      rewardType: rewardType as any,
      status: 'pending',
      redeemCode,
      expiryDate,
    });

    const balanceBefore = availablePoints;
    const balanceAfter = balanceBefore - pointsAmount;

    await account.update({
      availablePoints: balanceAfter,
      lastPointsUpdate: new Date(),
    });

    await LoyaltyTransaction.create({
      userId,
      type: 'redeemed',
      pointsAmount: -pointsAmount,
      reason: 'استبدال المكافأة',
      relatedRedemptionId: redemption.get('id') as number,
      balanceBefore,
      balanceAfter,
    });

    return redemption;
  }

  static async confirmRedemption(redemptionId: number): Promise<LoyaltyRedemption> {
    const redemption = await LoyaltyRedemption.findByPk(redemptionId);
    if (!redemption) {
      throw new Error('Redemption not found');
    }

    await redemption.update({
      status: 'confirmed',
      redeemedDate: new Date(),
    });

    return redemption;
  }

  static async useRedemption(redemptionId: number, orderId: number): Promise<LoyaltyRedemption> {
    const redemption = await LoyaltyRedemption.findByPk(redemptionId);
    if (!redemption) {
      throw new Error('Redemption not found');
    }

    if (redemption.get('status') !== 'confirmed') {
      throw new Error('Redemption is not confirmed');
    }

    const expiryDate = redemption.get('expiryDate') as Date;
    if (new Date() > expiryDate) {
      throw new Error('Redemption code has expired');
    }

    await redemption.update({
      status: 'used',
      orderId,
    });

    return redemption;
  }

  static async updateTier(userId: number): Promise<void> {
    const account = await UserLoyaltyAccount.findOne({ where: { userId } });
    if (!account) {
      return;
    }

    const totalPoints = account.get('totalPoints') as number;
    let newTier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';

    if (totalPoints >= this.config.tierThresholds.platinum) {
      newTier = 'platinum';
    } else if (totalPoints >= this.config.tierThresholds.gold) {
      newTier = 'gold';
    } else if (totalPoints >= this.config.tierThresholds.silver) {
      newTier = 'silver';
    }

    if (newTier !== account.get('tier')) {
      await account.update({ tier: newTier });
    }
  }

  static async expireOldPoints(): Promise<number> {
    const accounts = await UserLoyaltyAccount.findAll();
    let expiredCount = 0;

    for (const account of accounts) {
      const joinDate = account.get('joinDate') as Date;
      const expiryDate = new Date(joinDate);
      expiryDate.setDate(expiryDate.getDate() + this.config.pointsExpiryDays);

      if (new Date() > expiryDate && account.get('availablePoints') as number > 0) {
        const expiredPoints = account.get('availablePoints') as number;
        const userId = account.get('userId') as number;

        await account.update({ availablePoints: 0 });

        await LoyaltyTransaction.create({
          userId,
          type: 'expired',
          pointsAmount: -expiredPoints,
          reason: 'انتهاء صلاحية النقاط',
          balanceBefore: expiredPoints,
          balanceAfter: 0,
        });

        expiredCount++;
      }
    }

    return expiredCount;
  }

  static async getUserLoyaltyStatus(userId: number): Promise<any> {
    const account = await UserLoyaltyAccount.findOne({ where: { userId } });
    if (!account) {
      return null;
    }

    const transactions = await LoyaltyTransaction.findAll({
      where: { userId },
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    const redemptions = await LoyaltyRedemption.findAll({
      where: { userId },
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    const nextTierThreshold = this.getNextTierThreshold(account.get('tier') as string);

    return {
      account: account.toJSON(),
      transactions: transactions.map(t => t.toJSON()),
      redemptions: redemptions.map(r => r.toJSON()),
      nextTierThreshold,
      progressToNextTier: nextTierThreshold > 0 ? Math.min(((account.get('totalPoints') as number) / nextTierThreshold) * 100, 100) : 100,
    };
  }

  static async getLoyaltyLeaderboard(limit: number = 10): Promise<any[]> {
    const accounts = await UserLoyaltyAccount.findAll({
      where: { isActive: true, isBlocked: false },
      limit,
      order: [['totalPoints', 'DESC']],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    return accounts.map(account => ({
      rank: accounts.indexOf(account) + 1,
      user: account.get('User'),
      tier: account.get('tier'),
      totalPoints: account.get('totalPoints'),
      totalSpent: account.get('totalSpent'),
    }));
  }

  static async getPointsAnalytics(userId: number): Promise<any> {
    const account = await UserLoyaltyAccount.findOne({ where: { userId } });
    if (!account) {
      return null;
    }

    const transactions = await LoyaltyTransaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    const earnedPoints = transactions
      .filter(t => t.get('type') === 'earned')
      .reduce((sum, t) => sum + (t.get('pointsAmount') as number), 0);

    const redeemedPoints = transactions
      .filter(t => t.get('type') === 'redeemed')
      .reduce((sum, t) => sum + Math.abs(t.get('pointsAmount') as number), 0);

    const expiredPoints = transactions
      .filter(t => t.get('type') === 'expired')
      .reduce((sum, t) => sum + Math.abs(t.get('pointsAmount') as number), 0);

    return {
      totalEarned: earnedPoints,
      totalRedeemed: redeemedPoints,
      totalExpired: expiredPoints,
      currentBalance: account.get('availablePoints'),
      totalSpent: account.get('totalSpent'),
      totalOrders: account.get('totalOrders'),
      averagePointsPerOrder: account.get('totalOrders') as number > 0 ? earnedPoints / (account.get('totalOrders') as number) : 0,
      tier: account.get('tier'),
    };
  }

  private static generateRedeemCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private static getNextTierThreshold(currentTier: string): number {
    const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tierOrder.indexOf(currentTier);

    if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
      return 0;
    }

    const nextTier = tierOrder[currentIndex + 1];
    return this.config.tierThresholds[nextTier as keyof typeof this.config.tierThresholds];
  }
}

export default LoyaltyService;
