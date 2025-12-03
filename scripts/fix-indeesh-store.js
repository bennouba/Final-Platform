import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectRoot = process.cwd();
const frontendAssetsPath = path.join(projectRoot, 'public', 'assets', 'indeesh');
const backendAssetsPath = path.join(projectRoot, 'backend', 'public', 'assets', 'indeesh');
const storeJsonPath = path.join(backendAssetsPath, 'store.json');

console.log('🔧 Fixing indeesh store with real file names...\n');

// Read actual files from backend (source of truth)
console.log('📂 Reading actual files from backend directories...');
const productFiles = fs.readdirSync(path.join(backendAssetsPath, 'products'))
  .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));
const sliderFiles = fs.readdirSync(path.join(backendAssetsPath, 'sliders'))
  .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));
const logoFiles = fs.readdirSync(path.join(backendAssetsPath, 'logo'))
  .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));

console.log(`✅ Found ${productFiles.length} product images`);
console.log(`✅ Found ${sliderFiles.length} slider images`);
console.log(`✅ Found ${logoFiles.length} logo files\n`);

// Read current store.json
console.log('📝 Reading current store.json...');
const storeData = JSON.parse(fs.readFileSync(storeJsonPath, 'utf-8'));

// Smart image mapping based on original filenames
console.log('\n🔄 Smart mapping products to real filenames...');

const mapImagesToProducts = (products, files) => {
  // Create a map of base names to files
  const fileMap = new Map();

  files.forEach(file => {
    // Extract original name without extension and timestamp
    const originalName = file.toLowerCase().replace(/\.[^/.]+$/, ''); // Remove extension
    const cleanName = originalName.replace(/^\d+-[^-]+-/, ''); // Remove timestamp prefix

    // Handle variations like "alfa", "alfa1", "alfa2", etc.
    let baseName = cleanName;
    if (/\d+$/.test(cleanName)) {
      // If ends with number, remove it to get base name
      baseName = cleanName.replace(/\d+$/, '');
    }

    if (!fileMap.has(baseName)) {
      fileMap.set(baseName, []);
    }
    fileMap.get(baseName).push(file);
  });

  console.log('📊 File mapping created:', Array.from(fileMap.keys()));

  // Map products to their images
  return products.map(product => {
    const productName = product.name.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special chars
      .replace(/\s+/g, '') // Remove spaces
      .trim();

    console.log(`🔍 Processing product: "${product.name}" -> "${productName}"`);

    // Try different variations of the product name
    const possibleKeys = [
      productName,
      productName.replace(/مزيل|شامل|ملمع|زجاج|غسيل|منظف/g, ''), // Remove common words
      productName.substring(0, 4), // First 4 chars
      productName.substring(0, 3), // First 3 chars
    ];

    let matchedFiles = [];

    // Find files that match any of the possible keys
    for (const key of possibleKeys) {
      if (fileMap.has(key)) {
        matchedFiles = fileMap.get(key);
        fileMap.delete(key); // Remove to avoid reuse
        console.log(`  ✅ Matched with key: "${key}" (${matchedFiles.length} files)`);
        break;
      }
    }

    // If no direct match, try fuzzy matching
    if (matchedFiles.length === 0) {
      for (const [key, files] of fileMap.entries()) {
        if (productName.includes(key) || key.includes(productName.substring(0, 3))) {
          matchedFiles = files;
          fileMap.delete(key);
          console.log(`  🔄 Fuzzy matched with key: "${key}" (${matchedFiles.length} files)`);
          break;
        }
      }
    }

    if (matchedFiles.length === 0) {
      console.log(`  ❌ No files matched for product: "${product.name}"`);
    }

    const images = matchedFiles
      .sort((a, b) => {
        // Sort by filename to maintain order
        return a.toLowerCase().localeCompare(b.toLowerCase());
      })
      .map(f => `/assets/indeesh/products/${f}`);

    return {
      ...product,
      images: images.length > 0 ? images : product.images
    };
  });
};

storeData.products = mapImagesToProducts(storeData.products, productFiles);

// Update slider images
console.log('🔄 Mapping sliders to real filenames...');
storeData.sliderImages = storeData.sliderImages.slice(0, sliderFiles.length).map((slider, idx) => ({
  ...slider,
  image: `/assets/indeesh/sliders/${sliderFiles[idx]}`
}));

// Update logo
if (logoFiles.length > 0) {
  storeData.logo = `/assets/indeesh/logo/${logoFiles[0]}`;
}

// Write updated store.json to both locations
console.log('\n💾 Writing updated store.json...');
fs.writeFileSync(storeJsonPath, JSON.stringify(storeData, null, 2), 'utf-8');
fs.writeFileSync(path.join(frontendAssetsPath, 'store.json'), JSON.stringify(storeData, null, 2), 'utf-8');
console.log('✅ store.json updated in both locations');

// Sync all files from backend to frontend
console.log('\n📡 Syncing all files from backend to frontend...');
const syncDir = async (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source directory not found: ${src}`);
    return;
  }

  await fs.promises.mkdir(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await syncDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      const stats = fs.statSync(srcPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`  ✅ ${entry.name} (${sizeMB} MB)`);
    }
  }
};

// Sync products
console.log('  📦 Syncing products...');
await syncDir(path.join(backendAssetsPath, 'products'), path.join(frontendAssetsPath, 'products'));

// Sync sliders
console.log('  📦 Syncing sliders...');
await syncDir(path.join(backendAssetsPath, 'sliders'), path.join(frontendAssetsPath, 'sliders'));

// Sync logo
console.log('  📦 Syncing logo...');
await syncDir(path.join(backendAssetsPath, 'logo'), path.join(frontendAssetsPath, 'logo'));

console.log('✅ All files synced from backend to frontend');

// Update products.ts
console.log('\n📝 Generating new products.ts...');
const storeId = storeData.storeId;
const productsContent = `import type { Product } from '../../storeProducts';

export const indeeshProducts: Product[] = [
${storeData.products.map(product => `  {
    id: ${product.id},
    storeId: ${storeId},
    name: "${product.name.replace(/"/g, '\\"')}",
    description: "${product.description.replace(/"/g, '\\"')}",
    price: ${product.price},
    originalPrice: ${product.originalPrice},
    images: [${product.images.map(img => `"${img}"`).join(', ')}],
    sizes: [${(product.sizes || ['واحد']).map(s => `"${s}"`).join(', ')}],
    availableSizes: [${(product.availableSizes || product.sizes || ['واحد']).map(s => `"${s}"`).join(', ')}],
    colors: [
      ${(product.colors || [{ name: 'أسود', value: '#000000' }]).map(c => `{ name: "${c.name}", value: "${c.value}" }`).join(',\n      ')}
    ],
    rating: ${product.rating || 4.5},
    reviews: ${product.reviews || 0},
    views: 0,
    likes: 0,
    orders: 0,
    category: "${product.category}",
    inStock: ${product.inStock !== undefined ? product.inStock : true},
    isAvailable: ${product.isAvailable !== undefined ? product.isAvailable : true},
    tags: [${(product.tags || ['جديد']).map(tag => `"${tag}"`).join(', ')}],
    badge: "${product.tags && product.tags[0] ? product.tags[0] : 'جديد'}",
    quantity: ${product.quantity ?? 0},
    expiryDate: "${product.expiryDate || ''}",
    endDate: "${product.endDate || ''}"
  }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(projectRoot, 'src', 'data', 'stores', 'indeesh', 'products.ts'), productsContent, 'utf-8');
console.log('✅ products.ts generated');

// Update sliderData.ts
console.log('📝 Generating new sliderData.ts...');
const sliderDataContent = `export const indeeshSliderData = [
${storeData.sliderImages.map(slider => `  {
    id: '${slider.id}',
    image: '${slider.image}',
    title: '${slider.title.replace(/'/g, "\\'")}',
    subtitle: '${slider.subtitle.replace(/'/g, "\\'")}',
    buttonText: '${slider.buttonText}'
  }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(projectRoot, 'src', 'data', 'stores', 'indeesh', 'sliderData.ts'), sliderDataContent, 'utf-8');
console.log('✅ sliderData.ts generated');

console.log('\n✨ ✅ All files fixed and regenerated successfully!');
console.log('\n📊 Summary:');
console.log(`  📦 Products: ${storeData.products.length}`);
console.log(`  🖼️  Images per product: ${Math.ceil(productFiles.length / storeData.products.length)}`);
console.log(`  📺 Sliders: ${storeData.sliderImages.length}`);
console.log(`  🏷️  Logo: ${logoFiles[0] || 'Not found'}`);
