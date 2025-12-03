import dotenv from 'dotenv';
import path from 'path';
import sequelize from '@config/database';
import { initializeModels } from '@models/index';
import Store from '@models/Store';
import User from '@models/User';
import logger from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const MERCHANTS = [
  {
    slug: 'nawaem',
    email: 'mounir@gmail.com',
    password: 'mounir123',
    phone: '218910000001',
    name: 'متجر نوايم',
    category: 'beauty',
    owner: 'منير'
  },
  {
    slug: 'sherine',
    email: 'salem@gmail.com',
    password: 'salem123',
    phone: '218910000002',
    name: 'متجر شيرين',
    category: 'fashion',
    owner: 'سالم'
  },
  {
    slug: 'delta-store',
    email: 'majed@gmail.com',
    password: 'majed123',
    phone: '218910000003',
    name: 'متجر دلتا',
    category: 'electronics',
    owner: 'ماجد'
  },
  {
    slug: 'pretty',
    email: 'kamel@gmail.com',
    password: 'kamel123',
    phone: '218910000004',
    name: 'متجر بريتي',
    category: 'beauty',
    owner: 'كامل'
  },
  {
    slug: 'magna-beauty',
    email: 'hasan@gmail.com',
    password: 'hasan123',
    phone: '218910000005',
    name: 'متجر ماجنا',
    category: 'beauty',
    owner: 'حسن'
  },
  {
    slug: 'indeesh',
    email: 'salem.masgher@gmail.com',
    password: 'salem1234',
    phone: '218910000006',
    name: 'متجر انديش',
    category: 'home-care',
    owner: 'سالم محمد الأشقر'
  }
];

const initializeStores = async () => {
  try {
    logger.info('🔄 Initializing models...');
    initializeModels();

    logger.info('🔗 Testing database connection...');
    await sequelize.authenticate();
    logger.info('✅ Database connection established');

    logger.info('📊 Syncing database schema...');
    await sequelize.sync({ force: false });
    logger.info('✅ Database schema synchronized');

    logger.info('👤 Creating merchant users...');
    const userMap = new Map<string, string>();

    for (const merchant of MERCHANTS) {
      const existingUser = await User.findOne({
        where: { email: merchant.email }
      });

      let userId: string;
      if (existingUser) {
        userId = existingUser.id;
        logger.info(`ℹ️ User already exists: ${merchant.email}`);
      } else {
        const user = await User.create({
          id: uuidv4(),
          email: merchant.email,
          password: merchant.password,
          firstName: merchant.owner.split(' ')[0],
          lastName: merchant.owner.split(' ').slice(1).join(' ') || merchant.owner,
          phone: merchant.phone,
          role: 'merchant',
          storeName: merchant.name,
          storeSlug: merchant.slug,
          storeCategory: merchant.category,
          merchantVerified: true
        } as any);
        userId = user.id;
        logger.info(`✅ Created user: ${merchant.email}`);
      }
      userMap.set(merchant.slug, userId);
    }

    logger.info('📝 Initializing stores...');
    for (const merchant of MERCHANTS) {
      const existing = await Store.findOne({
        where: { slug: merchant.slug }
      });

      if (!existing) {
        const merchantId = userMap.get(merchant.slug);
        if (!merchantId) {
          logger.error(`❌ No user ID found for merchant: ${merchant.slug}`);
          continue;
        }

        await Store.create({
          slug: merchant.slug,
          merchantId: merchantId,
          name: merchant.name,
          category: merchant.category,
          isActive: true
        });
        logger.info(`✅ Created store: ${merchant.slug}`);
      } else {
        logger.info(`ℹ️ Store already exists: ${merchant.slug} (ID: ${existing.id})`);
      }
    }

    logger.info('✅ Store initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error initializing stores:', error);
    process.exit(1);
  }
};

initializeStores();
