import sequelize from '@config/database';
import logger from '@utils/logger';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Seed admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminId = uuidv4();

    await sequelize.query(`
      INSERT IGNORE INTO users (id, email, password, first_name, last_name, phone, role, merchant_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        adminId,
        'admin@eishro.ly',
        adminPassword,
        'مدير',
        'النظام',
        '+21891000000',
        'admin',
        true
      ]
    });

    // Seed sample merchants
    const merchants = [
      {
        id: uuidv4(),
        email: 'merchant1@eishro.ly',
        password: await bcrypt.hash('merchant123', 10),
        firstName: 'أحمد',
        lastName: 'التاجر',
        phone: '+21891000001',
        storeName: 'متجر نواعم',
        storeSlug: 'nawaem',
        storeCategory: 'ملابس نسائية',
        storeDescription: 'متجر متخصص في الملابس النسائية الأنيقة'
      },
      {
        id: uuidv4(),
        email: 'merchant2@eishro.ly',
        password: await bcrypt.hash('merchant123', 10),
        firstName: 'فاطمة',
        lastName: 'التاجرة',
        phone: '+21891000002',
        storeName: 'متجر شيرين',
        storeSlug: 'sheirine',
        storeCategory: 'إكسسوارات',
        storeDescription: 'متجر متخصص في الإكسسوارات والمجوهرات'
      }
    ];

    for (const merchant of merchants) {
      await sequelize.query(`
        INSERT IGNORE INTO users (id, email, password, first_name, last_name, phone, role, store_name, store_slug, store_category, store_description, merchant_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          merchant.id,
          merchant.email,
          merchant.password,
          merchant.firstName,
          merchant.lastName,
          merchant.phone,
          'merchant',
          merchant.storeName,
          merchant.storeSlug,
          merchant.storeCategory,
          merchant.storeDescription,
          true
        ]
      });

      // Create store entry
      await sequelize.query(`
        INSERT IGNORE INTO stores (merchant_id, name, slug, category, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          merchant.id,
          merchant.storeName,
          merchant.storeSlug,
          merchant.storeCategory,
          merchant.storeDescription,
          true
        ]
      });
    }

    // Seed sample customers
    const customers = [
      {
        id: uuidv4(),
        email: 'customer1@eishro.ly',
        password: await bcrypt.hash('customer123', 10),
        firstName: 'محمد',
        lastName: 'العميل',
        phone: '+21891000003'
      },
      {
        id: uuidv4(),
        email: 'customer2@eishro.ly',
        password: await bcrypt.hash('customer123', 10),
        firstName: 'سارة',
        lastName: 'العميلة',
        phone: '+21891000004'
      }
    ];

    for (const customer of customers) {
      await sequelize.query(`
        INSERT IGNORE INTO users (id, email, password, first_name, last_name, phone, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          customer.id,
          customer.email,
          customer.password,
          customer.firstName,
          customer.lastName,
          customer.phone,
          'customer'
        ]
      });
    }

    // Seed sample products
    const products = [
      {
        name: 'فستان صيفي أنيق',
        description: 'فستان صيفي مريح وأنيق للمناسبات',
        price: 150.000,
        category: 'ملابس نسائية',
        brand: 'نواعم',
        in_stock: true,
        quantity: 25,
        sku: 'DRESS001'
      },
      {
        name: 'حقيبة يد أنيقة',
        description: 'حقيبة يد جلدية فاخرة',
        price: 200.000,
        category: 'إكسسوارات',
        brand: 'شيرين',
        in_stock: true,
        quantity: 15,
        sku: 'BAG001'
      },
      {
        name: 'عقد ذهبي',
        description: 'عقد ذهبي أنيق مع حجر طبيعي',
        price: 300.000,
        category: 'مجوهرات',
        brand: 'شيرين',
        in_stock: true,
        quantity: 8,
        sku: 'NECK001'
      }
    ];

    for (const product of products) {
      await sequelize.query(`
        INSERT IGNORE INTO products (name, description, price, category, brand, in_stock, quantity, sku)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          product.name,
          product.description,
          product.price,
          product.category,
          product.brand,
          product.in_stock,
          product.quantity,
          product.sku
        ]
      });
    }

    // Seed sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'خصم 10% للعملاء الجدد',
        discount_percentage: 10,
        min_order_amount: 100.000,
        max_uses: 100,
        is_active: true
      },
      {
        code: 'SUMMER20',
        description: 'خصم 20% على الملابس الصيفية',
        discount_percentage: 20,
        min_order_amount: 200.000,
        max_uses: 50,
        is_active: true
      }
    ];

    for (const coupon of coupons) {
      await sequelize.query(`
        INSERT IGNORE INTO coupons (code, description, discount_percentage, min_order_amount, max_uses, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          coupon.code,
          coupon.description,
          coupon.discount_percentage,
          coupon.min_order_amount,
          coupon.max_uses,
          coupon.is_active
        ]
      });
    }

    logger.info('✅ Database seeding completed successfully');
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('🎉 Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
