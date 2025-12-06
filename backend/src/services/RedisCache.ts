import redis from 'redis';
import logger from '@utils/logger';

export interface CacheOptions {
  ttl?: number;
  type?: string;
}

export class RedisCache {
  private client: redis.RedisClient;
  private isConnected: boolean = false;

  private defaultTTL: Record<string, number> = {
    product: 3600,
    category: 7200,
    user: 1800,
    store: 3600,
    search: 300,
    stats: 600,
    default: 3600,
  };

  constructor(
    private host: string = process.env.REDIS_HOST || 'localhost',
    private port: number = parseInt(process.env.REDIS_PORT || '6379', 10),
    private password?: string,
    private db: number = parseInt(process.env.REDIS_DB || '0', 10)
  ) {
    this.client = redis.createClient({
      host: this.host,
      port: this.port,
      password: this.password,
      db: this.db,
      retry_strategy: (options) => {
        if (options.error?.code === 'ECONNREFUSED') {
          logger.warn('Redis connection refused, retrying...');
          return Math.min(options.attempt * 100, 3000);
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', (err) => {
      logger.error('Redis error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      logger.info('Redis connected');
      this.isConnected = true;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    this.client.on('end', () => {
      logger.info('Redis connection closed');
      this.isConnected = false;
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) return null;

      return new Promise((resolve, reject) => {
        this.client.get(key, (err, data) => {
          if (err) {
            logger.error(`Redis GET error for key ${key}:`, err);
            reject(err);
          } else if (data) {
            try {
              resolve(JSON.parse(data) as T);
            } catch (parseErr) {
              logger.error(`Redis JSON parse error for key ${key}:`, parseErr);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      logger.error('Redis get operation failed:', error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      if (!this.isConnected) return;

      const ttl = options.ttl || this.defaultTTL[options.type || 'default'] || 3600;
      const serialized = JSON.stringify(value);

      return new Promise((resolve, reject) => {
        this.client.setex(key, ttl, serialized, (err) => {
          if (err) {
            logger.error(`Redis SET error for key ${key}:`, err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      logger.error('Redis set operation failed:', error);
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (!this.isConnected) return keys.map(() => null);

      return new Promise((resolve, reject) => {
        this.client.mget(...keys, (err, data) => {
          if (err) {
            logger.error('Redis MGET error:', err);
            reject(err);
          } else {
            resolve(
              (data || []).map((item) => {
                if (!item) return null;
                try {
                  return JSON.parse(item) as T;
                } catch {
                  return null;
                }
              })
            );
          }
        });
      });
    } catch (error) {
      logger.error('Redis mget operation failed:', error);
      return keys.map(() => null);
    }
  }

  async mset(keyValuePairs: Array<[string, any]>, type: string = 'default'): Promise<void> {
    try {
      if (!this.isConnected) return;

      const ttl = this.defaultTTL[type] || 3600;
      const promises = keyValuePairs.map(([key, value]) =>
        this.set(key, value, { ttl, type })
      );

      await Promise.all(promises);
    } catch (error) {
      logger.error('Redis mset operation failed:', error);
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;

      return new Promise((resolve, reject) => {
        this.client.del(key, (err, reply) => {
          if (err) {
            logger.error(`Redis DEL error for key ${key}:`, err);
            reject(err);
          } else {
            resolve((reply as number) > 0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis delete operation failed:', error);
      return false;
    }
  }

  async deleteMultiple(keys: string[]): Promise<number> {
    try {
      if (!this.isConnected) return 0;

      return new Promise((resolve, reject) => {
        this.client.del(...keys, (err, reply) => {
          if (err) {
            logger.error('Redis MDEL error:', err);
            reject(err);
          } else {
            resolve((reply as number) || 0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis delete multiple operation failed:', error);
      return 0;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    try {
      if (!this.isConnected) return 0;

      return new Promise((resolve, reject) => {
        this.client.keys(pattern, (err, keys) => {
          if (err) {
            logger.error(`Redis KEYS error for pattern ${pattern}:`, err);
            reject(err);
          } else if (keys && keys.length > 0) {
            this.client.del(...keys, (delErr, reply) => {
              if (delErr) {
                reject(delErr);
              } else {
                resolve((reply as number) || 0);
              }
            });
          } else {
            resolve(0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis invalidate pattern operation failed:', error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) return false;

      return new Promise((resolve, reject) => {
        this.client.exists(key, (err, reply) => {
          if (err) {
            logger.error(`Redis EXISTS error for key ${key}:`, err);
            reject(err);
          } else {
            resolve((reply as number) > 0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis exists operation failed:', error);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      if (!this.isConnected) return 0;

      return new Promise((resolve, reject) => {
        this.client.incr(key, (err, reply) => {
          if (err) {
            logger.error(`Redis INCR error for key ${key}:`, err);
            reject(err);
          } else {
            resolve((reply as number) || 0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis incr operation failed:', error);
      return 0;
    }
  }

  async decr(key: string): Promise<number> {
    try {
      if (!this.isConnected) return 0;

      return new Promise((resolve, reject) => {
        this.client.decr(key, (err, reply) => {
          if (err) {
            logger.error(`Redis DECR error for key ${key}:`, err);
            reject(err);
          } else {
            resolve((reply as number) || 0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis decr operation failed:', error);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      if (!this.isConnected) return false;

      return new Promise((resolve, reject) => {
        this.client.expire(key, seconds, (err, reply) => {
          if (err) {
            logger.error(`Redis EXPIRE error for key ${key}:`, err);
            reject(err);
          } else {
            resolve((reply as number) > 0);
          }
        });
      });
    } catch (error) {
      logger.error('Redis expire operation failed:', error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      if (!this.isConnected) return -1;

      return new Promise((resolve, reject) => {
        this.client.ttl(key, (err, reply) => {
          if (err) {
            logger.error(`Redis TTL error for key ${key}:`, err);
            reject(err);
          } else {
            resolve((reply as number) || -1);
          }
        });
      });
    } catch (error) {
      logger.error('Redis ttl operation failed:', error);
      return -1;
    }
  }

  async flush(): Promise<void> {
    try {
      if (!this.isConnected) return;

      return new Promise((resolve, reject) => {
        this.client.flushdb((err) => {
          if (err) {
            logger.error('Redis FLUSHDB error:', err);
            reject(err);
          } else {
            logger.info('Redis database flushed');
            resolve();
          }
        });
      });
    } catch (error) {
      logger.error('Redis flush operation failed:', error);
    }
  }

  async getStats(): Promise<Record<string, any>> {
    try {
      if (!this.isConnected) return {};

      return new Promise((resolve, reject) => {
        this.client.info('stats', (err, info) => {
          if (err) {
            logger.error('Redis INFO error:', err);
            reject(err);
          } else {
            resolve({ connected: this.isConnected, info });
          }
        });
      });
    } catch (error) {
      logger.error('Redis get stats operation failed:', error);
      return {};
    }
  }

  isReady(): boolean {
    return this.isConnected;
  }

  close(): void {
    if (this.client) {
      this.client.quit((err) => {
        if (err) {
          logger.error('Error closing Redis connection:', err);
        } else {
          logger.info('Redis connection closed gracefully');
        }
      });
    }
  }
}

export const cache = new RedisCache();
export default RedisCache;
