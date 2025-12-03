interface StoreSyncData {
  storeSlug: string;
  lastSyncTime: number;
  products: any[];
  warehouses: any[];
  categories: any[];
  inventory: any;
}

interface SyncStatus {
  isLoading: boolean;
  lastSync: number | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  error: string | null;
}

export class StoreSyncManager {
  private static readonly SYNC_INTERVAL = 5 * 60 * 1000;
  private static readonly STORAGE_KEY = 'store_sync_data';
  private static syncTimers: Map<string, NodeJS.Timeout> = new Map();

  static getSyncStorageKey(storeSlug: string): string {
    return `${this.STORAGE_KEY}_${storeSlug}`;
  }

  static async syncStoreData(storeSlug: string): Promise<StoreSyncData | null> {
    try {
      const stored = localStorage.getItem(this.getSyncStorageKey(storeSlug));
      const syncData: StoreSyncData = stored ? JSON.parse(stored) : {
        storeSlug,
        lastSyncTime: Date.now(),
        products: [],
        warehouses: [],
        categories: [],
        inventory: {}
      };

      const productsKey = `store_products_${storeSlug}`;
      const slidersKey = `store_sliders_${storeSlug}`;
      const warehousesKey = `store_warehouses_${storeSlug}`;
      const categoriesKey = `store_categories_${storeSlug}`;

      const products = localStorage.getItem(productsKey);
      const warehouses = localStorage.getItem(warehousesKey);
      const categories = localStorage.getItem(categoriesKey);

      if (products) {
        try {
          syncData.products = JSON.parse(products);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Failed to parse products for ${storeSlug}:`, e);
        }
      }

      if (warehouses) {
        try {
          syncData.warehouses = JSON.parse(warehouses);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Failed to parse warehouses for ${storeSlug}:`, e);
        }
      }

      if (categories) {
        try {
          syncData.categories = JSON.parse(categories);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Failed to parse categories for ${storeSlug}:`, e);
        }
      }

      syncData.lastSyncTime = Date.now();
      localStorage.setItem(this.getSyncStorageKey(storeSlug), JSON.stringify(syncData));

      // eslint-disable-next-line no-console
      console.log(`✅ Store data synced for ${storeSlug}:`, syncData);
      return syncData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to sync store data for ${storeSlug}:`, error);
      return null;
    }
  }

  static getWarehouseInventoryStatus(storeSlug: string, warehouseId?: string): any {
    const storageKey = `store_inventory_${storeSlug}${warehouseId ? `_${warehouseId}` : ''}`;
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return {
        totalProducts: 0,
        lowStockItems: 0,
        outOfStock: 0,
        totalValue: 0,
        warehouses: []
      };
    }

    try {
      return JSON.parse(stored);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Failed to parse inventory for ${storeSlug}:`, e);
      return null;
    }
  }

  static updateWarehouseStock(
    storeSlug: string,
    warehouseId: string,
    productId: string,
    quantity: number
  ): boolean {
    try {
      const storageKey = `store_inventory_${storeSlug}_${warehouseId}`;
      const stored = localStorage.getItem(storageKey);
      const inventory = stored ? JSON.parse(stored) : {};

      if (!inventory.products) {
        inventory.products = {};
      }

      inventory.products[productId] = {
        quantity,
        lastUpdated: Date.now(),
        warehouseId
      };

      inventory.lastUpdated = Date.now();
      localStorage.setItem(storageKey, JSON.stringify(inventory));

      // eslint-disable-next-line no-console
      console.log(`✅ Stock updated for product ${productId} in warehouse ${warehouseId}`);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to update warehouse stock:`, error);
      return false;
    }
  }

  static setupAutoSync(storeSlug: string, interval?: number): void {
    if (this.syncTimers.has(storeSlug)) {
      return;
    }

    const syncInterval = interval || this.SYNC_INTERVAL;
    const timer = setInterval(() => {
      this.syncStoreData(storeSlug);
    }, syncInterval);

    this.syncTimers.set(storeSlug, timer);
    this.syncStoreData(storeSlug);

    // eslint-disable-next-line no-console
    console.log(`⏱️ Auto-sync enabled for ${storeSlug} every ${syncInterval}ms`);
  }

  static stopAutoSync(storeSlug: string): void {
    const timer = this.syncTimers.get(storeSlug);
    if (timer) {
      clearInterval(timer);
      this.syncTimers.delete(storeSlug);
      // eslint-disable-next-line no-console
      console.log(`⏹️ Auto-sync stopped for ${storeSlug}`);
    }
  }

  static getProductsByCategory(storeSlug: string, categoryId: string): any[] {
    const storageKey = `store_products_${storeSlug}`;
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return [];
    }

    try {
      const products = JSON.parse(stored);
      return products.filter((p: any) => p.category === categoryId || p.categoryId === categoryId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Failed to get products by category:`, e);
      return [];
    }
  }

  static getProductInventoryStatus(storeSlug: string, productId: string): any {
    const storageKey = `store_inventory_${storeSlug}`;
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return null;
    }

    try {
      const inventory = JSON.parse(stored);
      const warehouses = inventory.warehouses || [];

      const totalQuantity = warehouses.reduce((sum: number, wh: any) => {
        const productInventory = wh.products?.[productId];
        return sum + (productInventory?.quantity || 0);
      }, 0);

      return {
        productId,
        totalQuantity,
        warehouses: warehouses.map((wh: any) => ({
          id: wh.id,
          name: wh.name,
          quantity: wh.products?.[productId]?.quantity || 0
        }))
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Failed to get product inventory status:`, e);
      return null;
    }
  }

  static clearStoreSync(storeSlug: string): void {
    this.stopAutoSync(storeSlug);
    localStorage.removeItem(this.getSyncStorageKey(storeSlug));
    // eslint-disable-next-line no-console
    console.log(`🗑️ Store sync data cleared for ${storeSlug}`);
  }
}

export default StoreSyncManager;
