import dotenv from 'dotenv';
import sequelize from '@config/database';
import { initializeModels } from '@models/index';
import Store from '@models/Store';
import User from '@models/User';
import logger from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

interface StoreInput {
  slug: string;
  email: string;
  password: string;
  phone: string;
  name: string;
  nameAr: string;
  category: string;
  owner: string;
  description?: string;
  primaryColor?: string;
}

const addStore = async () => {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      logger.error('❌ Please provide store slug as argument');
      logger.info('Usage: npx ts-node scripts/add-store.ts <slug>');
      process.exit(1);
    }

    const storeSlug = args[0];
    
    logger.info(`🔄 Initializing models...`);
    initializeModels();

    logger.info(`🔗 Testing database connection...`);
    await sequelize.authenticate();
    logger.info(`✅ Database connection established`);

    logger.info(`📊 Syncing database schema...`);
    await sequelize.sync({ force: false });
    logger.info(`✅ Database schema synchronized`);

    logger.info(`👤 Creating merchant user for: ${storeSlug}...`);
    
    const existingStore = await Store.findOne({
      where: { slug: storeSlug }
    });

    if (existingStore) {
      logger.error(`❌ Store with slug "${storeSlug}" already exists!`);
      process.exit(1);
    }

    // Prompt for store details (simplified for automation)
    const storeData: StoreInput = {
      slug: storeSlug,
      email: `${storeSlug}@example.com`,
      password: `${storeSlug}123456`,
      phone: `21891000000${Math.floor(Math.random() * 10)}`,
      name: storeSlug,
      nameAr: storeSlug,
      category: 'general',
      owner: storeSlug,
      description: `متجر ${storeSlug}`,
      primaryColor: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    // Create user
    const userId = uuidv4();
    const user = await User.create({
      id: userId,
      email: storeData.email,
      password: storeData.password,
      firstName: storeData.owner.split(' ')[0],
      lastName: storeData.owner.split(' ').slice(1).join(' ') || storeData.owner,
      phone: storeData.phone,
      role: 'merchant',
      storeName: storeData.name,
      storeSlug: storeData.slug,
      storeCategory: storeData.category,
      merchantVerified: true
    } as any);
    logger.info(`✅ Created user: ${storeData.email} (ID: ${userId})`);

    // Create store
    const store = await Store.create({
      slug: storeData.slug,
      merchantId: userId,
      name: storeData.name,
      category: storeData.category,
      isActive: true
    });
    logger.info(`✅ Created store: ${storeData.slug} (ID: ${store.id})`);

    // Add to storeConfig.ts
    const configPath = path.join(process.cwd(), 'src/config/storeConfig.ts');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    const newStoreConfig = `,

  ${storeSlug}: {
    slug: '${storeSlug}',
    storeId: ${store.id},
    name: '${storeData.name}',
    description: '${storeData.description}',
    logo: '/assets/${storeSlug}/logo.webp',
    icon: '🏪',
    sliderHeight: {
      mobile: 500,
      desktop: 600,
    },
    colors: {
      primary: '${storeData.primaryColor}',
      secondary: '#6b7280',
      accent: '#f3f4f6',
    },
    sliders: [
      {
        id: 'banner1',
        image: '/assets/${storeSlug}/slide1.webp',
        title: '${storeData.nameAr}',
        subtitle: 'مرحباً بك في متجرنا',
        buttonText: 'تسوق الآن',
      },
    ],
    products: [],
  }`;

    // Find insertion point and add the new store config
    const searchStr = '  },\r\n};';
    if (configContent.includes(searchStr)) {
      configContent = configContent.replace(searchStr, newStoreConfig + ',\r\n  },\r\n};');
      fs.writeFileSync(configPath, configContent);
      logger.info(`✅ Added store configuration to storeConfig.ts`);
    } else {
      logger.warn(`⚠️ Could not automatically add store to storeConfig.ts`);
    }

    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`✅ Store created successfully!`);
    logger.info(`${'='.repeat(60)}`);
    logger.info(`Store Slug: ${storeData.slug}`);
    logger.info(`Store Name: ${storeData.name}`);
    logger.info(`Store Email: ${storeData.email}`);
    logger.info(`Store Password: ${storeData.password}`);
    logger.info(`Store ID: ${store.id}`);
    logger.info(`Merchant ID: ${userId}`);
    logger.info(`${'='.repeat(60)}`);

    process.exit(0);
  } catch (error) {
    logger.error('❌ Error adding store:', error);
    process.exit(1);
  }
};

addStore();