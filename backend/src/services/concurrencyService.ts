import sequelize from '@config/database';
import logger from '@utils/logger';

interface TransactionOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class ConcurrencyService {
  private locks: Map<string, Promise<void>> = new Map();
  private lockTimeouts: Map<string, NodeJS.Timeout> = new Map();

  async executeWithTransaction<T>(
    callback: (transaction: any) => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    const { timeout = 30000, retries = 3, retryDelay = 1000 } = options;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await sequelize.transaction({ timeout }, async (t) => {
          return await callback(t);
        });
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries) {
          logger.warn(`Transaction attempt ${attempt} failed, retrying in ${retryDelay}ms:`, lastError.message);
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }

    throw new Error(`Transaction failed after ${retries} attempts: ${lastError?.message}`);
  }

  async executeMutuallyExclusive<T>(
    lockKey: string,
    callback: () => Promise<T>,
    timeout: number = 30000
  ): Promise<T> {
    while (this.locks.has(lockKey)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const lockPromise = new Promise<void>(resolve => {
      const timeoutHandle = setTimeout(() => {
        this.locks.delete(lockKey);
        this.lockTimeouts.delete(lockKey);
        logger.warn(`Lock ${lockKey} released due to timeout`);
        resolve();
      }, timeout);

      this.lockTimeouts.set(lockKey, timeoutHandle);
      this.locks.set(lockKey, new Promise(res => {
        resolve();
        res();
      }));
    });

    try {
      this.locks.set(lockKey, lockPromise);
      const result = await callback();
      return result;
    } finally {
      const timeoutHandle = this.lockTimeouts.get(lockKey);
      if (timeoutHandle) clearTimeout(timeoutHandle);
      this.locks.delete(lockKey);
      this.lockTimeouts.delete(lockKey);
    }
  }

  async batchUpdate<T extends { id: string | number }>(
    items: T[],
    updateFn: (item: T, transaction: any) => Promise<void>,
    batchSize: number = 10
  ): Promise<void> {
    const batches = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await this.executeWithTransaction(async (t) => {
        await Promise.all(
          batch.map(item => updateFn(item, t))
        );
      });
    }

    logger.info(`Batch updated ${items.length} items in ${batches.length} batches`);
  }

  async getWithLock<T>(
    lockKey: string,
    getFn: () => Promise<T>,
    timeout: number = 30000
  ): Promise<T> {
    return this.executeMutuallyExclusive(lockKey, getFn, timeout);
  }

  async setWithLock(
    lockKey: string,
    setFn: () => Promise<void>,
    timeout: number = 30000
  ): Promise<void> {
    return this.executeMutuallyExclusive(lockKey, setFn, timeout);
  }

  async acquireLock(lockKey: string, timeout: number = 30000): Promise<() => void> {
    const releaser = async () => {
      const timeoutHandle = this.lockTimeouts.get(lockKey);
      if (timeoutHandle) clearTimeout(timeoutHandle);
      this.locks.delete(lockKey);
      this.lockTimeouts.delete(lockKey);
    };

    await this.executeMutuallyExclusive(lockKey, async () => {
      return new Promise(resolve => setTimeout(resolve, 0));
    }, timeout);

    return releaser;
  }

  async parallelizeWithLimit<T, R>(
    items: T[],
    asyncFn: (item: T) => Promise<R>,
    concurrencyLimit: number = 5
  ): Promise<R[]> {
    const results: R[] = [];
    const executing: Promise<void>[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      const promise = Promise.resolve().then(async () => {
        results[i] = await asyncFn(item);
      });

      executing.push(promise);

      if (executing.length >= concurrencyLimit) {
        await Promise.race(executing);
        executing.splice(executing.indexOf(promise), 1);
      }
    }

    await Promise.all(executing);
    return results;
  }

  clearAllLocks(): void {
    this.locks.forEach((_, key) => {
      const timeoutHandle = this.lockTimeouts.get(key);
      if (timeoutHandle) clearTimeout(timeoutHandle);
    });
    this.locks.clear();
    this.lockTimeouts.clear();
    logger.info('All locks cleared');
  }
}

export default new ConcurrencyService();
