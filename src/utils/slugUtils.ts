/**
 * أدوات لمعالجة وتوحيد السلاج (slug) عبر المشروع
 * Slug processing and normalization utilities across the project
 */

/**
 * دالة السلاج التوحيدية - canonical slug function
 * يجب استخدامها في جميع أنحاء المشروع لضمان التطابق
 * Canonical slug function - must be used throughout the project for consistency
 */
export function canonicalSlug(value: any): string {
  if (!value) return '';

  const normalized = (value ?? '').toString().trim().toLowerCase().replace(/\s+/g, '-');

  // خريطة الأسماء المعروفة للمتاجر
  // Known store name mappings
  const aliasMap: Record<string, string> = {
    // المتاجر المعروفة
    sherine: 'sheirine',
    sheirin: 'sheirine',
    'delta': 'delta-store',
    'details': 'delta-store',
    'detail': 'delta-store',
    'megna': 'magna-beauty',
    'magna': 'magna-beauty',
    'magna_beauty': 'magna-beauty',
    'nawaem': 'nawaem',
    'pretty': 'pretty'
  };

  return aliasMap[normalized] || normalized;
}

/**
 * التحقق من صحة السلاج
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;

  // يجب أن يحتوي على أحرف إنجليزية صغيرة، أرقام، وشرطات فقط
  // Should contain only lowercase English letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 50;
}

/**
 * تنظيف السلاج وإزالة الشخصيات غير المرغوبة
 * Clean slug by removing unwanted characters
 */
export function cleanSlug(slug: string): string {
  if (!slug) return '';

  return slug
    .toLowerCase()
    .trim()
    // استبدال المسافات بشرطات
    .replace(/\s+/g, '-')
    // إزالة الشخصيات غير المرغوبة
    .replace(/[^a-z0-9-]/g, '')
    // إزالة الشرطات المتتالية
    .replace(/-+/g, '-')
    // إزالة الشرطات من البداية والنهاية
    .replace(/^-+|-+$/g, '');
}

/**
 * إنشاء سلاج من اسم
 * Generate slug from name
 */
export function slugify(name: string): string {
  if (!name) return '';

  return cleanSlug(name);
}

/**
 * مقارنة سلاجين مع مراعاة التوحيد
 * Compare two slugs considering canonical normalization
 */
export function slugsEqual(slug1: string, slug2: string): boolean {
  return canonicalSlug(slug1) === canonicalSlug(slug2);
}

/**
 * الحصول على اسم المتجر من السلاج
 * Get store name from slug
 */
export function getStoreNameFromSlug(slug: string): string {
  if (!slug) return '';

  const canonical = canonicalSlug(slug);

  const nameMap: Record<string, string> = {
    'nawaem': 'نوايم',
    'sheirine': 'شيرين',
    'pretty': 'بريتي',
    'delta-store': 'دلتا',
    'magna-beauty': 'ماجنا بيوتي'
  };

  return nameMap[canonical] || canonical;
}

/**
 * الحصول على السلاج من اسم المتجر
 * Get slug from store name
 */
export function getSlugFromStoreName(name: string): string {
  if (!name) return '';

  const normalizedName = name.trim().toLowerCase();

  const reverseNameMap: Record<string, string> = {
    'نوايم': 'nawaem',
    'شيرين': 'sheirine',
    'بريتي': 'pretty',
    'دلتا': 'delta-store',
    'ماجنا بيوتي': 'magna-beauty'
  };

  return reverseNameMap[normalizedName] || canonicalSlug(name);
}
