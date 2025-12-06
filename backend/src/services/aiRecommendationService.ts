import Product from '@models/Product';
import Order from '@models/Order';
import OrderItem from '@models/OrderItem';
import User from '@models/User';
import { Op, Sequelize } from 'sequelize';

interface RecommendationResult {
  product: any;
  score: number;
  reason: string;
  type: 'viewed' | 'purchased' | 'similar' | 'trending' | 'personalized';
}

interface ContentRecommendation {
  id: string;
  type: 'product_category' | 'brand' | 'promotion' | 'guide' | 'offer';
  title: string;
  description: string;
  image?: string;
  score: number;
  reason: string;
}

interface UserProfile {
  userId: number;
  favoriteCategories: string[];
  purchaseHistory: any[];
  viewedProducts: any[];
  averageOrderValue: number;
  totalOrders: number;
  preferredPriceRange: { min: number; max: number };
}

export class AIRecommendationService {
  static readonly MIN_RECOMMENDATION_SCORE = 0.4;
  static readonly MAX_RECOMMENDATIONS = 10;
  static readonly CATEGORY_WEIGHT = 0.3;
  static readonly PRICE_WEIGHT = 0.25;
  static readonly RATING_WEIGHT = 0.25;
  static readonly TREND_WEIGHT = 0.2;

  static async buildUserProfile(userId: number): Promise<UserProfile> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem }]
    });

    const purchaseHistory: any[] = [];
    const categoryMap: Record<string, number> = {};
    let totalSpent = 0;

    for (const order of orders) {
      const items = order.get('OrderItems') || [];
      for (const item of items) {
        const product = await Product.findByPk(item.get('productId'));
        if (product) {
          purchaseHistory.push(product);
          categoryMap[product.get('category')] = (categoryMap[product.get('category')] || 0) + 1;
          totalSpent += item.get('price') * item.get('quantity');
        }
      }
    }

    const favoriteCategories = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat]) => cat);

    const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
    const prices = purchaseHistory.map(p => p.get('price'));
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 1000;
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length || 0;

    return {
      userId,
      favoriteCategories,
      purchaseHistory,
      viewedProducts: [],
      averageOrderValue,
      totalOrders: orders.length,
      preferredPriceRange: {
        min: Math.max(0, avgPrice * 0.7),
        max: avgPrice * 1.5
      }
    };
  }

  static async getProductRecommendations(userId: number, limit: number = 10): Promise<RecommendationResult[]> {
    try {
      const profile = await this.buildUserProfile(userId);
      const recommendations: RecommendationResult[] = [];
      const seenProductIds = new Set(profile.purchaseHistory.map(p => p.id));

      const products = await Product.findAll({
        where: {
          id: { [Op.notIn]: Array.from(seenProductIds) }
        },
        limit: 100,
        order: [['orders', 'DESC']]
      });

      for (const product of products) {
        const score = this.calculateProductScore(product, profile);

        if (score >= this.MIN_RECOMMENDATION_SCORE) {
          const reason = this.getRecommendationReason(product, profile);

          recommendations.push({
            product,
            score,
            reason,
            type: this.getRecommendationType(product, profile)
          });
        }
      }

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(limit, this.MAX_RECOMMENDATIONS));
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return [];
    }
  }

  static async getContentRecommendations(userId: number, limit: number = 8): Promise<ContentRecommendation[]> {
    try {
      const profile = await this.buildUserProfile(userId);
      const recommendations: ContentRecommendation[] = [];

      for (const category of profile.favoriteCategories) {
        const categoryProducts = await Product.findAll({
          where: {
            category,
            id: { [Op.notIn]: profile.purchaseHistory.map(p => p.id) }
          },
          limit: 5,
          order: [['orders', 'DESC']]
        });

        if (categoryProducts.length > 0) {
          const avgPrice = categoryProducts.reduce((sum, p) => sum + p.get('price'), 0) / categoryProducts.length;
          const topProduct = categoryProducts[0];

          recommendations.push({
            id: `category-${category}`,
            type: 'product_category',
            title: `اكتشف المزيد من ${category}`,
            description: `استكشف مجموعة منتجاتنا المتنوعة في فئة ${category} بأسعار تبدأ من ${avgPrice.toFixed(2)} دينار ليبي`,
            image: topProduct.get('image'),
            score: this.calculateCategoryScore(categoryProducts, profile),
            reason: `بناءً على تاريخ شرائك المفضل في فئة ${category}`
          });
        }
      }

      const trendingProducts = await Product.findAll({
        where: {
          orders: { [Op.gt]: 50 }
        },
        limit: 5,
        order: [['orders', 'DESC']]
      });

      if (trendingProducts.length > 0) {
        recommendations.push({
          id: 'trending-content',
          type: 'promotion',
          title: 'المنتجات الرائجة هذا الأسبوع',
          description: 'اطلع على أكثر المنتجات المطلوبة من قبل عملائنا',
          image: trendingProducts[0].get('image'),
          score: 0.9,
          reason: 'بناءً على أحدث اتجاهات السوق'
        });
      }

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(limit, 8));
    } catch (error) {
      console.error('Error getting content recommendations:', error);
      return [];
    }
  }

  static async getSimilarProducts(productId: number, limit: number = 5): Promise<any[]> {
    try {
      const baseProduct = await Product.findByPk(productId);
      if (!baseProduct) {
        throw new Error('Product not found');
      }

      const similarProducts = await Product.findAll({
        where: {
          category: baseProduct.get('category'),
          id: { [Op.ne]: productId }
        },
        limit,
        order: [['orders', 'DESC']]
      });

      return similarProducts;
    } catch (error) {
      console.error('Error getting similar products:', error);
      return [];
    }
  }

  static async getPersonalizedFeed(userId: number, limit: number = 20): Promise<any[]> {
    try {
      const profile = await this.buildUserProfile(userId);
      const recommendations = await this.getProductRecommendations(userId, limit * 2);

      return recommendations
        .map(r => ({
          ...r.product.toJSON(),
          recommendationScore: r.score,
          recommendationReason: r.reason,
          recommendationType: r.type
        }))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting personalized feed:', error);
      return [];
    }
  }

  static async getSeasonalRecommendations(limit: number = 10): Promise<RecommendationResult[]> {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const seasonalKeywords: Record<number, string[]> = {
        1: ['شتاء', 'دفء', 'ملابس ثقيلة'],
        2: [],
        3: ['ربيع', 'تنظيف', 'تجديد'],
        4: [],
        5: [],
        6: ['صيف', 'برودة', 'مشروبات'],
        7: [],
        8: [],
        9: ['عودة للدراسة', 'مدرسة'],
        10: ['هالوين'],
        11: [],
        12: ['رأس السنة', 'عطل']
      };

      const keywords = seasonalKeywords[currentMonth] || [];
      const recommendations: RecommendationResult[] = [];

      if (keywords.length > 0) {
        const products = await Product.findAll({
          where: {
            [Op.or]: keywords.map(keyword => ({
              name: { [Op.iLike]: `%${keyword}%` }
            }))
          },
          limit,
          order: [['orders', 'DESC']]
        });

        for (const product of products) {
          recommendations.push({
            product,
            score: 0.85,
            reason: 'عرض موسمي خاص',
            type: 'trending'
          });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting seasonal recommendations:', error);
      return [];
    }
  }

  private static calculateProductScore(product: any, profile: UserProfile): number {
    let score = 0;

    const category = product.get('category');
    const categoryMatch = profile.favoriteCategories.includes(category) ? 1 : 0.5;
    score += categoryMatch * this.CATEGORY_WEIGHT;

    const price = product.get('price');
    const priceInRange = price >= profile.preferredPriceRange.min && price <= profile.preferredPriceRange.max ? 1 : 0.5;
    score += priceInRange * this.PRICE_WEIGHT;

    const rating = product.get('rating') || 3;
    const ratingScore = Math.min(rating / 5, 1);
    score += ratingScore * this.RATING_WEIGHT;

    const orders = product.get('orders') || 0;
    const trendScore = Math.min(orders / 200, 1);
    score += trendScore * this.TREND_WEIGHT;

    return Math.min(score, 1);
  }

  private static calculateCategoryScore(products: any[], profile: UserProfile): number {
    const avgOrders = products.reduce((sum, p) => sum + p.get('orders'), 0) / products.length;
    const avgRating = products.reduce((sum, p) => sum + (p.get('rating') || 3), 0) / products.length;

    return Math.min((avgOrders / 100 + avgRating / 5) / 2, 1);
  }

  private static getRecommendationType(product: any, profile: UserProfile): 'viewed' | 'purchased' | 'similar' | 'trending' | 'personalized' {
    const orders = product.get('orders') || 0;

    if (orders > 100) {
      return 'trending';
    }

    const category = product.get('category');
    if (profile.favoriteCategories.includes(category)) {
      return 'personalized';
    }

    return 'similar';
  }

  private static getRecommendationReason(product: any, profile: UserProfile): string {
    const reasons: string[] = [];

    const category = product.get('category');
    if (profile.favoriteCategories.includes(category)) {
      reasons.push(`أنت تفضل منتجات من فئة ${category}`);
    }

    const price = product.get('price');
    if (price >= profile.preferredPriceRange.min && price <= profile.preferredPriceRange.max) {
      reasons.push('ضمن نطاق الأسعار المفضلة لديك');
    }

    const rating = product.get('rating') || 0;
    if (rating >= 4) {
      reasons.push(`يتمتع بتقييم عالي ${rating}/5`);
    }

    const orders = product.get('orders') || 0;
    if (orders > 100) {
      reasons.push('من أكثر المنتجات مبيعاً');
    }

    return reasons.length > 0 ? reasons[0] : 'قد يعجبك هذا المنتج';
  }

  static async trackProductView(userId: number, productId: number): Promise<void> {
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        const views = (product.get('views') || 0) + 1;
        await product.update({ views });
      }
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  }

  static async getRecommendationStats(): Promise<any> {
    try {
      const totalProducts = await Product.count();
      const topProducts = await Product.findAll({
        order: [['orders', 'DESC']],
        limit: 10
      });
      const topCategories = await Product.findAll({
        attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: ['category'],
        order: [[Sequelize.literal('count'), 'DESC']],
        limit: 10,
        raw: true
      });

      return {
        totalProducts,
        topProducts,
        topCategories
      };
    } catch (error) {
      console.error('Error getting recommendation stats:', error);
      return {};
    }
  }
}

export default AIRecommendationService;
