import Product from '@models/Product';
import { Op } from 'sequelize';

// متجر إنديش (المتجر الوحيد الذي يستخدم قاعدة البيانات)
const INDEESH_STORE_ID = 1764003948994;

// دالة لحساب الـ badge للمنتج بناءً على الإحصائيات
export const calculateBadgeForProduct = (product: any): string => {
  const views = product.views || 0;
  const likes = product.likes || 0;
  const orders = product.orders || 0;
  const quantity = product.quantity || 0;
  const originalPrice = product.originalPrice || product.price || 0;
  const price = product.price || 0;

  // 1. أولوية أولى: المنتجات غير المتوفرة
  if (quantity <= 0) {
    return 'غير متوفر';
  }

  // 2. ثانيوية ثانية: المنتجات المخفضة (تخفيض أكثر من 10%)
  if (originalPrice > price && ((originalPrice - price) / originalPrice) >= 0.1) {
    return 'تخفيضات';
  }

  // 3. ثالثوية ثالثة: المنتجات المميزة (طلبات عالية + إعجابات عالية)
  if (orders > 100 && likes > 200) {
    return 'مميزة';
  }

  // 4. رابعوية رابعة: أكثر مبيعاً (طلبات عالية)
  if (orders > 100) {
    return 'أكثر مبيعاً';
  }

  // 5. خامسة خامسة: أكثر إعجاباً (إعجابات عالية)
  if (likes > 200) {
    return 'أكثر إعجاباً';
  }

  // 6. سادسة سادسة: أكثر مشاهدة (مشاهدات عالية)
  if (views > 400) {
    return 'أكثر مشاهدة';
  }

  // 7. سابعة سابعة: أكثر طلباً (طلبات متوسطة)
  if (orders > 50) {
    return 'أكثر طلباً';
  }

  // 8. أخيراً: المنتجات الجديدة
  return 'جديد';
};

// نظام مختلط ذكي للـ badges
export class HybridBadgeService {
  // دالة لتحديث الـ badge للمنتج من قاعدة البيانات
  private static async updateProductBadge(product: Product): Promise<void> {
    const calculatedBadge = calculateBadgeForProduct(product.toJSON());
    
    if (product.badge !== calculatedBadge) {
      await product.update({
        badge: calculatedBadge,
        lastBadgeUpdate: new Date()
      });
    }
  }

  // دالة للحصول على المنتجات مع نظام الـ badges المختلط
  static async getProductsWithBadges(options: {
    where?: any;
    limit?: number;
    offset?: number;
    include?: any[];
  } = {}): Promise<any[]> {
    const { where = {}, limit = 10, offset = 0, include = [] } = options;

    // جلب المنتجات من قاعدة البيانات
    const products = await Product.findAll({
      where,
      limit,
      offset,
      include,
      order: [['createdAt', 'DESC']]
    });

    // تحديث الـ badges للمنتجات من قاعدة البيانات
    const productsWithBadges = await Promise.all(
      products.map(async (product) => {
        const productData = product.toJSON();
        
        // تحديث الـ badge إذا لزم الأمر
        await this.updateProductBadge(product);
        
        // إضافة tags بناءً على الـ badge
        const updatedProduct = product.toJSON();
        updatedProduct.tags = updatedProduct.tags || [];
        if (updatedProduct.badge && !updatedProduct.tags.includes(updatedProduct.badge)) {
          updatedProduct.tags.push(updatedProduct.badge);
        }
        
        return updatedProduct;
      })
    );

    return productsWithBadges;
  }

  // دالة مختلطة: تجمع بين المنتجات من قاعدة البيانات والملفات الثابتة
  static async getStoreProducts(storeId: number, staticProducts: any[] = []) {
    // أولاً: جلب المنتجات من قاعدة البيانات (إنديش)
    const dbProducts = await this.getProductsWithBadges({
      where: { storeId }
    });

    // ثانياً: إضافة المنتجات الثابتة من الملفات
    const staticStoreProducts = staticProducts.filter(p => p.storeId === storeId);

    // دمج المنتجات (من قاعدة البيانات أولاً، ثم الثابتة)
    const allProducts = [...dbProducts, ...staticStoreProducts];

    return allProducts;
  }

  // دالة لتحديث إحصائيات المنتج
  static async updateProductStats(productId: number, stats: {
    views?: number;
    likes?: number;
    orders?: number;
  }): Promise<void> {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.update(stats);
    
    // تحديث الـ badge بعد تحديث الإحصائيات
    await this.updateProductBadge(product);
  }

  // دالة لحساب عدد المنتجات حسب كل badge
  static async getBadgeStatistics(storeId?: number): Promise<Record<string, number>> {
    const whereClause = storeId ? { storeId } : {};
    
    const products = await Product.findAll({
      where: whereClause,
      attributes: ['badge']
    });

    const stats: Record<string, number> = {};
    
    products.forEach(product => {
      const badge = product.badge || 'جديد';
      stats[badge] = (stats[badge] || 0) + 1;
    });

    return stats;
  }

  // دالة لحساب الأكثر مبيعاً في متجر معين
  static async getTopSellingProducts(storeId: number, limit: number = 10): Promise<any[]> {
    const products = await Product.findAll({
      where: { 
        storeId,
        orders: { [Op.gt]: 0 }
      },
      order: [['orders', 'DESC']],
      limit,
      include: [{ model: Product, as: 'related' }]
    });

    // تحديث الـ badges
    const productsWithBadges = await Promise.all(
      products.map(async (product) => {
        await this.updateProductBadge(product);
        const updatedProduct = product.toJSON();
        updatedProduct.tags = updatedProduct.tags || [];
        if (updatedProduct.badge && !updatedProduct.tags.includes(updatedProduct.badge)) {
          updatedProduct.tags.push(updatedProduct.badge);
        }
        return updatedProduct;
      })
    );

    return productsWithBadges;
  }

  // دالة لتحديث جميع الـ badges في متجر معين
  static async updateAllBadgesInStore(storeId: number): Promise<void> {
    const products = await Product.findAll({
      where: { storeId }
    });

    for (const product of products) {
      await this.updateProductBadge(product);
    }

    console.log(`Updated badges for ${products.length} products in store ${storeId}`);
  }

  // دالة لتحديث جميع الـ badges في جميع المتاجر
  static async updateAllBadgesInDatabase(): Promise<void> {
    const products = await Product.findAll();
    let updatedCount = 0;

    for (const product of products) {
      const oldBadge = product.badge;
      await this.updateProductBadge(product);
      
      if (product.badge !== oldBadge) {
        updatedCount++;
      }
    }

    console.log(`Updated badges for ${updatedCount} products out of ${products.length} total products`);
  }
}

export default HybridBadgeService;