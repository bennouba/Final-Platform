import Category from '../models/Category';
import Product from '../models/Product';
import Store from '../models/Store';
import { businessTemplates } from '../config/businessTemplates';

class StoreAutoPopulateService {
  /**
   * Auto-populate a store with categories and products based on business type
   */
  async populateStore(storeId: number): Promise<void> {
    // Get store details
    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new Error(`Store with ID ${storeId} not found`);
    }

    // Find matching business template
    const template = businessTemplates.find(t =>
      t.type.toLowerCase() === store.category.toLowerCase() ||
      t.name.toLowerCase() === store.category.toLowerCase() ||
      t.nameAr === store.category
    );

    if (!template) {
      return;
    }

    // Create categories
    const categoryMap = new Map<string, number>();
    for (const categoryTemplate of template.categories) {
      const categoryData: any = {
        name: categoryTemplate.name,
        nameAr: categoryTemplate.nameAr,
        storeId: storeId,
        sortOrder: categoryTemplate.sortOrder,
        isActive: true,
      };

      if (categoryTemplate.description !== undefined) {
        categoryData.description = categoryTemplate.description;
      }
      if (categoryTemplate.image !== undefined) {
        categoryData.image = categoryTemplate.image;
      }

      const category = await Category.create(categoryData);
      categoryMap.set(categoryTemplate.name, category.id);
    }

    // Create products
    for (const productTemplate of template.products) {
      // Find category ID for this product
      const firstWord = (productTemplate.nameAr.split(' ')[0] ?? '');
      const categoryId = categoryMap.get(firstWord + ' Clothing') ||
                        categoryMap.get(firstWord + ' Care') ||
                        categoryMap.get(firstWord);

      if (!categoryId) {
        continue;
      }

      const productData: any = {
        name: productTemplate.name,
        price: productTemplate.price,
        category: firstWord,
        image: productTemplate.image,
        storeId: storeId,
        inStock: productTemplate.quantity > 0,
        quantity: productTemplate.quantity,
        rating: 4.5,
        reviewCount: 0,
      };

      if (productTemplate.description !== undefined) {
        productData.description = productTemplate.description;
      }
      if (productTemplate.originalPrice !== undefined) {
        productData.originalPrice = productTemplate.originalPrice;
      }
      if (productTemplate.discountPercent !== undefined) {
        productData.discountPercent = productTemplate.discountPercent;
      }
      if (productTemplate.discountType !== undefined) {
        productData.discountType = productTemplate.discountType;
      }
      if (productTemplate.brand !== undefined) {
        productData.brand = productTemplate.brand;
      }
      if (productTemplate.images) {
        productData.images = productTemplate.images;
      }
      if (productTemplate.productCode !== undefined) {
        productData.productCode = productTemplate.productCode;
      }
      if (productTemplate.barcode !== undefined) {
        productData.barcode = productTemplate.barcode;
      }

      await Product.create(productData);
    }
  }

  /**
   * Get available business types
   */
  getAvailableBusinessTypes() {
    return businessTemplates.map(template => ({
      type: template.type,
      name: template.name,
      nameAr: template.nameAr,
      categoryCount: template.categories.length,
      productCount: template.products.length,
    }));
  }

  /**
   * Check if a store has been populated
   */
  async isStorePopulated(storeId: number): Promise<boolean> {
    try {
      const productCount = await Product.count({ where: { storeId } });
      const categoryCount = await Category.count({ where: { storeId } });

      return productCount > 0 || categoryCount > 0;
    } catch (error) {

      return false;
    }
  }
}

export default new StoreAutoPopulateService();
