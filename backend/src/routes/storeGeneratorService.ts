import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import logger from '@utils/logger';

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  colors: Array<{ name: string; value?: string }>;
  sizes: string[];
  availableSizes: string[];
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  tags: string[];
}

interface SliderImage {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

interface StoreGeneratorData {
  storeId: number;
  storeSlug: string;
  storeName: string;
  storeNameEn: string;
  description: string;
  icon: string;
  color: string;
  logo?: string;
  categories: string[];
  products: ProductData[];
  sliderImages: SliderImage[];
}

export class StoreGeneratorService {
  private frontendStoresPath: string;
  private publicAssetsPath: string;
  private backendPublicPath: string;
  private baseProjectDir: string;
  private frontendPublicAssetsPath: string;

  constructor() {
    let dynamicBase = process.cwd();
    
    if (dynamicBase.endsWith('backend')) {
      dynamicBase = path.join(dynamicBase, '..');
    }
    
    this.baseProjectDir = process.env.STORE_BASE_DIR || dynamicBase;
    
    this.frontendStoresPath = path.join(this.baseProjectDir, 'src', 'data', 'stores');
    this.backendPublicPath = path.join(this.baseProjectDir, 'backend', 'public');
    this.publicAssetsPath = path.join(this.backendPublicPath, 'assets');
    this.frontendPublicAssetsPath = path.join(this.baseProjectDir, 'public', 'assets');
    
    logger.info(`🔧 Store Generator configured:`);
    logger.info(`   Base Path: ${this.baseProjectDir}`);
    logger.info(`   Frontend Stores: ${this.frontendStoresPath}`);
    logger.info(`   Backend Public: ${this.backendPublicPath}`);
    logger.info(`   Assets Path: ${this.publicAssetsPath}`);
    logger.info(`   Frontend Assets Path: ${this.frontendPublicAssetsPath}`);
  }

  async generateStoreFiles(data: StoreGeneratorData): Promise<void> {
    try {
      logger.info(`\n🚀 Starting store file generation for: ${data.storeName} (slug: ${data.storeSlug})`);
      
      // Generate TS files for development
      const storeDir = path.join(this.frontendStoresPath, data.storeSlug);
      await fsPromises.mkdir(storeDir, { recursive: true });
      logger.info(`  📁 Created TS directory: ${storeDir}`);

      await this.generateConfigFile(storeDir, data);
      logger.info(`    ✅ config.ts`);
      
      await this.generateProductsFile(storeDir, data);
      logger.info(`    ✅ products.ts (${data.products.length} products)`);
      
      await this.generateSliderFile(storeDir, data);
      logger.info(`    ✅ Slider.tsx`);
      
      await this.generateIndexFile(storeDir, data);
      logger.info(`    ✅ index.ts`);
      
      await this.generateSliderDataFile(storeDir, data);
      logger.info(`    ✅ sliderData.ts (${data.sliderImages.length} sliders)`);
      
      logger.info(`  ✅ TS files generated for development`);

      // Ensure asset directories exist
      logger.info(`  📦 Setting up asset directories...`);
      await this.ensureAssetDirectories(data.storeSlug);

      // Generate JSON files for production
      logger.info(`  📦 Generating JSON files for permanent storage...`);
      await this.generateJSONFiles(data);
      logger.info(`  ✅ JSON files generated for production`);

      // Sync assets to frontend
      logger.info(`  📡 Syncing assets to frontend...`);
      await this.syncAssetsToFrontend(data.storeSlug);
      logger.info(`  ✅ Assets synced to frontend`);

      // Copy logo to brands directory
      logger.info(`  🏷️  Copying logo to brands directory...`);
      await this.copyLogoToBrands(data.storeSlug, data.logo || '');
      logger.info(`  ✅ Logo copied to brands`);

      logger.info(`\n🎉 Store generation COMPLETED successfully for: ${data.storeName}\n`);
    } catch (error) {
      logger.error(`\n🚨 Error generating store files for ${data.storeName}:`, error);
      throw error;
    }
  }

  private async ensureAssetDirectories(storeSlug: string): Promise<void> {
    const backendBaseDir = path.join(this.publicAssetsPath, storeSlug);
    const frontendBaseDir = path.join(this.frontendPublicAssetsPath, storeSlug);
    const brandsDir = path.join(this.frontendPublicAssetsPath, 'brands');
    
    const dirs = [
      path.join(backendBaseDir, 'products'),
      path.join(backendBaseDir, 'sliders'),
      path.join(backendBaseDir, 'logo'),
      path.join(frontendBaseDir, 'products'),
      path.join(frontendBaseDir, 'sliders'),
      path.join(frontendBaseDir, 'logo'),
      path.join(this.publicAssetsPath, 'stores'),
      path.join(this.frontendPublicAssetsPath, 'stores'),
      brandsDir
    ];

    logger.info(`    📁 Creating asset directories for: ${storeSlug}`);
    for (const dir of dirs) {
      try {
        await fsPromises.mkdir(dir, { recursive: true });
        logger.info(`      ✅ ${path.relative(this.baseProjectDir, dir)}`);
      } catch (error) {
        logger.error(`      ❌ Failed to create ${dir}:`, error);
        throw error;
      }
    }
    logger.info(`    ✅ All asset directories created successfully`);
  }

  private async syncAssetsToFrontend(storeSlug: string): Promise<void> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const sourceStoreDir = path.join(this.publicAssetsPath, storeSlug);
        const destStoreDir = path.join(this.frontendPublicAssetsPath, storeSlug);

        logger.info(`\n   🔄 Final sync verification (Attempt ${attempt}/${maxRetries})...`);
        logger.info(`      📁 Backend: ${sourceStoreDir}`);
        logger.info(`      📁 Frontend: ${destStoreDir}`);

        if (!fs.existsSync(sourceStoreDir)) {
          logger.warn(`      ⚠️  Backend directory not found, files may have been moved already`);
          if (fs.existsSync(destStoreDir)) {
            logger.info(`      ✅ Frontend directory exists - sync may be complete`);
            return;
          }
          throw new Error(`Source directory not found: ${sourceStoreDir}`);
        }

        await fsPromises.mkdir(destStoreDir, { recursive: true });
        logger.info(`      ✅ Frontend directory ready`);

        const verifyAndCopyDir = async (src: string, dest: string, level: number = 0): Promise<{ dirCount: number; fileCount: number; failedFiles: string[]; alreadyExist: number }> => {
          const indent = '         '.repeat(level);
          
          if (!fs.existsSync(src)) {
            logger.warn(`      ${indent}⚠️  Source not found: ${src}`);
            return { dirCount: 0, fileCount: 0, failedFiles: [], alreadyExist: 0 };
          }
          
          const entries = await fsPromises.readdir(src, { withFileTypes: true });

          let dirCount = 0;
          let fileCount = 0;
          let failedFiles: string[] = [];
          let alreadyExist = 0;

          for (const entry of entries) {
            try {
              const srcPath = path.join(src, entry.name);
              const destPath = path.join(dest, entry.name);

              if (entry.isDirectory()) {
                dirCount++;
                await fsPromises.mkdir(destPath, { recursive: true });
                logger.info(`      ${indent}📁 ${entry.name}/`);
                const subResult = await verifyAndCopyDir(srcPath, destPath, level + 1);
                failedFiles = [...failedFiles, ...subResult.failedFiles];
                alreadyExist += subResult.alreadyExist;
              } else {
                fileCount++;
                
                if (fs.existsSync(destPath)) {
                  const srcStats = await fsPromises.stat(srcPath);
                  const destStats = await fsPromises.stat(destPath);
                  if (srcStats.size === destStats.size) {
                    alreadyExist++;
                    logger.info(`      ${indent}✅ ${entry.name} (already synced)`);
                    continue;
                  }
                }
                
                const stats = await fsPromises.stat(srcPath);
                const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                
                try {
                  await fsPromises.copyFile(srcPath, destPath);
                  logger.info(`      ${indent}✅ ${entry.name} (${sizeMB} MB)`);
                } catch (fileError) {
                  failedFiles.push(entry.name);
                  logger.warn(`      ${indent}⚠️  Failed to copy ${entry.name}: ${(fileError as Error).message}`);
                }
              }
            } catch (entryError) {
              logger.warn(`      ${indent}⚠️  Error processing ${entry.name}: ${(entryError as Error).message}`);
            }
          }

          if (level === 0) {
            logger.info(`\n      📊 Final sync summary:`);
            logger.info(`         📁 Directories: ${dirCount}`);
            logger.info(`         📄 Files copied: ${fileCount - alreadyExist}`);
            logger.info(`         ✅ Files already synced: ${alreadyExist}`);
            if (failedFiles.length > 0) {
              logger.warn(`         ⚠️  Failed files: ${failedFiles.join(', ')}`);
            }
            logger.info('');
          }

          return { dirCount, fileCount, failedFiles, alreadyExist };
        };

        const result = await verifyAndCopyDir(sourceStoreDir, destStoreDir);
        
        if (result.failedFiles.length > 0) {
          throw new Error(`Failed to copy ${result.failedFiles.length} file(s): ${result.failedFiles.join(', ')}`);
        }

        const sourceStoresDir = path.join(this.publicAssetsPath, 'stores');
        const destStoresDir = path.join(this.frontendPublicAssetsPath, 'stores');

        logger.info(`      📂 Syncing stores index...`);
        if (fs.existsSync(sourceStoresDir)) {
          await fsPromises.mkdir(destStoresDir, { recursive: true });
          const storeFiles = await fsPromises.readdir(sourceStoresDir);

          let indexFilesSynced = 0;
          const indexFilesFailed: string[] = [];
          
          for (const file of storeFiles) {
            try {
              const srcPath = path.join(sourceStoresDir, file);
              const destPath = path.join(destStoresDir, file);
              const stat = await fsPromises.stat(srcPath);

              if (stat.isFile()) {
                await fsPromises.copyFile(srcPath, destPath);
                logger.info(`         ✅ ${file}`);
                indexFilesSynced++;
              }
            } catch (indexError) {
              indexFilesFailed.push(file);
              logger.warn(`         ⚠️  Failed to sync ${file}: ${(indexError as Error).message}`);
            }
          }
          
          logger.info(`      ✅ Synced ${indexFilesSynced} index files to stores/`);
          if (indexFilesFailed.length > 0) {
            throw new Error(`Failed to sync index files: ${indexFilesFailed.join(', ')}`);
          }
          logger.info('');
        } else {
          throw new Error(`Stores directory not found: ${sourceStoresDir}`);
        }

        logger.info(`   ✨ Asset sync completed successfully!\n`);
        return;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`   ⚠️  Sync attempt ${attempt} failed: ${lastError.message}`);
        
        if (attempt < maxRetries) {
          logger.info(`   ⏳ Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    logger.error(`\n   ❌ Asset sync failed after ${maxRetries} attempts:`, lastError);
    throw lastError || new Error('Asset sync failed: Unknown error');
  }

  private async copyLogoToBrands(storeSlug: string, logoPath: string): Promise<void> {
    try {
      if (!logoPath || logoPath === '/assets/default-store.png') {
        logger.info(`      ℹ️  No custom logo to copy to brands (using default)`);
        return;
      }

      const logoFilename = path.basename(logoPath);
      
      const backendLogoDir = path.join(this.publicAssetsPath, storeSlug, 'logo');
      const frontendLogoDir = path.join(this.frontendPublicAssetsPath, storeSlug, 'logo');
      const brandsDir = path.join(this.frontendPublicAssetsPath, 'brands');
      
      await fsPromises.mkdir(brandsDir, { recursive: true });
      
      let logoSourcePath = path.join(frontendLogoDir, logoFilename);
      
      if (!fs.existsSync(logoSourcePath)) {
        logoSourcePath = path.join(backendLogoDir, logoFilename);
      }
      
      if (!fs.existsSync(logoSourcePath)) {
        logger.warn(`      ⚠️  Logo file not found at: ${logoSourcePath}`);
        
        const frontendFiles = fs.existsSync(frontendLogoDir) ? fs.readdirSync(frontendLogoDir) : [];
        const backendFiles = fs.existsSync(backendLogoDir) ? fs.readdirSync(backendLogoDir) : [];
        
        if (frontendFiles.length > 0) {
          logoSourcePath = path.join(frontendLogoDir, frontendFiles[0]);
          logger.info(`      ℹ️  Using first frontend logo: ${frontendFiles[0]}`);
        } else if (backendFiles.length > 0) {
          logoSourcePath = path.join(backendLogoDir, backendFiles[0]);
          logger.info(`      ℹ️  Using first backend logo: ${backendFiles[0]}`);
        } else {
          logger.warn(`      ⚠️  No logo files found in logo directories`);
          return;
        }
      }
      
      const finalLogoFilename = path.basename(logoSourcePath);
      const brandLogoPath = path.join(brandsDir, finalLogoFilename);
      
      await fsPromises.copyFile(logoSourcePath, brandLogoPath);
      logger.info(`      ✅ Logo copied to brands: ${finalLogoFilename}`);
      
    } catch (error) {
      logger.error(`      ❌ Failed to copy logo to brands:`, error);
    }
  }

  private async generateConfigFile(
    storeDir: string,
    data: StoreGeneratorData
  ): Promise<void> {
    const configContent = `export const ${data.storeSlug.replace(/-/g, '')}StoreConfig = {
  storeId: ${data.storeId},
  icon: "${data.icon}",
  logo: "${data.logo || `/assets/stores/${data.storeSlug}.webp`}",
  color: "${data.color}",
  name: "${data.storeName}",
  description: "${data.description}",
  categories: [
    ${data.categories.map(c => `"${c}"`).join(',\n    ')}
  ]
};
`;

    const configPath = path.join(storeDir, 'config.ts');
    await fsPromises.writeFile(configPath, configContent, 'utf-8');
  }

  private async generateProductsFile(
    storeDir: string,
    data: StoreGeneratorData
  ): Promise<void> {
    const productsContent = `import type { Product } from '../types/product';

export const ${data.storeSlug.replace(/-/g, '')}Products: Product[] = [
${data.products
  .map(
    (product) => {
      let images = product.images && product.images.length > 0 
        ? product.images 
        : ['/assets/default-product.png'];
      
      images = images.filter(img => img && img.trim());
      if (images.length === 0) {
        images = ['/assets/default-product.png'];
      }
      
      const colors = product.colors && product.colors.length > 0
        ? product.colors
        : [{ name: 'أسود', value: '#000000' }];

      const sizes = product.sizes && product.sizes.length > 0
        ? product.sizes
        : ['واحد'];

      const availableSizes = product.availableSizes && product.availableSizes.length > 0
        ? product.availableSizes
        : (sizes && sizes.length > 0 ? sizes : ['واحد']);

      return `  {
    id: ${product.id},
    storeId: ${data.storeId},
    name: "${this.escapeString(product.name)}",
    description: "${this.escapeString(product.description)}",
    price: ${product.price},
    originalPrice: ${product.originalPrice},
    images: [${images.map(img => `"${img}"`).join(', ')}],
    sizes: [${sizes.map(size => `"${size}"`).join(', ')}],
    availableSizes: [${availableSizes.map(size => `"${size}"`).join(', ')}],
    colors: [
      ${colors
        .map(
          (color) =>
            `{ name: "${this.escapeString(color.name)}", value: "${color.value || '#000000'}" }`
        )
        .join(',\n      ')}
    ],
    rating: ${product.rating || 4.5},
    reviews: ${product.reviews || 0},
    views: 0,
    likes: 0,
    orders: 0,
    category: "${this.escapeString(product.category || 'عام')}",
    inStock: ${product.inStock !== undefined ? product.inStock : true},
    isAvailable: ${product.inStock !== undefined ? product.inStock : true},
    tags: [${(product.tags || ['جديد']).map(tag => `"${tag}"`).join(', ')}],
    badge: "${product.tags && product.tags[0] ? product.tags[0] : 'جديد'}"
  }`;
    }
  )
  .join(',\n')}
];
`;

    const productsPath = path.join(storeDir, 'products.ts');
    await fsPromises.writeFile(productsPath, productsContent, 'utf-8');
  }

  private async generateSliderFile(
    storeDir: string,
    data: StoreGeneratorData
  ): Promise<void> {
    const sliderComponentName = data.storeSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const colors = data.color.split(' to ');
    const colorStart = colors[0].replace('from-', '');
    const colorEnd = colors[1] ? colors[1] : colorStart;

    const sliderContent = `import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Star,
  Crown,
  Sparkles,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';
import type { Product } from '../types/product';

interface ${sliderComponentName}SliderProps {
  products: Product[];
  storeSlug?: string;
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  favorites: number[];
}

const ${sliderComponentName}Slider: React.FC<${sliderComponentName}SliderProps> = ({
  products,
  storeSlug = '${data.storeSlug}',
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favorites = []
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  
  const getSliderBanners = () => {
    return [
${data.sliderImages
  .map(
    (img) => `      {
        id: '${img.id}',
        image: '${this.escapeString(img.image)}',
        title: '${this.escapeString(img.title)}',
        subtitle: '${this.escapeString(img.subtitle)}',
        buttonText: '${this.escapeString(img.buttonText)}'
      }`
  )
  .join(',\n')}
    ];
  };

  const sliderBanners = getSliderBanners();
  const allSlides = sliderBanners;

  const getBackgroundImage = (image: string) => {
    if (!image) return undefined;
    try {
      return \\\`url("\\\${encodeURI(image)}")\\\`;
    } catch (error) {
      return \\\`url("\\\${image}")\\\`;
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || allSlides.length <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % allSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allSlides.length, isDragging]);

  const nextSlide = () => {
    setActiveSlide(prev => (prev + 1) % allSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev - 1 + allSlides.length) % allSlides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (allSlides.length === 0) return null;

  const storeColors = {
    background: 'from-${colorStart}-50 via-${colorEnd}-50 to-${colorStart}-50',
    accent: 'from-${colorStart}-400 via-${colorEnd}-400 to-${colorStart}-400',
    gradient: 'from-${colorStart}-500 to-${colorEnd}-600',
    button: 'from-${colorStart}-500 to-${colorEnd}-600 hover:from-${colorStart}-600 hover:to-${colorEnd}-700'
  };

  return (
    <div className={\`relative h-[600px] md:h-[800px] overflow-hidden bg-gradient-to-br \${storeColors.background}\`}>
      <div className="absolute inset-0 z-0">
        <div className={\`absolute inset-0 bg-gradient-to-r \${storeColors.accent}/20 via-current/10 to-current/20\`}></div>
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: \`\${Math.random() * 100}%\`,
                top: \`\${Math.random() * 100}%\`,
                animationDelay: \`\${Math.random() * 5}s\`,
                animationDuration: \`\${2 + Math.random() * 2}s\`
              }}
            >
              <Sparkles className="h-4 w-4 text-purple-400/40" />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={sliderRef}
        className="relative h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setIsAutoPlaying(true);
          }
        }}
      >
        <div className="relative h-full w-full z-10">
          {allSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={\`absolute inset-0 transition-opacity duration-1000 ease-in-out \${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }\`}
              style={{
                filter: isDragging ? 'brightness(0.9)' : 'brightness(1)'
              }}
            >
              <div
                className="w-full h-full bg-center bg-cover rounded-lg"
                style={{ backgroundImage: getBackgroundImage(slide.image) }}
              />
            </div>
          ))}
        </div>
      </div>

      {allSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-purple-200 hover:border-purple-400"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-700 group-hover:text-purple-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-purple-200 hover:border-purple-400"
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-gray-700 group-hover:text-purple-600" />
          </button>
        </>
      )}

      {allSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={\`transition-all duration-300 rounded-full \${
                index === activeSlide 
                  ? 'w-10 h-3 bg-gradient-to-r from-purple-400 to-pink-500' 
                  : 'w-3 h-3 bg-white/60 hover:bg-white/80'
              }\`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-4 left-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={\`p-2 rounded-full backdrop-blur-sm border transition-all duration-300 \${
            isAutoPlaying 
              ? 'bg-green-500/90 border-green-300 text-white' 
              : 'bg-white/90 border-gray-300 text-gray-600'
          }\`}
        >
          {isAutoPlaying ? (
            <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
          ) : (
            <div className="h-3 w-3 bg-gray-400 rounded-full" />
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-5000 ease-linear"
          style={{
            width: isAutoPlaying ? '100%' : '0%',
            animationDuration: '5s',
            animation: isAutoPlaying ? 'progress 5s linear infinite' : 'none'
          }}
        />
      </div>

      <style>{\`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      \`}</style>
    </div>
  );
};

export default ${sliderComponentName}Slider;
`;

    const sliderPath = path.join(storeDir, 'Slider.tsx');
    await fsPromises.writeFile(sliderPath, sliderContent, 'utf-8');
  }

  private async generateIndexFile(
    storeDir: string,
    data: StoreGeneratorData
  ): Promise<void> {
    const storeSlugClean = data.storeSlug.replace(/-/g, '');
    const sliderComponentName = data.storeSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    const indexContent = `// ${data.storeName} Store - متجر ${data.storeName}
export { ${storeSlugClean}Products as products } from './products';
export { ${storeSlugClean}StoreConfig as config } from './config';
export { ${storeSlugClean}SliderData as sliderData } from './sliderData';
export * from './Slider';
`;

    const indexPath = path.join(storeDir, 'index.ts');
    await fsPromises.writeFile(indexPath, indexContent, 'utf-8');
  }

  private async generateSliderDataFile(
    storeDir: string,
    data: StoreGeneratorData
  ): Promise<void> {
    const sliderDataContent = `export const ${data.storeSlug.replace(/-/g, '')}SliderData = [
${data.sliderImages
  .map(
    (img) => `  {
    id: '${img.id}',
    image: '${this.escapeString(img.image)}',
    title: '${this.escapeString(img.title)}',
    subtitle: '${this.escapeString(img.subtitle)}',
    buttonText: '${this.escapeString(img.buttonText)}'
  }`
  )
  .join(',\n')}
];
`;

    const sliderDataPath = path.join(storeDir, 'sliderData.ts');
    await fsPromises.writeFile(sliderDataPath, sliderDataContent, 'utf-8');
  }

  private escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  private async generateJSONFiles(data: StoreGeneratorData): Promise<void> {
    logger.info(`\n  📝 Generating permanent JSON files...`);
    
    // Create store directory in public/assets
    const storeAssetsDir = path.join(this.publicAssetsPath, data.storeSlug);
    
    try {
      await fsPromises.mkdir(storeAssetsDir, { recursive: true });
      logger.info(`    📁 Asset directory: ${path.relative(this.baseProjectDir, storeAssetsDir)}`);
    } catch (error) {
      logger.error(`    ❌ Failed to create asset directory: ${error}`);
      throw error;
    }

    // Normalize logo path
    const logoPath = data.logo || '/assets/default-store.png';
    
    const normalizedProducts = data.products.map(product => {
      let images = (product.images || [])
        .filter(img => img && img.trim())
        .map(img => img.startsWith('/') ? img : `/${img}`);
      
      if (images.length === 0) {
        images = ['/assets/default-product.png'];
      }

      const colors = (product.colors && product.colors.length > 0)
        ? product.colors
        : [{ name: 'أسود', value: '#000000' }];

      const sizes = (product.sizes && product.sizes.length > 0)
        ? product.sizes
        : ['واحد'];

      const availableSizes = (product.availableSizes && product.availableSizes.length > 0)
        ? product.availableSizes
        : sizes;

      return {
        ...product,
        images,
        sizes,
        availableSizes,
        colors,
        inStock: product.inStock !== undefined ? product.inStock : true,
        isAvailable: product.inStock !== undefined ? product.inStock : true
      };
    });

    // Normalize slider images  
    const normalizedSliders = data.sliderImages.map(slider => ({
      ...slider,
      image: (slider.image && slider.image.trim()) 
        ? (slider.image.startsWith('/') ? slider.image : `/${slider.image}`)
        : '/assets/default-slider.png'
    }));

    // Generate store.json
    const storeData = {
      id: data.storeId,
      storeId: data.storeId,
      slug: data.storeSlug,
      name: data.storeName,
      subdomain: data.storeSlug,
      storeSlug: data.storeSlug,
      nameAr: data.storeName,
      nameEn: data.storeNameEn,
      description: data.description,
      icon: data.icon,
      color: data.color,
      logo: logoPath,
      categories: data.categories,
      products: normalizedProducts,
      sliderImages: normalizedSliders,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const backendStoreJsonPath = path.join(storeAssetsDir, 'store.json');
    const frontendStoreAssetsDir = path.join(this.frontendPublicAssetsPath, data.storeSlug);
    const frontendStoreJsonPath = path.join(frontendStoreAssetsDir, 'store.json');
    
    try {
      await fsPromises.mkdir(frontendStoreAssetsDir, { recursive: true });
      
      const jsonContent = JSON.stringify(storeData, null, 2);
      
      await fsPromises.writeFile(backendStoreJsonPath, jsonContent, 'utf-8');
      logger.info(`    ✅ Backend store.json created (${normalizedProducts.length} products, ${normalizedSliders.length} sliders)`);
      
      await fsPromises.writeFile(frontendStoreJsonPath, jsonContent, 'utf-8');
      logger.info(`    ✅ Frontend store.json created`);
    } catch (error) {
      logger.error(`    ❌ Failed to write store.json: ${error}`);
      throw error;
    }

    try {
      await this.updateStoresIndex(data);
      logger.info(`    ✅ index.json updated`);
    } catch (error) {
      logger.error(`    ❌ Failed to update stores index: ${error}`);
      throw error;
    }

    try {
      await this.verifyStoreCreation(data);
      logger.info(`    ✅ Verification passed`);
    } catch (error) {
      logger.error(`    ❌ Store verification failed: ${error}`);
      throw error;
    }
  }

  private async initializeDefaultStoresInIndex(indexData: any[]): Promise<any[]> {
    const defaultStores = [
      { slug: 'nawaem', name: 'نوايم', nameAr: 'نوايم', description: 'متجر نوايم' },
      { slug: 'sheirine', name: 'شيرين', nameAr: 'شيرين', description: 'متجر شيرين' },
      { slug: 'delta-store', name: 'دلتا', nameAr: 'دلتا', description: 'متجر دلتا' },
      { slug: 'pretty', name: 'بريتي', nameAr: 'بريتي', description: 'متجر بريتي' },
      { slug: 'magna-beauty', name: 'ماجنا بيوتي', nameAr: 'ماجنا بيوتي', description: 'متجر ماجنا بيوتي' }
    ];

    for (const defaultStore of defaultStores) {
      const exists = indexData.find((s: any) => s.slug === defaultStore.slug);
      if (!exists) {
        indexData.push({
          ...defaultStore,
          logo: `/assets/${defaultStore.slug}/logo.webp`,
          categories: [],
          productsCount: 0,
          lastUpdated: new Date().toISOString()
        });
        logger.info(`✅ Added default store to index: ${defaultStore.slug}`);
      }
    }

    return indexData;
  }

  private async updateStoresIndex(data: StoreGeneratorData): Promise<void> {
    const backendStoresDir = path.join(this.publicAssetsPath, 'stores');
    const frontendStoresDir = path.join(this.frontendPublicAssetsPath, 'stores');
    const backendIndexPath = path.join(backendStoresDir, 'index.json');
    const frontendIndexPath = path.join(frontendStoresDir, 'index.json');

    try {
      await fsPromises.mkdir(backendStoresDir, { recursive: true });
      await fsPromises.mkdir(frontendStoresDir, { recursive: true });
      logger.info(`📁 Created stores directories (backend & frontend)`);
    } catch (error) {
      logger.error(`❌ Failed to create stores directory: ${error}`);
      throw error;
    }

    let indexData: any[] = [];

    try {
      let existingIndexContent = '';
      if (fs.existsSync(backendIndexPath)) {
        existingIndexContent = await fsPromises.readFile(backendIndexPath, 'utf-8');
      } else if (fs.existsSync(frontendIndexPath)) {
        existingIndexContent = await fsPromises.readFile(frontendIndexPath, 'utf-8');
      }
      
      if (existingIndexContent) {
        const parsedData = JSON.parse(existingIndexContent);
        if (Array.isArray(parsedData)) {
          indexData = parsedData;
        } else if (parsedData && typeof parsedData === 'object' && parsedData.stores) {
          indexData = parsedData.stores;
        }
      }
    } catch (error) {
      logger.info('⚠️ Index file does not exist or is invalid, initializing with defaults');
      indexData = await this.initializeDefaultStoresInIndex([]);
    }

    if (indexData.length === 0) {
      indexData = await this.initializeDefaultStoresInIndex([]);
    }

    const existingIndex = indexData.findIndex((s: any) => s.slug === data.storeSlug);
    const storeEntry = {
      id: data.storeId,
      slug: data.storeSlug,
      name: data.storeName,
      nameAr: data.storeName,
      nameEn: data.storeNameEn,
      description: data.description,
      logo: data.logo,
      categories: data.categories,
      productsCount: data.products.length,
      lastUpdated: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      indexData[existingIndex] = storeEntry;
      logger.info(`🔄 Updated existing store entry in index: ${data.storeSlug}`);
    } else {
      indexData.push(storeEntry);
      logger.info(`➕ Added new store entry to index: ${data.storeSlug}`);
    }

    const indexContent = JSON.stringify(indexData, null, 2);
    
    try {
      await fsPromises.writeFile(backendIndexPath, indexContent, 'utf-8');
      logger.info(`✅ Backend index.json updated with ${indexData.length} stores`);
      
      await fsPromises.writeFile(frontendIndexPath, indexContent, 'utf-8');
      logger.info(`✅ Frontend index.json updated with ${indexData.length} stores`);
    } catch (error) {
      logger.error(`❌ Failed to write index.json: ${error}`);
      throw error;
    }
  }

  private async verifyStoreCreation(data: StoreGeneratorData): Promise<void> {
    logger.info(`\n      🔍 Verifying complete store creation...`);
    
    const backendStoreAssetsDir = path.join(this.publicAssetsPath, data.storeSlug);
    const frontendStoreAssetsDir = path.join(this.frontendPublicAssetsPath, data.storeSlug);
    const backendStoreJsonPath = path.join(backendStoreAssetsDir, 'store.json');
    const frontendStoreJsonPath = path.join(frontendStoreAssetsDir, 'store.json');
    const backendIndexPath = path.join(this.publicAssetsPath, 'stores', 'index.json');
    const frontendIndexPath = path.join(this.frontendPublicAssetsPath, 'stores', 'index.json');
    const storeDir = path.join(this.frontendStoresPath, data.storeSlug);
    const brandsDir = path.join(this.frontendPublicAssetsPath, 'brands');

    const missingItems: string[] = [];
    const warnings: string[] = [];

    logger.info(`        📋 Backend Checks:`);
    if (!fs.existsSync(backendStoreJsonPath)) {
      missingItems.push(`❌ Missing: backend store.json`);
    } else {
      logger.info(`          ✅ backend store.json exists`);
    }

    logger.info(`        📋 Frontend Checks:`);
    if (!fs.existsSync(frontendStoreJsonPath)) {
      missingItems.push(`❌ Missing: frontend store.json`);
    } else {
      logger.info(`          ✅ frontend store.json exists`);
    }

    if (!fs.existsSync(backendIndexPath)) {
      warnings.push(`⚠️  Backend index.json missing`);
    } else {
      logger.info(`          ✅ backend index.json exists`);
    }

    if (!fs.existsSync(frontendIndexPath)) {
      warnings.push(`⚠️  Frontend index.json missing`);
    } else {
      logger.info(`          ✅ frontend index.json exists`);
    }

    if (!fs.existsSync(storeDir)) {
      missingItems.push(`❌ Missing: TS store directory`);
    } else {
      logger.info(`          ✅ TS directory exists`);
      
      const expectedFiles = ['config.ts', 'products.ts', 'Slider.tsx', 'index.ts', 'sliderData.ts'];
      const foundFiles = fs.readdirSync(storeDir);
      
      for (const file of expectedFiles) {
        if (!foundFiles.includes(file)) {
          missingItems.push(`❌ Missing TS file: ${file}`);
        } else {
          logger.info(`            ✅ ${file}`);
        }
      }
    }

    logger.info(`        📋 Asset Checks:`);
    const assetDirs = ['products', 'sliders', 'logo'];
    for (const assetType of assetDirs) {
      const frontendAssetDir = path.join(frontendStoreAssetsDir, assetType);
      if (fs.existsSync(frontendAssetDir)) {
        const files = fs.readdirSync(frontendAssetDir);
        logger.info(`          ✅ ${assetType}/ (${files.length} files)`);
      } else {
        warnings.push(`⚠️  Frontend ${assetType}/ directory empty or missing`);
      }
    }

    if (fs.existsSync(brandsDir) && data.logo) {
      const logoFilename = path.basename(data.logo);
      const brandLogoPath = path.join(brandsDir, logoFilename);
      if (fs.existsSync(brandLogoPath)) {
        logger.info(`          ✅ Logo in brands/`);
      } else {
        const brandFiles = fs.readdirSync(brandsDir);
        const storeLogoInBrands = brandFiles.find(f => f.includes(data.storeSlug) || f.toLowerCase().includes(data.storeName.toLowerCase()));
        if (storeLogoInBrands) {
          logger.info(`          ✅ Logo in brands/ (${storeLogoInBrands})`);
        } else {
          warnings.push(`⚠️  Logo not found in brands/`);
        }
      }
    }

    if (warnings.length > 0) {
      logger.warn(`        ⚠️  Warnings: ${warnings.join(', ')}`);
    }

    if (missingItems.length > 0) {
      const errorMsg = `Store creation verification FAILED for ${data.storeSlug}:\n${missingItems.join('\n')}`;
      logger.error(`      ${errorMsg}`);
      throw new Error(errorMsg);
    }

    logger.info(`      🎯 All critical verification checks PASSED for: ${data.storeSlug}`);
  }
}

export default new StoreGeneratorService();
