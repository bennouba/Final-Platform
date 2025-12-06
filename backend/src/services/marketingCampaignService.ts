import Order from '@models/Order';
import User from '@models/User';
import Product from '@models/Product';
import { Op, Sequelize } from 'sequelize';

interface CampaignConfig {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'whatsapp' | 'social' | 'push';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused' | 'cancelled';
  targetAudience: 'all' | 'active' | 'inactive' | 'vip' | 'new' | 'custom';
  targetFilters?: {
    minOrderValue?: number;
    maxOrderValue?: number;
    minOrders?: number;
    maxOrders?: number;
    joinedAfter?: Date;
    joinedBefore?: Date;
    categories?: string[];
  };
  startDate: Date;
  endDate?: Date;
  budget: number;
  channels: string[];
  content: {
    subject?: string;
    message: string;
    image?: string;
    callToAction?: string;
    landingPage?: string;
  };
  offerType: 'percentage' | 'fixed_amount' | 'free_product' | 'free_shipping';
  offerValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CampaignMetrics {
  campaignId: string;
  targetedCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  roi: number;
  spent: number;
  usedCouponCount: number;
}

export class MarketingCampaignService {
  private static campaigns: Map<string, CampaignConfig> = new Map();
  private static metrics: Map<string, CampaignMetrics> = new Map();

  static async createCampaign(config: CampaignConfig): Promise<CampaignConfig> {
    const campaignId = config.id || Date.now().toString();
    const campaign: CampaignConfig = {
      ...config,
      id: campaignId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
    };

    this.campaigns.set(campaignId, campaign);

    const metrics: CampaignMetrics = {
      campaignId,
      targetedCount: 0,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
      roi: 0,
      spent: 0,
      usedCouponCount: 0,
    };

    this.metrics.set(campaignId, metrics);

    return campaign;
  }

  static async getTargetAudience(config: CampaignConfig): Promise<User[]> {
    let whereClause: any = {};

    switch (config.targetAudience) {
      case 'active':
        whereClause = { lastLoginAt: { [Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
        break;

      case 'inactive':
        whereClause = { lastLoginAt: { [Op.lt]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } };
        break;

      case 'vip':
        const vipUsers = await User.findAll({
          include: [{
            model: Order,
            attributes: [],
            required: false,
          }],
          attributes: [
            'id',
            'email',
            'name',
            [Sequelize.fn('COUNT', Sequelize.col('Orders.id')), 'orderCount'],
            [Sequelize.fn('SUM', Sequelize.col('Orders.totalAmount')), 'totalSpent'],
          ],
          group: ['User.id'],
          having: Sequelize.where(Sequelize.fn('SUM', Sequelize.col('Orders.totalAmount')), Op.gt, 5000),
          raw: true,
        });
        return vipUsers as any[];

      case 'new':
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        whereClause = { createdAt: { [Op.gt]: thirtyDaysAgo } };
        break;

      case 'custom':
        if (config.targetFilters) {
          if (config.targetFilters.minOrderValue) {
            whereClause[Op.or] = whereClause[Op.or] || [];
          }
        }
        break;

      default:
        break;
    }

    const users = await User.findAll({ where: whereClause });
    return users;
  }

  static async startCampaign(campaignId: string): Promise<CampaignConfig> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = 'active';
    campaign.startDate = new Date();
    campaign.updatedAt = new Date();

    this.campaigns.set(campaignId, campaign);

    const targetAudience = await this.getTargetAudience(campaign);
    const metrics = this.metrics.get(campaignId);
    if (metrics) {
      metrics.targetedCount = targetAudience.length;
    }

    return campaign;
  }

  static async pauseCampaign(campaignId: string): Promise<CampaignConfig> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = 'paused';
    campaign.updatedAt = new Date();

    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  static async resumeCampaign(campaignId: string): Promise<CampaignConfig> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = 'active';
    campaign.updatedAt = new Date();

    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  static async completeCampaign(campaignId: string): Promise<CampaignConfig> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = 'completed';
    campaign.endDate = new Date();
    campaign.updatedAt = new Date();

    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  static async trackCampaignMetrics(campaignId: string, event: 'sent' | 'opened' | 'clicked' | 'converted', data?: any): Promise<void> {
    const metrics = this.metrics.get(campaignId);
    if (!metrics) {
      return;
    }

    switch (event) {
      case 'sent':
        metrics.sentCount += 1;
        if (data?.spent) {
          metrics.spent += data.spent;
        }
        break;

      case 'opened':
        metrics.openRate = (metrics.sentCount > 0) ? (metrics.openRate * metrics.sentCount + 1) / (metrics.sentCount + 1) : 1;
        break;

      case 'clicked':
        metrics.clickRate = (metrics.sentCount > 0) ? (metrics.clickRate * metrics.sentCount + 1) / (metrics.sentCount + 1) : 1;
        break;

      case 'converted':
        if (data?.revenue) {
          metrics.revenue += data.revenue;
          metrics.conversionRate = metrics.sentCount > 0 ? (metrics.revenue / metrics.sentCount) : 0;
          metrics.roi = metrics.spent > 0 ? ((metrics.revenue - metrics.spent) / metrics.spent) * 100 : 0;
        }
        break;
    }

    this.metrics.set(campaignId, metrics);
  }

  static async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics | null> {
    return this.metrics.get(campaignId) || null;
  }

  static async getAllCampaigns(): Promise<CampaignConfig[]> {
    return Array.from(this.campaigns.values());
  }

  static async getCampaign(campaignId: string): Promise<CampaignConfig | null> {
    return this.campaigns.get(campaignId) || null;
  }

  static async updateCampaign(campaignId: string, updates: Partial<CampaignConfig>): Promise<CampaignConfig> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const updated: CampaignConfig = {
      ...campaign,
      ...updates,
      id: campaign.id,
      createdAt: campaign.createdAt,
      updatedAt: new Date(),
    };

    this.campaigns.set(campaignId, updated);
    return updated;
  }

  static async deleteCampaign(campaignId: string): Promise<boolean> {
    const deleted = this.campaigns.delete(campaignId);
    if (deleted) {
      this.metrics.delete(campaignId);
    }
    return deleted;
  }

  static async generateAutomaticCampaigns(): Promise<CampaignConfig[]> {
    const generatedCampaigns: CampaignConfig[] = [];

    const today = new Date();
    const month = today.getMonth() + 1;

    if ([3, 4, 5].includes(month)) {
      generatedCampaigns.push({
        id: `spring-promo-${Date.now()}`,
        name: 'عروض الربيع',
        description: 'حملة ترويجية موسمية لشهري الربيع',
        type: 'email',
        status: 'draft',
        targetAudience: 'all',
        startDate: today,
        endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        budget: 1000,
        channels: ['email', 'sms'],
        content: {
          subject: 'عروض الربيع حتى 40% - لا تفوت الفرصة!',
          message: 'استمتع بعروضنا الموسمية الرائعة',
          callToAction: 'تسوق الآن',
        },
        offerType: 'percentage',
        offerValue: 40,
        createdAt: today,
        updatedAt: today,
      });
    }

    if ([12, 1].includes(month)) {
      generatedCampaigns.push({
        id: `new-year-promo-${Date.now()}`,
        name: 'عروض السنة الجديدة',
        description: 'احتفل معنا برأس السنة بعروض حصرية',
        type: 'whatsapp',
        status: 'draft',
        targetAudience: 'active',
        startDate: today,
        endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        budget: 1500,
        channels: ['whatsapp', 'push'],
        content: {
          message: 'كل سنة وأنتم بألف خير! تمتعوا بخصومات رأس السنة الآن',
          callToAction: 'احصل على العرض',
        },
        offerType: 'fixed_amount',
        offerValue: 50,
        createdAt: today,
        updatedAt: today,
      });
    }

    const inactiveUsers = await User.findAll({
      where: {
        lastLoginAt: { [Op.lt]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    });

    if (inactiveUsers.length > 0) {
      generatedCampaigns.push({
        id: `reactivation-${Date.now()}`,
        name: 'حملة استعادة المستخدمين النشطين',
        description: 'عودة خاصة للعملاء الذين لم يزوروا المتجر مؤخراً',
        type: 'email',
        status: 'draft',
        targetAudience: 'inactive',
        startDate: today,
        endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        budget: 500,
        channels: ['email'],
        content: {
          subject: 'نفتقد إليك! عودة خاصة معنا',
          message: 'عد إلينا واستمتع بعروضنا الخاصة',
          callToAction: 'تسوق الآن',
        },
        offerType: 'percentage',
        offerValue: 25,
        createdAt: today,
        updatedAt: today,
      });
    }

    for (const campaign of generatedCampaigns) {
      await this.createCampaign(campaign);
    }

    return generatedCampaigns;
  }

  static async getSegmentAnalytics(segment: 'age' | 'gender' | 'location' | 'spending'): Promise<any> {
    const users = await User.findAll({
      include: [{
        model: Order,
        attributes: [],
        required: false,
      }],
      attributes: [
        'id',
        'email',
        'name',
        segment === 'age' ? 'dateOfBirth' : undefined,
        segment === 'gender' ? 'gender' : undefined,
        segment === 'location' ? 'city' : undefined,
        [Sequelize.fn('COUNT', Sequelize.col('Orders.id')), 'orderCount'],
        [Sequelize.fn('SUM', Sequelize.col('Orders.totalAmount')), 'totalSpent'],
      ].filter(Boolean) as any[],
      group: segment === 'age' ? ['User.id', 'User.dateOfBirth'] :
             segment === 'gender' ? ['User.id', 'User.gender'] :
             segment === 'location' ? ['User.id', 'User.city'] :
             ['User.id'],
      raw: true,
    });

    return users;
  }

  static async scheduleAutomaticCampaigns(): Promise<void> {
    const campaigns = await this.generateAutomaticCampaigns();
    for (const campaign of campaigns) {
      await this.createCampaign(campaign);
    }
  }
}

export default MarketingCampaignService;
