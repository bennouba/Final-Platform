const DB_NAME = 'EishroDb';
const STORE_NAME = 'categoryImages';
const DB_VERSION = 1;

interface StoredImage {
  key: string;
  data: string;
  timestamp: number;
}

class CategoryImageStorage {
  private db: IDBDatabase | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
    });
  }

  async save(key: string, imageData: string): Promise<void> {
    try {
      await this.init();

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record: StoredImage = {
        key,
        data: imageData,
        timestamp: Date.now()
      };

      const request = store.put(record);

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving image to IndexedDB:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      await this.init();

      if (!this.db) {
        return null;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      return new Promise((resolve) => {
        request.onerror = () => resolve(null);
        request.onsuccess = () => {
          const record = request.result as StoredImage | undefined;
          resolve(record?.data || null);
        };
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error retrieving image from IndexedDB:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.init();

      if (!this.db) return;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(key);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting image from IndexedDB:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.init();

      if (!this.db) return;

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error clearing IndexedDB:', error);
    }
  }

  async getSize(): Promise<number> {
    try {
      await this.init();

      if (!this.db) return 0;

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      return new Promise((resolve) => {
        request.onerror = () => resolve(0);
        request.onsuccess = () => {
          const records = request.result as StoredImage[];
          const totalSize = records.reduce((sum, record) => sum + record.data.length, 0);
          resolve(totalSize);
        };
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting IndexedDB size:', error);
      return 0;
    }
  }
}

export const categoryImageStorage = new CategoryImageStorage();
