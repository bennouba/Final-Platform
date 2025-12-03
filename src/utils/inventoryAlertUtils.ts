import type { ProductInventory } from '../types/inventory';

// Export ProductInventory type for use in other components
export type { ProductInventory } from '../types/inventory';

export type AlertLevel = 'available' | 'warning' | 'critical' | 'expiring_soon' | 'expired';

export interface AlertConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

// قائمة الفئات التي تحتاج تتبع انتهاء الصلاحية
const EXPIRY_CATEGORIES = [
  'food',
  'supplement', 
  'medicine',
  'cosmetics',
  'skincare'
];

// قائمة الفئات التي لا تحتاج تتبع انتهاء الصلاحية
const NON_EXPIRY_CATEGORIES = [
  'clothing',
  'electronics',
  'books',
  'furniture',
  'toys',
  'oils_filters',
  'cleaning'
];

/**
 * تحديد مستوى التنبيه بناءً على كمية المخزون
 */
export function getInventoryAlertLevel(product: ProductInventory): AlertLevel {
  const { currentQuantity, minQuantity, category } = product;
  
  // التحقق من انتهاء الصلاحية أولاً
  if (hasExpiryTracking(category) && product.expiryDate) {
    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
    if (daysUntilExpiry !== null) {
      if (daysUntilExpiry < 0) {
        return 'expired';
      }
      if (daysUntilExpiry <= 60) { // أقل من 60 يوم
        return 'expiring_soon';
      }
    }
  }

  // التحقق من الكمية
  if (currentQuantity === 0) {
    return 'critical';
  }
  
  if (currentQuantity <= minQuantity) {
    return 'warning';
  }
  
  return 'available';
}

/**
 * إعدادات التنبيهات بناءً على المستوى
 */
export function getAlertConfig(level: AlertLevel): AlertConfig {
  const configs: Record<AlertLevel, AlertConfig> = {
    available: {
      label: 'متوفر',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      icon: '🟢',
      description: 'الكمية كافية للعمل العادي'
    },
    warning: {
      label: 'تحذير',
      color: 'text-orange-700', // تغيير من الأصفر إلى البرتقالي
      bgColor: 'bg-orange-100',
      icon: '🟠',
      description: 'الكمية قريبة من الحد الأدنى - تحتاج إعادة تخزين'
    },
    critical: {
      label: 'حرج',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      icon: '🔴',
      description: 'المخزون فارغ - إعادة تخزين فوري'
    },
    expiring_soon: {
      label: 'قريب من الانتهاء',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      icon: '🟠',
      description: 'الصلاحية تنتهي خلال 60 يوم'
    },
    expired: {
      label: 'منتهي الصلاحية',
      color: 'text-red-800',
      bgColor: 'bg-red-200',
      icon: '⚫',
      description: 'يجب إزالة المنتج من المخزن'
    }
  };

  return configs[level];
}

/**
 * حساب عدد الأيام المتبقية لانتهاء الصلاحية
 */
export function getDaysUntilExpiry(expiryDate: string): number | null {
  try {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {

    return null;
  }
}

/**
 * تنسيق التاريخ للعرض
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-LY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {

    return dateString;
  }
}

/**
 * تحديد الفئة بالعربية
 */
export function getCategoryLabel(category: string): string {
  const categoryLabels: Record<string, string> = {
    food: 'مواد غذائية',
    supplement: 'مكملات غذائية',
    medicine: 'أدوية',
    cosmetics: 'مستحضرات تجميل',
    skincare: 'عناية بالبشرة',
    cleaning: 'مواد تنظيف',
    oils_filters: 'زيوت ومرشحات',
    clothing: 'ملابس',
    electronics: 'إلكترونيات',
    books: 'كتب',
    furniture: 'أثاث',
    toys: 'ألعاب'
  };

  return categoryLabels[category] || category;
}

/**
 * التحقق من تتبع انتهاء الصلاحية للفئة
 */
export function hasExpiryTracking(category: string): boolean {
  return EXPIRY_CATEGORIES.includes(category);
}

/**
 * التحقق من عدم تتبع انتهاء الصلاحية للفئة
 */
export function hasNoExpiryTracking(category: string): boolean {
  return NON_EXPIRY_CATEGORIES.includes(category);
}

/**
 * الحصول على توصية إعادة التخزين
 */
export function getRestockRecommendation(product: ProductInventory): string {
  const { currentQuantity, minQuantity, maxQuantity } = product;
  
  if (currentQuantity === 0) {
    return '🚨 نفاد - طلب عاجل';
  }
  
  if (currentQuantity <= minQuantity) {
    const recommendedAmount = Math.max(maxQuantity - currentQuantity, minQuantity * 2);
    return `⚠️ إعادة تخزين - ${recommendedAmount} قطعة`;
  }
  
  const percentage = (currentQuantity / maxQuantity) * 100;
  
  if (percentage <= 25) {
    return '📉 مخزون منخفض';
  } else if (percentage <= 50) {
    return '📊 مخزون متوسط';
  } else {
    return '✅ مخزون جيد';
  }
}

/**
 * تحديد لون شريط التقدم بناءً على مستوى التنبيه
 */
export function getProgressBarColor(product: ProductInventory): string {
  const level = getInventoryAlertLevel(product);
  
  switch (level) {
    case 'available':
      return 'bg-green-500';
    case 'warning':
      return 'bg-orange-500'; // برتقالي للتحذير
    case 'critical':
      return 'bg-red-500'; // أحمر للنفاد
    case 'expiring_soon':
      return 'bg-yellow-500';
    case 'expired':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
}

/**
 * حساب نسبة المخزون بالنسبة للحد الأقصى
 */
export function getStockPercentage(product: ProductInventory): number {
  const { currentQuantity, maxQuantity } = product;
  return Math.min((currentQuantity / maxQuantity) * 100, 100);
}

/**
 * التحقق من حالة الطوارئ
 */
export function isEmergency(product: ProductInventory): boolean {
  const level = getInventoryAlertLevel(product);
  return level === 'critical' || level === 'expired';
}

/**
 * الحصول على قائمة المنتجات التي تحتاج اهتمام فوري
 */
export function getCriticalProducts(products: ProductInventory[]): ProductInventory[] {
  return products.filter(product => {
    const level = getInventoryAlertLevel(product);
    return level === 'critical' || level === 'expired' || level === 'warning';
  });
}

/**
 * إحصائيات شاملة للمخزون
 */
export function getInventoryStats(products: ProductInventory[]) {
  const stats = {
    total: products.length,
    available: 0,
    warning: 0,
    critical: 0,
    expiringSoon: 0,
    expired: 0,
    totalValue: 0,
    lowStockValue: 0
  };

  products.forEach(product => {
    const level = getInventoryAlertLevel(product);
    const productValue = product.currentQuantity * product.price;
    
    stats.totalValue += productValue;
    
    switch (level) {
      case 'available':
        stats.available++;
        break;
      case 'warning':
        stats.warning++;
        stats.lowStockValue += productValue;
        break;
      case 'critical':
        stats.critical++;
        stats.lowStockValue += productValue;
        break;
      case 'expiring_soon':
        stats.expiringSoon++;
        break;
      case 'expired':
        stats.expired++;
        stats.lowStockValue += productValue;
        break;
    }
  });

  return stats;
}

/**
 * تحديد المنتجات القريبة من انتهاء الصلاحية
 */
export function getExpiringProducts(products: ProductInventory[], daysThreshold: number = 60): ProductInventory[] {
  return products.filter(product => {
    if (!hasExpiryTracking(product.category) || !product.expiryDate) {
      return false;
    }
    
    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
    return daysUntilExpiry !== null && daysUntilExpiry <= daysThreshold && daysUntilExpiry >= 0;
  });
}

/**
 * تصدير البيانات إلى CSV
 */
export function exportToCSV(products: ProductInventory[]): string {
  const headers = [
    'اسم المنتج',
    'كود SKU',
    'الكمية الحالية',
    'الحد الأدنى',
    'الحد الأقصى',
    'الفئة',
    'تاريخ انتهاء الصلاحية',
    'المخزن',
    'قيمة المنتج',
    'مستوى التنبيه'
  ];

  const rows = products.map(product => {
    const level = getInventoryAlertLevel(product);
    const config = getAlertConfig(level);
    
    return [
      product.productName,
      product.sku,
      product.currentQuantity.toString(),
      product.minQuantity.toString(),
      product.maxQuantity.toString(),
      getCategoryLabel(product.category),
      product.expiryDate || 'غير محدد',
      product.warehouse,
      (product.currentQuantity * product.price).toFixed(2),
      config.label
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}
