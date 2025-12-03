// Store Integration Helper - يوفر دوال لتحسين التكامل بين واجهة المتجر وواجهة التاجر

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  storeId: number;
  storeName?: string;
  addedDate: string;
}

interface AbandonedCartItem {
  id: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  subtotal: number;
  abandonedAt: string;
  lastActivity: string;
  reminderCount: number;
  status: 'new' | 'reminded' | 'multiple_reminders' | 'recovered' | 'lost';
}

interface UnavailableItem {
  id: number;
  name: string;
  price: number;
  image: string;
  storeId: number;
  storeName?: string;
  notificationData: any;
  requestedAt: string;
}

interface InventoryAlert {
  productId: number;
  productName: string;
  currentQuantity: number;
  minimumThreshold: number;
  status: 'critical' | 'warning' | 'normal'; // أحمر/أصفر/أخضر
  color: 'red' | 'yellow' | 'green';
  storeId: number;
  storeName?: string;
}

export const StoreIntegrationHelper = {
  // الحصول على جميع المنتجات المفضلة
  getFavorites: (): FavoriteItem[] => {
    try {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem('eshro_favorites');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  },

  // الحصول على جميع الطلبات المتروكة
  getAbandonedCarts: (): AbandonedCartItem[] => {
    try {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem('eshro_abandoned_carts');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  },

  // الحصول على جميع المنتجات غير المتوفرة
  getUnavailableItems: (): UnavailableItem[] => {
    try {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem('eshro_unavailable');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  },

  // الحصول على تنبيهات المخزون
  getInventoryAlerts: (products: any[]): InventoryAlert[] => {
    const alerts: InventoryAlert[] = [];
    const minimumThreshold = 6; // الحد الأدنى المذكور من المستخدم

    products.forEach((product) => {
      const quantity = product.quantity || 0;
      let status: 'critical' | 'warning' | 'normal' = 'normal';
      let color: 'red' | 'yellow' | 'green' = 'green';

      if (quantity === 0) {
        status = 'critical';
        color = 'red';
      } else if (quantity < minimumThreshold) {
        status = 'warning';
        color = 'yellow';
      }

      alerts.push({
        productId: product.id,
        productName: product.name,
        currentQuantity: quantity,
        minimumThreshold,
        status,
        color,
        storeId: product.storeId,
        storeName: product.storeName
      });
    });

    return alerts;
  },

  // إضافة منتج إلى المفضلة
  addToFavorites: (product: any): void => {
    try {
      if (typeof window === 'undefined') return;
      const favorites = StoreIntegrationHelper.getFavorites();
      
      // تحقق من عدم وجود المنتج بالفعل
      if (favorites.some(f => f.id === product.id)) {
        return;
      }

      const newFavorite: FavoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        storeId: product.storeId,
        storeName: product.storeName,
        addedDate: new Date().toISOString()
      };

      favorites.push(newFavorite);
      localStorage.setItem('eshro_favorites', JSON.stringify(favorites));
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch {
      // Silent error handling
    }
  },

  // إزالة منتج من المفضلة
  removeFromFavorites: (productId: number): void => {
    try {
      if (typeof window === 'undefined') return;
      const favorites = StoreIntegrationHelper.getFavorites();
      const updated = favorites.filter(f => f.id !== productId);
      localStorage.setItem('eshro_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch {
      // Silent error handling
    }
  },

  // إضافة عنصر إلى الطلبات غير المتوفرة
  addUnavailableItem: (product: any, notificationData: any): void => {
    try {
      if (typeof window === 'undefined') return;
      const unavailableItems = StoreIntegrationHelper.getUnavailableItems();

      const newItem: UnavailableItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        storeId: product.storeId,
        storeName: product.storeName,
        notificationData,
        requestedAt: new Date().toISOString()
      };

      unavailableItems.push(newItem);
      localStorage.setItem('eshro_unavailable', JSON.stringify(unavailableItems));
      window.dispatchEvent(new Event('unavailableItemsUpdated'));
    } catch {
      // Silent error handling
    }
  },

  // إزالة عنصر من الطلبات غير المتوفرة
  removeUnavailableItem: (productId: number): void => {
    try {
      if (typeof window === 'undefined') return;
      const unavailableItems = StoreIntegrationHelper.getUnavailableItems();
      const updated = unavailableItems.filter(item => item.id !== productId);
      localStorage.setItem('eshro_unavailable', JSON.stringify(updated));
      window.dispatchEvent(new Event('unavailableItemsUpdated'));
    } catch {
      // Silent error handling
    }
  },

  // الحصول على ملخص إحصائي للبيانات
  getStoreIntegrationSummary: (storeId?: number) => {
    const favorites = StoreIntegrationHelper.getFavorites();
    const abandonedCarts = StoreIntegrationHelper.getAbandonedCarts();
    const unavailableItems = StoreIntegrationHelper.getUnavailableItems();

    let favCount = favorites.length;
    let cartCount = abandonedCarts.length;
    let unavailableCount = unavailableItems.length;

    if (storeId) {
      favCount = favorites.filter(f => f.storeId === storeId).length;
      cartCount = abandonedCarts.length; // الطلبات المتروكة عامة
      unavailableCount = unavailableItems.filter(u => u.storeId === storeId).length;
    }

    return {
      favorites: favCount,
      abandonedCarts: cartCount,
      unavailableItems: unavailableCount,
      totalAlerts: favCount + cartCount + unavailableCount
    };
  }
};

export type {
  FavoriteItem,
  AbandonedCartItem,
  UnavailableItem,
  InventoryAlert
};
