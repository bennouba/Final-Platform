import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

const projectRoot = process.cwd();
const srcPath = path.join(projectRoot, 'src/data/stores');
const publicAssetsPath = path.join(projectRoot, 'public/assets');
const storesDir = path.join(publicAssetsPath, 'stores');
const indexPath = path.join(storesDir, 'index.json');

interface StoreConfig {
  storeId?: number;
  icon?: string;
  logo?: string;
  color?: string;
  name?: string;
  description?: string;
  categories?: string[];
}

interface StoreIndex {
  slug: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  description?: string;
  logo?: string;
  categories?: string[];
  productsCount?: number;
  lastUpdated?: string;
}

async function getStoreConfig(storeSlug: string): Promise<StoreConfig | null> {
  const configPath = path.join(srcPath, storeSlug, 'config.ts');
  if (!fs.existsSync(configPath)) {
    return null;
  }

  const content = fs.readFileSync(configPath, 'utf-8');
  const storeIdMatch = content.match(/storeId:\s*(\d+)/);
  const iconMatch = content.match(/icon:\s*"([^"]*)"/);
  const logoMatch = content.match(/logo:\s*"([^"]*)"/);
  const colorMatch = content.match(/color:\s*"([^"]*)"/);
  const nameMatch = content.match(/name:\s*"([^"]*)"/);
  const descriptionMatch = content.match(/description:\s*"([^"]*)"/);
  const categoriesMatch = content.match(/categories:\s*\[([\s\S]*?)\]/);

  const categories: string[] = [];
  if (categoriesMatch && categoriesMatch[1]) {
    const catStr = categoriesMatch[1];
    const matches = catStr.match(/"([^"]*)"/g);
    if (matches) {
      matches.forEach(m => {
        categories.push(m.replace(/"/g, ''));
      });
    }
  }

  const config: StoreConfig = {};
  
  if (storeIdMatch && storeIdMatch[1]) {
    config.storeId = parseInt(storeIdMatch[1], 10);
  }
  if (iconMatch && iconMatch[1]) {
    config.icon = iconMatch[1];
  }
  if (logoMatch && logoMatch[1]) {
    config.logo = logoMatch[1];
  }
  if (colorMatch && colorMatch[1]) {
    config.color = colorMatch[1];
  }
  if (nameMatch && nameMatch[1]) {
    config.name = nameMatch[1];
  }
  if (descriptionMatch && descriptionMatch[1]) {
    config.description = descriptionMatch[1];
  }
  if (categories.length > 0) {
    config.categories = categories;
  }
  
  return config;
}

async function getProductsCount(storeSlug: string): Promise<number> {
  const productsPath = path.join(srcPath, storeSlug, 'products.ts');
  if (!fs.existsSync(productsPath)) {
    return 0;
  }

  const content = fs.readFileSync(productsPath, 'utf-8');
  const matches = content.match(/id:\s*(\d+)/g);
  return matches ? matches.length : 0;
}

async function verifyAndFixStores() {
  console.log('🔍 Starting store verification and repair...\n');

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source stores directory not found: ${srcPath}`);
    return;
  }

  const storeSlugDirs = fs.readdirSync(srcPath).filter(name => {
    const fullPath = path.join(srcPath, name);
    return fs.statSync(fullPath).isDirectory() && name !== 'shared';
  });

  console.log(`📚 Found ${storeSlugDirs.length} stores in src/data/stores/:\n`);
  storeSlugDirs.forEach(slug => console.log(`  - ${slug}`));
  console.log('');

  let indexData: StoreIndex[] = [];

  if (fs.existsSync(indexPath)) {
    try {
      const existingIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      if (Array.isArray(existingIndex)) {
        indexData = existingIndex;
        console.log(`✅ Loaded existing index.json with ${indexData.length} stores\n`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not parse existing index.json, starting fresh\n`);
    }
  }

  const updatedIndexData: StoreIndex[] = [];
  let storesCreated = 0;
  let storesUpdated = 0;
  let storesSkipped = 0;

  for (const slug of storeSlugDirs) {
    console.log(`\n📦 Processing store: ${slug}`);
    console.log('─'.repeat(50));

    const config = await getStoreConfig(slug);
    if (!config) {
      console.warn(`⚠️ Could not read config for ${slug}, skipping...`);
      storesSkipped++;
      continue;
    }

    const productsCount = await getProductsCount(slug);
    const storeAssetDir = path.join(publicAssetsPath, slug);
    const storeJsonPath = path.join(storeAssetDir, 'store.json');

    console.log(`  Name: ${config.name}`);
    console.log(`  Icon: ${config.icon}`);
    console.log(`  Logo: ${config.logo}`);
    console.log(`  Description: ${config.description}`);
    console.log(`  Products: ${productsCount}`);
    console.log(`  Categories: ${config.categories?.join(', ') || 'None'}`);

    const storeEntry: StoreIndex = {
      slug,
      name: config.name || slug,
      nameAr: config.name || slug,
      nameEn: config.name || slug,
      description: config.description || '',
      ...(config.logo && { logo: config.logo }),
      categories: config.categories || [],
      productsCount: productsCount,
      lastUpdated: new Date().toISOString()
    };

    const existingEntry = indexData.findIndex(s => s.slug === slug);
    if (existingEntry >= 0) {
      console.log(`  🔄 Updating existing entry in index...`);
      storesUpdated++;
    } else {
      console.log(`  ➕ Adding new entry to index...`);
      storesCreated++;
    }

    updatedIndexData.push(storeEntry);

    const storeJsonExists = fs.existsSync(storeJsonPath);
    if (storeJsonExists) {
      console.log(`  ✅ store.json exists`);
    } else {
      console.log(`  ⚠️ store.json missing - will be created on next store update`);
    }
  }

  console.log('\n\n' + '='.repeat(50));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total stores found: ${storeSlugDirs.length}`);
  console.log(`Stores created: ${storesCreated}`);
  console.log(`Stores updated: ${storesUpdated}`);
  console.log(`Stores skipped: ${storesSkipped}`);

  if (updatedIndexData.length > 0) {
    try {
      await fsPromises.mkdir(storesDir, { recursive: true });
      await fsPromises.writeFile(
        indexPath,
        JSON.stringify(updatedIndexData, null, 2),
        'utf-8'
      );
      console.log(`\n✅ Updated index.json with ${updatedIndexData.length} stores`);
      console.log(`   Location: ${indexPath}`);
    } catch (error) {
      console.error(`❌ Failed to write index.json:`, error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Verification and repair complete!');
  console.log('='.repeat(50));
}

verifyAndFixStores().catch(error => {
  console.error('❌ Error during verification:', error);
  process.exit(1);
});
