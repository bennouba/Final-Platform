import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * أداة لإزالة التكرار في الأصول وإعادة التسمية باستخدام البصمة الرقمية (hash)
 * Utility for deduplicating assets and renaming with hash-based naming
 */

interface AssetInfo {
  filePath: string;
  hash: string;
  size: number;
  mtime: Date;
}

interface DeduplicationResult {
  duplicatesRemoved: number;
  filesProcessed: number;
  spaceSaved: number;
  renamedFiles: Array<{ oldPath: string; newPath: string }>;
}

/**
 * حساب البصمة الرقمية للملف
 * Calculate file hash
 */
export function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * جمع معلومات جميع الملفات في مجلد معين
 * Collect information about all files in a directory
 */
export async function collectAssetInfo(directory: string): Promise<AssetInfo[]> {
  const assets: AssetInfo[] = [];

  function scanDirectory(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        // فقط الملفات ذات الامتدادات المعروفة
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
          assets.push({
            filePath: fullPath,
            hash: '',
            size: stat.size,
            mtime: stat.mtime
          });
        }
      }
    }
  }

  scanDirectory(directory);
  return assets;
}

/**
 * إزالة التكرارات وإعادة التسمية بالبصمة الرقمية
 * Remove duplicates and rename with hash
 */
export async function deduplicateAssets(directory: string): Promise<DeduplicationResult> {
  const assets = await collectAssetInfo(directory);

  // حساب البصمات الرقمية
  for (const asset of assets) {
    try {
      asset.hash = await calculateFileHash(asset.filePath);
    } catch (error) {
      // Hash calculation failed
    }
  }

  // تجميع الملفات حسب البصمة
  const hashGroups = new Map<string, AssetInfo[]>();
  for (const asset of assets) {
    if (!hashGroups.has(asset.hash)) {
      hashGroups.set(asset.hash, []);
    }
    hashGroups.get(asset.hash)!.push(asset);
  }

  let duplicatesRemoved = 0;
  let spaceSaved = 0;
  const renamedFiles: Array<{ oldPath: string; newPath: string }> = [];

  // معالجة كل مجموعة
  for (const [hash, group] of hashGroups) {
    if (group.length <= 1) continue;

    group.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    const keepFile = group[0];
    if (!keepFile) continue;

    const duplicates = group.slice(1);

    const ext = path.extname(keepFile.filePath);
    const dir = path.dirname(keepFile.filePath);
    const newFileName = `${hash}${ext}`;
    const newPath = path.join(dir, newFileName);

    if (keepFile.filePath !== newPath) {
      try {
        fs.renameSync(keepFile.filePath, newPath);
        renamedFiles.push({ oldPath: keepFile.filePath, newPath });
      } catch (error) {
        // Rename failed
      }
    }

    for (const duplicate of duplicates) {
      try {
        fs.unlinkSync(duplicate.filePath);
        duplicatesRemoved++;
        spaceSaved += duplicate.size;
      } catch (error) {
        // Delete failed
      }
    }
  }

  const result: DeduplicationResult = {
    duplicatesRemoved,
    filesProcessed: assets.length,
    spaceSaved,
    renamedFiles
  };

  return result;
}

/**
 * تحديث ملف store.json لاستخدام المسارات الجديدة
 * Update store.json to use new hash-based paths
 */
export function updateStoreJsonReferences(storeJsonPath: string, renamedFiles: Array<{ oldPath: string; newPath: string }>): void {
  if (!fs.existsSync(storeJsonPath)) {
    return;
  }

  try {
    const content = fs.readFileSync(storeJsonPath, 'utf-8');
    const storeData = JSON.parse(content);
    let updated = false;

    // إنشاء خريطة للمسارات القديمة والجديدة
    const pathMap = new Map<string, string>();
    for (const { oldPath, newPath } of renamedFiles) {
      const relativeOldPath = oldPath.replace(/\\/g, '/').split('/assets/')[1];
      const relativeNewPath = newPath.replace(/\\/g, '/').split('/assets/')[1];
      if (relativeOldPath && relativeNewPath) {
        pathMap.set(relativeOldPath, relativeNewPath);
      }
    }

    // تحديث logo
    if (storeData.logo && typeof storeData.logo === 'string') {
      for (const [oldPath, newPath] of pathMap) {
        if (storeData.logo.includes(oldPath)) {
          storeData.logo = storeData.logo.replace(oldPath, newPath);
          updated = true;
          break;
        }
      }
    }

    // تحديث sliderImages
    if (storeData.sliderImages && Array.isArray(storeData.sliderImages)) {
      for (const slide of storeData.sliderImages) {
        if (slide.image && typeof slide.image === 'string') {
          for (const [oldPath, newPath] of pathMap) {
            if (slide.image.includes(oldPath)) {
              slide.image = slide.image.replace(oldPath, newPath);
              updated = true;
              break;
            }
          }
        }
      }
    }

    // تحديث products
    if (storeData.products && Array.isArray(storeData.products)) {
      for (const product of storeData.products) {
        if (product.images && Array.isArray(product.images)) {
          for (const image of product.images) {
            if (typeof image === 'string') {
              for (const [oldPath, newPath] of pathMap) {
                if (image.includes(oldPath)) {
                  product.images[product.images.indexOf(image)] = image.replace(oldPath, newPath);
                  updated = true;
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (updated) {
      fs.writeFileSync(storeJsonPath, JSON.stringify(storeData, null, 2), 'utf-8');
    }
  } catch (error) {
    // Update failed
  }
}

/**
 * تشغيل التنظيف الشامل لمتجر معين
 * Run complete cleanup for a specific store
 */
export async function cleanupStoreAssets(storeSlug: string): Promise<DeduplicationResult> {
  const publicAssetsPath = path.resolve('./public/assets');
  const storeAssetsPath = path.join(publicAssetsPath, storeSlug);

  if (!fs.existsSync(storeAssetsPath)) {
    return {
      duplicatesRemoved: 0,
      filesProcessed: 0,
      spaceSaved: 0,
      renamedFiles: []
    };
  }

  // تنظيف الأصول
  const result = await deduplicateAssets(storeAssetsPath);

  // تحديث store.json
  if (result.renamedFiles.length > 0) {
    const storeJsonPath = path.join(publicAssetsPath, storeSlug, 'store.json');
    updateStoreJsonReferences(storeJsonPath, result.renamedFiles);
  }

  return result;
}

/**
 * تشغيل التنظيف لجميع المتاجر
 * Run cleanup for all stores
 */
export async function cleanupAllStores(): Promise<void> {
  const publicAssetsPath = path.resolve('./public/assets');
  const storesIndexPath = path.join(publicAssetsPath, 'stores', 'index.json');

  if (!fs.existsSync(storesIndexPath)) {
    // Index file not found, scanning all directories
  }

  let storeSlugs: string[] = [];

  if (fs.existsSync(storesIndexPath)) {
    try {
      const indexContent = fs.readFileSync(storesIndexPath, 'utf-8');
      const indexData = JSON.parse(indexContent);
      const stores = Array.isArray(indexData) ? indexData : indexData.stores || [];
      storeSlugs = stores.map((store: any) => store.slug).filter(Boolean);
    } catch (error) {
      // Failed to read stores index
    }
  }

  // إذا لم نجد الفهرس، نبحث عن جميع المجلدات
  if (storeSlugs.length === 0) {
    if (fs.existsSync(publicAssetsPath)) {
      const items = fs.readdirSync(publicAssetsPath);
      for (const item of items) {
        const fullPath = path.join(publicAssetsPath, item);
        if (fs.statSync(fullPath).isDirectory() && item !== 'stores') {
          storeSlugs.push(item);
        }
      }
    }
  }

  // Starting cleanup for stores

  const totalResult: DeduplicationResult = {
    duplicatesRemoved: 0,
    filesProcessed: 0,
    spaceSaved: 0,
    renamedFiles: []
  };

  for (const slug of storeSlugs) {
    try {
      const result = await cleanupStoreAssets(slug);
      totalResult.duplicatesRemoved += result.duplicatesRemoved;
      totalResult.filesProcessed += result.filesProcessed;
      totalResult.spaceSaved += result.spaceSaved;
      totalResult.renamedFiles.push(...result.renamedFiles);
    } catch (error) {
      // Failed to cleanup store
    }
  }

  // Cleanup completed
}
