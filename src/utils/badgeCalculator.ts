import type { Product } from '@/data/storeProducts';

export interface BadgeMetrics {
  views?: number;
  likes?: number;
  orders?: number;
  rating?: number;
  quantity?: number;
  originalPrice?: number;
  price?: number;
  isNew?: boolean;
  createdDate?: string;
}

export function calculateBadge(product: any, metrics?: BadgeMetrics): string {
  const views = metrics?.views ?? product.views ?? 0;
  const likes = metrics?.likes ?? product.likes ?? 0;
  const orders = metrics?.orders ?? product.orders ?? 0;
  const quantity = metrics?.quantity ?? product.quantity ?? 10;
  const originalPrice = metrics?.originalPrice ?? product.originalPrice ?? 0;
  const price = metrics?.price ?? product.price ?? 0;
  const isNew = metrics?.isNew ?? product.isNew ?? false;

  if (!product.inStock || product.isAvailable === false) {
    return 'غير متوفر';
  }

  if (quantity <= 0) {
    return 'غير متوفر';
  }

  if (originalPrice > price && ((originalPrice - price) / originalPrice) >= 0.1) {
    return 'تخفيضات';
  }

  if (orders > 100 && likes > 200) {
    return 'مميزة';
  }

  if (orders > 100) {
    return 'أكثر مبيعاً';
  }

  if (likes > 200) {
    return 'أكثر إعجاباً';
  }

  if (views > 400) {
    return 'أكثر مشاهدة';
  }

  if (orders > 50) {
    return 'أكثر طلباً';
  }

  if (isNew || (orders === 0 && likes === 0 && views === 0)) {
    return 'جديد';
  }

  return 'جديد';
}

export function applyAutoBadges(products: any[]): any[] {
  return products.map(product => {
    const finalBadge = product.badge || calculateBadge(product);
    return {
      ...product,
      badge: finalBadge,
      tags: product.tags ? [...new Set([...product.tags, finalBadge])] : [finalBadge]
    };
  });
}

export function getTagColor(badge: string): { className: string; style: React.CSSProperties } {
  const colorMap: Record<string, { className: string; style: React.CSSProperties }> = {
    'جديد': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#008080' }
    },
    'أكثر مبيعاً': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#FF6B6B' }
    },
    'أكثر إعجاباً': { 
      className: 'text-black px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#FFD700' }
    },
    'مميزة': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#808000' }
    },
    'أكثر مشاهدة': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#000080' }
    },
    'أكثر طلباً': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#FF7F50' }
    },
    'تخفيضات': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#FF1493' }
    },
    'غير متوفر': { 
      className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold',
      style: { backgroundColor: '#FF6347' }
    }
  };
  
  return colorMap[badge] || { 
    className: 'text-white px-2 py-1 rounded-lg text-xs font-semibold bg-gray-500',
    style: {}
  };
}

export function getStockStatus(quantity: number, threshold: number = 5): 'available' | 'low' | 'unavailable' {
  if (quantity <= 0) return 'unavailable';
  if (quantity < threshold) return 'low';
  return 'available';
}

export function getButtonConfig(quantity: number) {
  const status = getStockStatus(quantity);
  
  if (status === 'unavailable') {
    return {
      status,
      buttonText: '🔔 نبهني عند التوفر',
      buttonClassName: 'bg-orange-700 hover:bg-orange-800 text-white font-semibold px-4 py-2 rounded-lg',
      isDisabled: false,
      emoji: '🔔',
      productState: 'out_of_stock'
    };
  }
  
  if (status === 'low') {
    return {
      status,
      buttonText: 'أضف للسلة',
      buttonClassName: 'bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg',
      isDisabled: false,
      emoji: '⚠️',
      productState: 'low_stock'
    };
  }
  
  return {
    status,
    buttonText: 'أضف للسلة',
    buttonClassName: 'bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg',
    isDisabled: false,
    emoji: '🛒',
    productState: 'available'
  };
}
