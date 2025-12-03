import { Op } from 'sequelize';
import StoreFeature from '@models/StoreFeature';
import SubscriptionPlan from '@models/SubscriptionPlan';
import StoreSubscription from '@models/StoreSubscription';
import Store from '@models/Store';

const PLAN_DEFINITIONS = [
  {
    code: 'basic',
    name: 'Basic',
    description: 'الخطة الأساسية',
    features: ['catalog-products', 'catalog-stock', 'catalog-slider', 'orders-unavailable'],
  },
  {
    code: 'pro',
    name: 'Pro',
    description: 'الخطة الاحترافية',
    features: ['catalog-products', 'catalog-stock', 'catalog-slider', 'orders-unavailable', 'orders-manual', 'orders-abandoned', 'inventory-alerts'],
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    description: 'الخطة المتقدمة',
    features: ['catalog-products', 'catalog-stock', 'catalog-slider', 'orders-unavailable', 'orders-manual', 'orders-abandoned', 'inventory-alerts', 'reports', 'advanced-marketing'],
  },
];

class StoreFeatureService {
  async ensurePlans(): Promise<void> {
    for (const plan of PLAN_DEFINITIONS) {
      await SubscriptionPlan.findOrCreate({
        where: { code: plan.code },
        defaults: {
          code: plan.code,
          name: plan.name,
          description: plan.description,
          features: plan.features,
        },
      });
    }
  }

  async ensureFeatureRecord(storeId: number, planCode: string): Promise<StoreFeature> {
    await this.ensurePlans();
    const plan = await SubscriptionPlan.findOne({ where: { code: planCode } });
    if (!plan) {
      throw new Error('Subscription plan missing');
    }
    const [feature] = await StoreFeature.findOrCreate({
      where: { storeId },
      defaults: {
        storeId,
        enabledFeatures: plan.features,
        disabledFeatures: [],
      },
    });
    const [subscription] = await StoreSubscription.findOrCreate({
      where: {
        storeId,
        planId: plan.id,
        status: { [Op.in]: ['active', 'trial'] },
      },
      defaults: {
        storeId,
        planId: plan.id,
        status: 'trial',
        startsAt: new Date(),
        expiresAt: null,
        metadata: null,
      },
    });
    if (subscription.planId !== plan.id) {
      await subscription.update({ planId: plan.id });
    }
    return feature;
  }

  async resolveFeatures(storeId: number): Promise<{ features: string[]; planFeatures: string[]; enabled: string[]; disabled: string[] }> {
    const feature = await StoreFeature.findOne({ where: { storeId } });
    const subscription = await StoreSubscription.findOne({
      where: { storeId },
      include: [{ model: SubscriptionPlan, as: 'plan' }],
      order: [['createdAt', 'DESC']],
    });
    const planFeatures = subscription?.plan?.features || [];
    const enabled = feature?.enabledFeatures || [];
    const disabled = feature?.disabledFeatures || [];
    const featureSet = new Set([...planFeatures, ...enabled]);
    disabled.forEach((item) => featureSet.delete(item));
    return {
      features: Array.from(featureSet),
      planFeatures,
      enabled,
      disabled,
    };
  }

  async getStoreBySlug(slug: string): Promise<Store | null> {
    return Store.findOne({ where: { slug } });
  }
}

export default new StoreFeatureService();
