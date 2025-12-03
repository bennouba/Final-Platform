import { Op } from 'sequelize';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import sequelize from '@config/database';
import { UserRole } from '@shared-types/index';
import storeGeneratorService from '@services/storeGeneratorService';
import logger from '@utils/logger';
import { sendSuccess, sendError } from '@utils/response';
import Store from '@models/Store';
import User from '@models/User';
import StoreSlider from '@models/StoreSlider';
import StoreAd from '@models/StoreAd';
import UnavailableNotification from '@models/UnavailableNotification';
import { moveUploadedFiles, cleanupTempUploads } from '@middleware/storeImageUpload';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

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

async function runGeneration(data: any): Promise<void> {
  try {
    const hookPath = path.join(process.cwd(), 'hooks', 'postCreationHook.js');
    if (fs.existsSync(hookPath)) {
      const hook = await import(hookPath);
      if (hook && typeof hook.runStoreGeneration === 'function') {
        await hook.runStoreGeneration(data);
        return;
      }
    }
  } catch {
    // Continue if no hook is available
  }
  await storeGeneratorService.generateStoreFiles(data);
}

const supportedImageExtensions = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'];

function getDefaultProductImage(storeSlug: string): string {
  const baseProjectDir = process.cwd().endsWith('backend') 
    ? path.join(process.cwd(), '..') 
    : process.cwd();
  
  for (const ext of supportedImageExtensions) {
    const storePath = `/assets/${storeSlug}/default-product.${ext}`;
    const storeDefaultFile = path.join(baseProjectDir, 'public', storePath.substring(1));
    
    if (fs.existsSync(storeDefaultFile)) {
      return storePath;
    }
  }
  
  for (const ext of supportedImageExtensions) {
    const globalPath = `/assets/default-product.${ext}`;
    const globalDefaultFile = path.join(baseProjectDir, 'public', globalPath.substring(1));
    
    if (fs.existsSync(globalDefaultFile)) {
      return globalPath;
    }
  }
  
  return '/assets/default-product.png';
}

interface SliderImage {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

interface StoreVerificationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    storeJsonExists: boolean;
    indexJsonExists: boolean;
    imagesFolderExists: boolean;
    tsFilesExist: boolean;
    fileCount?: number;
  };
}

async function cleanupDuplicateAssets(storeSlug: string): Promise<{ removed: number; message: string }> {
  try {
    const publicAssetsPath = path.join(process.cwd(), 'public/assets');
    const storeAssetDir = path.join(publicAssetsPath, storeSlug);
    const imageDirs = ['products', 'sliders', 'logo'];
    let totalRemoved = 0;

    for (const imageType of imageDirs) {
      const imageDir = path.join(storeAssetDir, imageType);
      if (!fs.existsSync(imageDir)) continue;

      const files = fs.readdirSync(imageDir);
      const fileHashes = new Map<string, string>();
      const filesToDelete: string[] = [];

      for (const filename of files) {
        const filePath = path.join(imageDir, filename);
        if (!fs.statSync(filePath).isFile()) continue;

        const hash = crypto
          .createHash('md5')
          .update(fs.readFileSync(filePath))
          .digest('hex');

        if (fileHashes.has(hash)) {
          filesToDelete.push(filePath);
          logger.info(`  🗑️  Duplicate found: ${filename} (removing...)`);
        } else {
          fileHashes.set(hash, filename);
        }
      }

      for (const filePath of filesToDelete) {
        try {
          fs.unlinkSync(filePath);
          totalRemoved++;
        } catch (error) {
          logger.warn(`  ⚠️  Failed to remove duplicate: ${filePath}`);
        }
      }
    }

    return {
      removed: totalRemoved,
      message: `Removed ${totalRemoved} duplicate asset file(s)`
    };
  } catch (error) {
    logger.error('Error during duplicate cleanup:', error);
    return {
      removed: 0,
      message: 'Duplicate cleanup encountered an error (non-critical)'
    };
  }
}

async function verifyStorePermanentStorage(storeSlug: string): Promise<StoreVerificationResult> {
  const result: StoreVerificationResult = {
    success: true,
    errors: [],
    warnings: [],
    checks: {
      storeJsonExists: false,
      indexJsonExists: false,
      imagesFolderExists: false,
      tsFilesExist: false
    }
  };

  try {
    let basePath = process.cwd();
    if (basePath.endsWith('backend')) {
      basePath = path.join(basePath, '..');
    }

    const publicAssetsPath = path.join(basePath, 'backend', 'public', 'assets');
    const storeAssetsDir = path.join(publicAssetsPath, storeSlug);
    const storeJsonPath = path.join(storeAssetsDir, 'store.json');
    const indexJsonPath = path.join(publicAssetsPath, 'stores', 'index.json');
    const frontendStoresPath = path.join(basePath, 'src', 'data', 'stores', storeSlug);

    if (fs.existsSync(storeJsonPath)) {
      result.checks.storeJsonExists = true;
      logger.info(`    ✅ store.json exists`);
    } else {
      result.errors.push('store.json not found in permanent storage');
      result.success = false;
    }

    if (fs.existsSync(indexJsonPath)) {
      result.checks.indexJsonExists = true;
      logger.info(`    ✅ index.json exists`);
    } else {
      result.warnings.push('index.json not found (may be created during sync)');
    }

    const productDir = path.join(storeAssetsDir, 'products');
    if (fs.existsSync(productDir)) {
      result.checks.imagesFolderExists = true;
      const files = fs.readdirSync(productDir);
      result.checks.fileCount = files.length;
      logger.info(`    ✅ Products folder exists with ${files.length} file(s)`);
    }

    if (fs.existsSync(frontendStoresPath)) {
      const expectedFiles = ['config.ts', 'products.ts', 'Slider.tsx', 'index.ts', 'sliderData.ts'];
      const files = fs.readdirSync(frontendStoresPath);
      const missingFiles = expectedFiles.filter(f => !files.includes(f));
      if (missingFiles.length === 0) {
        result.checks.tsFilesExist = true;
        logger.info(`    ✅ All TS files exist`);
      } else {
        result.warnings.push(`Missing TS files: ${missingFiles.join(', ')}`);
      }
    }

    if (!result.success && result.errors.length > 0) {
      logger.error(`    ❌ Verification failed:`, result.errors);
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Verification error: ${(error as Error).message}`);
    logger.error('Error verifying store:', error);
    return result;
  }
}

export const createStoreWithFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { storeData } = req.body;

    if (!storeData) {
      sendError(res, 'Missing store data', 400);
      return;
    }

    logger.info(`Creating store: ${storeData.storeName}`);

    await runGeneration(storeData);

    sendSuccess(res, {
      message: 'Store created successfully',
      store: {
        slug: storeData.storeSlug,
        name: storeData.storeName
      }
    }, 201, 'Store created successfully');
  } catch (error) {
    logger.error('Error creating store with files:', error);
    next(error);
  }
};

export const createStoreWithImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let files = req.files as Record<string, Express.Multer.File[]>;
    
    const {
      storeId,
      storeSlug,
      storeName,
      storeNameEn,
      description,
      icon,
      color,
      categories,
      products: productsJson,
      sliderImages: sliderImagesJson,
      productsImageCounts: productsImageCountsJson,
      ownerEmail,
      ownerSecondEmail,
      ownerName,
      ownerPhone,
      ownerPassword,
      email,
      phone,
      password
    } = req.body as any;

    if (!storeSlug || !storeName || !storeId) {
      sendError(res, 'Missing required fields', 400);
      return;
    }

    const parseArrayPayload = (value: any): any[] => {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === 'string' && value.trim()) {
        try {
          return JSON.parse(value);
        } catch (error) {
          logger.warn('Failed to parse array payload:', error);
          return [];
        }
      }
      return [];
    };

    const normalizedCategories = parseArrayPayload(categories);
    const getCategoryLabel = (value: any): string => {
      if (!value && value !== 0) {
        return 'general';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'object') {
        return value.name || value.label || value.id || 'general';
      }
      return String(value);
    };
    const primaryCategoryValue = getCategoryLabel(normalizedCategories[0]);
    const primaryOwnerEmail = (ownerEmail || email || '').toString().trim().toLowerCase();
    const secondaryOwnerEmail = (ownerSecondEmail || '').toString().trim().toLowerCase();
    const ownerFullName = (ownerName || '').toString().trim();
    const resolvedOwnerName = ownerFullName || storeName || '';
    const nameParts = resolvedOwnerName.split(/\s+/).filter(Boolean);
    const ownerFirstName = nameParts[0] || 'مالك';
    const ownerLastName = nameParts.slice(1).join(' ') || ownerFirstName;
    const primaryOwnerPhone = (ownerPhone || phone || '').toString().trim();
    const ownerPlainPassword = (ownerPassword || password || '').toString();

    if (!primaryOwnerEmail || !ownerPlainPassword) {
      sendError(res, 'Owner email and password are required', 400);
      return;
    }

    if (files && Object.keys(files).length > 0) {
      logger.info(`📁 Moving ${Object.keys(files).length} file fields from temp directory...`);
      logger.info(`   Files available: ${Object.keys(files).join(', ')}`);
      try {
        files = await moveUploadedFiles(storeSlug, files);
        logger.info(`✅ Files moved successfully to /assets/${storeSlug}/`);
        
        if (Object.keys(files).length === 0) {
          logger.warn(`⚠️ No files were moved successfully, will use defaults`);
        }
      } catch (moveError) {
        logger.error('❌ Failed to move uploaded files:', moveError);
        sendError(res, 'Failed to process uploaded files', 500);
        return;
      }
    } else {
      logger.info(`ℹ️ No files provided, will use default images`);
    }
    
    logger.info(`\n🔍 Processing files for store: ${storeName}`);
    
    const productFilesMap: Record<number, Express.Multer.File[]> = {};
    const aggregatedProductFiles: Express.Multer.File[] = [];
    const sliderFiles: Express.Multer.File[] = [];
    let logoFile: Express.Multer.File | undefined;
    const unknownFields: string[] = [];

    if (files) {
      Object.keys(files).forEach(fieldName => {
        if (fieldName.startsWith('productImage_')) {
          const productIndexMatch = fieldName.match(/productImage_(\d+)/);
          if (productIndexMatch) {
            const productIndex = parseInt(productIndexMatch[1], 10);
            if (!productFilesMap[productIndex]) {
              productFilesMap[productIndex] = [];
            }
            const fileArray = files[fieldName] || [];
            productFilesMap[productIndex].push(...fileArray);
            logger.info(`  ✅ [productImage_${productIndex}] ${fileArray.length} file(s) mapped to product index ${productIndex}`);
          }
        } else if (fieldName === 'productImage_aggregated' || fieldName === 'productImages') {
          const fileArray = files[fieldName] || [];
          aggregatedProductFiles.push(...fileArray);
          logger.info(`  ✅ [${fieldName}] ${fileArray.length} aggregated product image(s)`);
        } else if (fieldName.startsWith('sliderImage_')) {
          const sliderIndexMatch = fieldName.match(/sliderImage_(\d+)/);
          if (sliderIndexMatch) {
            const fileArray = files[fieldName] || [];
            sliderFiles.push(...fileArray);
            logger.info(`  ✅ [sliderImage_${sliderIndexMatch[1]}] ${fileArray.length} file(s)`);
          }
        } else if (fieldName === 'sliderImage_aggregated' || fieldName === 'sliderImages') {
          const fileArray = files[fieldName] || [];
          sliderFiles.push(...fileArray);
          logger.info(`  ✅ [${fieldName}] ${fileArray.length} slider file(s)`);
        } else if (fieldName === 'storeLogo') {
          logoFile = files[fieldName]?.[0];
          logger.info(`  ✅ [storeLogo] 1 file`);
        } else {
          unknownFields.push(fieldName);
          logger.warn(`  ⚠️ [${fieldName}] Unknown field - ignoring`);
        }
      });
    }

    const existingStore = await Store.findOne({
      where: {
        [Op.or]: [
          { slug: storeSlug },
          { name: storeName }
        ]
      }
    });
    
    if (existingStore) {
      sendError(
        res,
        `Store with name "${storeName}" or slug "${storeSlug}" already exists in the system`,
        409
      );
      return;
    }

    if (primaryOwnerEmail) {
      const existingUser = await User.findOne({ where: { email: primaryOwnerEmail } });
      if (existingUser) {
        sendError(
          res,
          `Email "${primaryOwnerEmail}" is already registered in the system`,
          409
        );
        return;
      }
    }

    if (secondaryOwnerEmail && secondaryOwnerEmail !== primaryOwnerEmail) {
      const existingUser = await User.findOne({ where: { email: secondaryOwnerEmail } });
      if (existingUser) {
        sendError(
          res,
          `Email "${secondaryOwnerEmail}" is already registered in the system`,
          409
        );
        return;
      }
    }

    let parsedProducts: ProductData[] = [];
    let parsedSliders: SliderImage[] = [];
    let productsImageCounts: number[] = [];
    type PersistedMerchantInstance = Awaited<ReturnType<typeof User.create>>;
    type PersistedStoreInstance = Awaited<ReturnType<typeof Store.create>>;
    let persistedMerchant: PersistedMerchantInstance | null = null;
    let persistedStoreRecord: PersistedStoreInstance | null = null;

    try {
      parsedProducts = JSON.parse(productsJson || '[]');
      parsedSliders = JSON.parse(sliderImagesJson || '[]');
      productsImageCounts = JSON.parse(productsImageCountsJson || '[]');
    } catch (parseError) {
      logger.error('Error parsing JSON:', parseError);
      sendError(res, 'Invalid JSON format for products or sliders', 400);
      return;
    }

    logger.info(`\n📦 Assigning images to ${parsedProducts.length} product(s)...\n`);

    if (aggregatedProductFiles.length > 0) {
      logger.info(`  🔄 Distributing ${aggregatedProductFiles.length} aggregated product image(s)`);
      const normalizedCounts = parsedProducts.map((_, idx) => {
        const count = productsImageCounts[idx];
        return count && count > 0 ? count : 1;
      });
      let aggregatedIndex = 0;

      parsedProducts.forEach((product, idx) => {
        if (productFilesMap[idx] && productFilesMap[idx].length > 0) {
          return;
        }
        const requiredCount = normalizedCounts[idx];
        const slice = aggregatedProductFiles.slice(aggregatedIndex, aggregatedIndex + requiredCount);
        aggregatedIndex += slice.length;
        if (slice.length > 0) {
          productFilesMap[idx] = [...slice];
          logger.info(`    • Aggregated assignment -> product ${idx} (${product.name}) received ${slice.length} image(s)`);
        }
      });

      if (aggregatedIndex < aggregatedProductFiles.length) {
        const leftovers = aggregatedProductFiles.slice(aggregatedIndex);
        logger.warn(`  ⚠️ ${leftovers.length} aggregated image(s) remained; distributing as fallback`);
        leftovers.forEach(file => {
          const targetIndex = parsedProducts.findIndex((_, idx) => !productFilesMap[idx] || productFilesMap[idx].length === 0);
          if (targetIndex >= 0) {
            productFilesMap[targetIndex] = [file];
            logger.info(`    • Fallback aggregated image assigned to product ${targetIndex} (${parsedProducts[targetIndex].name})`);
          }
        });
      }
    }

    const allUploadedImages: string[] = [];
    Object.values(productFilesMap).forEach(files => {
      files.forEach(f => {
        const imgPath = `/assets/${storeSlug}/products/${f.filename}`;
        allUploadedImages.push(imgPath);
      });
    });

    logger.info(`  📊 Total unique images uploaded: ${allUploadedImages.length}`);

    let imageIndex = 0;
    parsedProducts = parsedProducts.map((product, idx) => {
      const filesForThisProduct = productFilesMap[idx] || [];
      
      let images: string[] = [];
      if (filesForThisProduct.length > 0) {
        images = filesForThisProduct.map(f => `/assets/${storeSlug}/products/${f.filename}`);
        logger.info(`  📦 Product ${idx} (${product.name}): ✅ ${images.length} image(s) assigned (specific)`);
      } else if (allUploadedImages.length > 0) {
        images = [allUploadedImages[imageIndex % allUploadedImages.length]];
        imageIndex++;
        logger.info(`  📦 Product ${idx} (${product.name}): ✅ 1 image assigned (from upload pool)`);
      } else {
        images = [getDefaultProductImage(storeSlug)];
        logger.info(`  📦 Product ${idx} (${product.name}): ⚠️  Using default image`);
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

    logger.info(`\n✅ Image assignment complete - All products have unique images\n`);

    const defaultSliderImages = [
      {
        id: 'banner1',
        image: `/assets/${storeSlug}/sliders/default-slider-1.webp`,
        title: `اكتشف تشكيلة ${storeName} الحصرية`,
        subtitle: 'جودة عالية وأسعار منافسة',
        buttonText: 'تسوق الآن'
      },
      {
        id: 'banner2',
        image: `/assets/${storeSlug}/sliders/default-slider-2.webp`,
        title: `عروض حصرية من ${storeName}`,
        subtitle: 'لا تفوت الفرصة',
        buttonText: 'تسوق الآن'
      }
    ];
    
    const slidersWithImages: SliderImage[] = (parsedSliders.length > 0 ? parsedSliders : defaultSliderImages).map((slider, i) => {
      const file = sliderFiles[i];
      const image = file 
        ? `/assets/${storeSlug}/sliders/${file.filename}` 
        : (slider.image && slider.image.trim() ? slider.image : defaultSliderImages[i]?.image || '/assets/default-slider.png');
      
      logger.info(`  🖼️ Slider ${slider.id}: ${file ? 'uploaded image' : 'using default/provided image'}`);
      
      return {
        ...slider,
        image
      };
    });

    const logoUrl = logoFile 
      ? `/assets/${storeSlug}/logo/${logoFile.filename}` 
      : `/assets/default-store.png`;
    logger.info(`  🏷️ Logo: ${logoUrl}`);

    logger.info(`📝 Generating store files for: ${storeName}`);
    
    await runGeneration({
      storeId: Number(storeId),
      storeSlug,
      storeName,
      storeNameEn: storeNameEn || storeName,
      description,
      logo: logoUrl,
      icon: icon || '✨',
      color: color || 'from-purple-400 to-pink-600',
      categories: normalizedCategories,
      products: parsedProducts,
      sliderImages: slidersWithImages
    });

    logger.info(`✅ Store files generated successfully for: ${storeName}`);

    logger.info(`🔍 Verifying permanent storage for: ${storeSlug}`);
    const verificationResult = await verifyStorePermanentStorage(storeSlug);
    
    if (!verificationResult.success) {
      logger.error(`🚨 Store verification failed for ${storeSlug}:`, verificationResult);
      sendError(
        res,
        `Store creation verification failed. Errors: ${verificationResult.errors.join('; ')}`,
        500
      );
      return;
    }

    logger.info(`✅ Store verification PASSED for: ${storeSlug}`);
    
    logger.info(`🧹 Cleaning up temporary upload files...`);
    try {
      await cleanupTempUploads();
      logger.info(`✅ Temporary files cleaned up successfully`);
    } catch (cleanupError) {
      logger.warn(`⚠️ Non-critical: Failed to cleanup temp files:`, cleanupError);
    }

    logger.info(`🔍 Checking for duplicate assets...`);
    const cleanupResult = await cleanupDuplicateAssets(storeSlug);
    if (cleanupResult.removed > 0) {
      logger.info(`✅ ${cleanupResult.message}`);
    }

    logger.info(`💾 Persisting merchant credentials, store, sliders, and ads for ${storeSlug}...`);
    try {
      await sequelize.transaction(async (transaction) => {
        persistedMerchant = await User.create(
          {
            email: primaryOwnerEmail,
            password: ownerPlainPassword,
            firstName: ownerFirstName,
            lastName: ownerLastName,
            phone: primaryOwnerPhone || '000000000',
            role: UserRole.MERCHANT,
            storeName,
            storeSlug,
            storeCategory: primaryCategoryValue,
            storeDescription: description,
            storeLogo: logoUrl,
            merchantVerified: true
          },
          { transaction }
        );

        persistedStoreRecord = await Store.create(
          {
            merchantId: persistedMerchant!.id,
            name: storeName,
            slug: storeSlug,
            category: primaryCategoryValue,
            description,
            logo: logoUrl,
            banner: slidersWithImages[0]?.image ?? undefined,
            isActive: true
          },
          { transaction }
        );

        logger.info(`💾 Persisting ${slidersWithImages.length} sliders to database...`);
        for (let i = 0; i < slidersWithImages.length; i++) {
          const slider = slidersWithImages[i];
          await StoreSlider.create(
            {
              storeId: persistedStoreRecord!.id,
              title: slider.title || `Slider ${i + 1}`,
              subtitle: slider.subtitle,
              buttonText: slider.buttonText,
              imagePath: slider.image,
              sortOrder: i,
              metadata: {
                id: slider.id,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            },
            { transaction }
          );
        }
        logger.info(`✅ ${slidersWithImages.length} sliders persisted to database`);

        logger.info(`💾 Creating default ads for store...`);
        const defaultAds = [
          {
            templateId: 'banner_default',
            title: `مرحبا بك في متجر ${storeName}`,
            description: 'استمتع بأفضل العروض والمنتجات الحصرية',
            placement: 'banner' as const,
            isActive: true
          }
        ];

        for (const ad of defaultAds) {
          await StoreAd.create(
            {
              storeId: persistedStoreRecord!.id,
              ...ad
            },
            { transaction }
          );
        }
        logger.info(`✅ Default ads created for store`);
      });
      logger.info(`✅ Merchant credentials, store, sliders, and ads stored for ${storeSlug}`);
    } catch (dbError) {
      logger.error('❌ Failed to persist store data:', dbError);
      sendError(res, 'Failed to save store data', 500);
      return;
    }

    logger.info(`🎉 Store creation completed successfully for: ${storeName}`);

    const merchantPayload = persistedMerchant
      ? {
          id: persistedMerchant.id,
          email: persistedMerchant.email,
          phone: persistedMerchant.phone,
          storeRecordId: persistedStoreRecord?.id
        }
      : undefined;

    sendSuccess(res, {
      message: 'Store created successfully with permanent storage verification',
      store: {
        storeSlug,
        storeName,
        productsCount: parsedProducts.length,
        slidersCount: slidersWithImages.length,
        logo: logoUrl
      },
      products: parsedProducts,
      sliderImages: slidersWithImages,
      verification: {
        success: verificationResult.success,
        checks: verificationResult.checks,
        warnings: verificationResult.warnings
      },
      merchant: merchantPayload
    }, 201, 'Store created successfully with permanent storage verification');
  } catch (error) {
    logger.error('Error creating store with images:', error);
    next(error);
  }
};

export const validateStoreData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { storeSlug, products } = req.body;

    const validation = {
      isValid: true,
      errors: [] as string[]
    };

    if (!storeSlug || storeSlug.trim() === '') {
      validation.isValid = false;
      validation.errors.push('Store slug is required');
    }

    if (!Array.isArray(products) || products.length === 0) {
      validation.isValid = false;
      validation.errors.push('At least one product is required');
    }

    if (!validation.isValid) {
      sendError(res, validation.errors.join(', '), 400);
      return;
    }

    sendSuccess(res, {
      message: 'Store data is valid',
      validation
    }, 200, 'Store data is valid');
  } catch (error) {
    logger.error('Error validating store data:', error);
    next(error);
  }
};

export const checkStoreExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { storeSlug, storeName } = req.body;

    if (!storeSlug && !storeName) {
      sendError(res, 'Store slug or name is required', 400);
      return;
    }

    const existingStore = await Store.findOne({
      where: {
        [Op.or]: [
          storeSlug ? { slug: storeSlug } : {},
          storeName ? { name: storeName } : {}
        ]
      }
    });

    if (existingStore) {
      sendSuccess(res, {
        exists: true,
        store: {
          id: existingStore.id,
          slug: (existingStore as any).slug,
          name: (existingStore as any).name
        }
      });
    } else {
      sendSuccess(res, {
        exists: false,
        message: 'Store is available'
      });
    }
  } catch (error) {
    logger.error('Error checking store existence:', error);
    next(error);
  }
};

export const cleanupStoreAndUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { storeId, userIds } = req.body;

    if (!storeId || !Array.isArray(userIds) || userIds.length === 0) {
      sendError(res, 'Store ID and user IDs are required', 400);
      return;
    }

    logger.info(`Cleaning up store ${storeId} and ${userIds.length} user(s)...`);

    await Store.destroy({
      where: { id: storeId }
    });

    await User.destroy({
      where: { id: { [Op.in]: userIds } }
    });

    logger.info(`Cleanup completed for store ${storeId}`);

    sendSuccess(res, {
      message: 'Store and users cleaned up successfully',
      storeId,
      usersDeleted: userIds.length
    });
  } catch (error) {
    logger.error('Error during cleanup:', error);
    next(error);
  }
};

export const createUnavailableNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      storeId,
      storeSlug,
      productId,
      productName,
      customerName,
      phone,
      email,
      quantity,
      notificationTypes
    } = req.body || {};

    if (!productId || !productName || !customerName || !phone || !email) {
      sendError(res, 'Missing required fields for unavailable notification', 400);
      return;
    }

    let resolvedStoreId = storeId as number | undefined;
    let resolvedStoreSlug = storeSlug as string | undefined;

    if (!resolvedStoreSlug && resolvedStoreId) {
      const store = await Store.findByPk(resolvedStoreId);
      resolvedStoreSlug = (store as any)?.slug;
    }

    if (!resolvedStoreId && resolvedStoreSlug) {
      const store = await Store.findOne({ where: { slug: resolvedStoreSlug } });
      resolvedStoreId = store?.id;
    }

    const normalizedNotificationTypes = Array.isArray(notificationTypes)
      ? notificationTypes.join(',')
      : typeof notificationTypes === 'string'
        ? notificationTypes
        : '';

    const record = await UnavailableNotification.create({
      storeId: resolvedStoreId,
      storeSlug: resolvedStoreSlug,
      productId,
      productName,
      customerName,
      phone,
      email,
      quantity: quantity ?? 1,
      notificationTypes: normalizedNotificationTypes
    });

    logger.info('Unavailable notification stored', {
      id: record.id,
      storeSlug: resolvedStoreSlug,
      productId
    });

    sendSuccess(res, {
      message: 'Unavailable notification created',
      notification: record
    }, 201);
  } catch (error) {
    logger.error('Error creating unavailable notification:', error);
    next(error);
  }
};

export const listUnavailableByStore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { storeSlug } = req.params;

    if (!storeSlug) {
      sendError(res, 'Store slug is required', 400);
      return;
    }

    logger.info(`Listing unavailable items for store: ${storeSlug}`);

    const storeRecord = await Store.findOne({ where: { slug: storeSlug } });
    const clauses: any[] = [{ storeSlug }];
    if (storeRecord?.id) {
      clauses.push({ storeId: storeRecord.id });
    }

    const unavailableItems = await UnavailableNotification.findAll({
      where: { [Op.or]: clauses },
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, {
      store: storeSlug,
      unavailableItems
    });
  } catch (error) {
    logger.error('Error listing unavailable items:', error);
    next(error);
  }
};

export const uploadSliderImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeSlug } = req.params;
    const { title, subtitle, buttonText, sortOrder } = req.body;
    const file = (req as any).file;

    if (!file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    const store = await Store.findOne({ where: { slug: storeSlug } });
    if (!store) {
      res.status(404).json({ success: false, error: 'Store not found' });
      return;
    }

    let basePath = process.cwd();
    if (basePath.endsWith('backend')) {
      basePath = path.join(basePath, '..');
    }
    const storeSliderDir = path.join(basePath, 'backend', 'public', 'assets', storeSlug, 'sliders');
    logger.info(`📁 Creating directory: ${storeSliderDir}`);
    await fsPromises.mkdir(storeSliderDir, { recursive: true });

    const newPath = path.join(storeSliderDir, file.filename);
    logger.info(`📋 Moving file from: ${file.path} to: ${newPath}`);
    await fsPromises.rename(file.path, newPath);

    const imagePath = `/assets/${storeSlug}/sliders/${file.filename}`;
    logger.info(`✅ Slider image uploaded: ${imagePath}`);

    const slider = await StoreSlider.create({
      storeId: store.id,
      title: title || `Slider ${Date.now()}`,
      subtitle: subtitle || '',
      buttonText: buttonText || 'View More',
      imagePath,
      sortOrder: sortOrder ? parseInt(sortOrder as string, 10) : 0,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });

    logger.info(`✅ Slider persisted to database: ${slider.id}`);
    
    res.status(201).json({
      success: true,
      data: { 
        id: slider.id,
        imagePath, 
        filename: file.filename,
        slider
      }
    });
  } catch (error) {
    logger.error('Error uploading slider image:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
};
