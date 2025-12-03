/**
 * أدوات التحقق من صحة الأصول قبل العرض
 * Asset validation utilities before display
 */

/**
 * التحقق من وجود الملف على المسار المحدد
 * Check if file exists at the specified path
 */
export async function validateAssetExists(assetPath: string): Promise<boolean> {
  if (!assetPath || typeof assetPath !== 'string') return false;

  const cleanPath = assetPath.split('?')[0];
  if (!cleanPath) return false;

  try {
    const response = await fetch(cleanPath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * التحقق من صحة شعار المتجر
 * Validate store logo
 */
export async function validateStoreLogo(logoPath: string): Promise<boolean> {
  if (!logoPath) return false;

  const exists = await validateAssetExists(logoPath);
  return exists;
}

/**
 * التحقق من صحة صور السلايدر
 * Validate slider images
 */
export async function validateSliderImages(sliderImages: any[]): Promise<{
  validImages: any[];
  invalidCount: number;
}> {
  if (!Array.isArray(sliderImages) || sliderImages.length === 0) {
    return { validImages: [], invalidCount: 0 };
  }

  const validImages: any[] = [];
  let invalidCount = 0;

  for (const image of sliderImages) {
    if (!image || typeof image !== 'object') {
      invalidCount++;
      continue;
    }

    // التحقق من وجود حقل image
    if (!image.image || typeof image.image !== 'string') {


      invalidCount++;
      continue;
    }

    // التحقق من وجود الملف
    const exists = await validateAssetExists(image.image);
    if (exists) {
      validImages.push(image);
    } else {


      invalidCount++;
    }
  }

  return { validImages, invalidCount };
}

/**
 * التحقق الشامل لبيانات المتجر قبل العرض
 * Comprehensive store data validation before display
 */
export async function validateStoreForDisplay(storeData: any): Promise<{
  isValid: boolean;
  issues: string[];
  validatedData: any;
}> {
  const issues: string[] = [];
  const validatedData = { ...storeData };

  // التحقق من السلاج
  if (!storeData.slug || typeof storeData.slug !== 'string') {
    issues.push('سلاج المتجر غير صالح');
    issues.push('Invalid store slug');
  }

  // التحقق من الشعار
  if (!storeData.logo || typeof storeData.logo !== 'string') {
    issues.push('شعار المتجر مفقود');
    issues.push('Store logo missing');
  } else {
    const logoValid = await validateStoreLogo(storeData.logo);
    if (!logoValid) {
      issues.push('شعار المتجر غير موجود على المسار المحدد');
      issues.push('Store logo not found at specified path');
    }
  }

  // التحقق من صور السلايدر
  if (storeData.sliderImages && Array.isArray(storeData.sliderImages)) {
    const { validImages, invalidCount } = await validateSliderImages(storeData.sliderImages);
    validatedData.sliderImages = validImages;

    if (invalidCount > 0) {
      issues.push(`${invalidCount} صورة سلايدر غير صالحة`);
      issues.push(`${invalidCount} invalid slider images`);
    }

    if (validImages.length === 0 && storeData.sliderImages.length > 0) {
      issues.push('لا توجد صور سلايدر صالحة');
      issues.push('No valid slider images found');
    }
  }

  // التحقق من المنتجات
  if (!storeData.products || !Array.isArray(storeData.products)) {
    issues.push('قائمة المنتجات غير صالحة');
    issues.push('Invalid products list');
  } else if (storeData.products.length === 0) {
    issues.push('لا توجد منتجات في المتجر');
    issues.push('No products in store');
  }

  const isValid = issues.length === 0;

  if (!isValid) {
    void 0;
  }

  return {
    isValid,
    issues,
    validatedData
  };
}

/**
 * فلترة المتاجر الصالحة فقط للعرض
 * Filter only valid stores for display
 */
export async function filterValidStoresForDisplay(stores: any[]): Promise<{
  validStores: any[];
  invalidStores: Array<{ store: any; issues: string[] }>;
}> {
  const validStores: any[] = [];
  const invalidStores: Array<{ store: any; issues: string[] }> = [];




  for (const store of stores) {
    try {
      const validation = await validateStoreForDisplay(store);
      if (validation.isValid) {
        validStores.push(validation.validatedData);
      } else {
        invalidStores.push({
          store,
          issues: validation.issues
        });
      }
    } catch (error) {


      invalidStores.push({
        store,
        issues: ['خطأ في التحقق', 'Validation error']
      });
    }
  }






  return { validStores, invalidStores };
}

/**
 * إنشاء صور سلايدر احتياطية من المنتجات
 * Create fallback slider images from products
 */
export function createFallbackSliderImages(products: any[], maxImages: number = 5): any[] {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  const fallbackImages: any[] = [];
  const usedImages = new Set<string>();

  for (const product of products) {
    if (fallbackImages.length >= maxImages) break;

    if (product.images && Array.isArray(product.images)) {
      for (const image of product.images) {
        if (typeof image === 'string' && !usedImages.has(image)) {
          usedImages.add(image);
          fallbackImages.push({
            id: `fallback-${product.id}-${fallbackImages.length}`,
            image: image,
            title: product.name || 'منتج مميز',
            subtitle: '',
            buttonText: 'تسوق الآن'
          });
          break; // استخدم صورة واحدة فقط من كل منتج
        }
      }
    }
  }

  return fallbackImages;
}
