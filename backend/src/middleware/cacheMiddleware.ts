import { Request, Response, NextFunction } from 'express';
import { cache } from '@services/RedisCache';
import logger from '@utils/logger';

export interface CacheConfig {
  type?: string;
  ttl?: number;
  keyGenerator?: (req: Request) => string;
  condition?: (req: Request, res: Response) => boolean;
}

/**
 * Cache middleware for GET requests
 * Stores responses in Redis with configurable TTL
 */
export const cacheMiddleware = (config: CacheConfig = {}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.method !== 'GET') {
        return next();
      }

      if (config.condition && !config.condition(req, res)) {
        return next();
      }

      const cacheKey = config.keyGenerator
        ? config.keyGenerator(req)
        : `route:${req.originalUrl}`;

      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        logger.debug(`Cache hit for ${cacheKey}`);
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);
        return res.json(cachedData);
      }

      logger.debug(`Cache miss for ${cacheKey}`);

      const originalJson = res.json.bind(res);
      res.json = function (body: any) {
        cache.set(cacheKey, body, {
          type: config.type,
          ttl: config.ttl,
        }).catch((err) => {
          logger.error(`Failed to cache response for ${cacheKey}:`, err);
        });

        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);
        return originalJson(body);
      } as any;

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Invalidate cache for specific route patterns
 */
export const invalidateCacheMiddleware = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalSend = res.send.bind(res);

    res.send = function (data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach(async (pattern) => {
          const count = await cache.invalidatePattern(pattern);
          logger.debug(`Invalidated ${count} cache entries matching pattern: ${pattern}`);
        });
      }
      return originalSend(data);
    };

    next();
  };
};

/**
 * Pre-configured cache strategies
 */
export const cacheStrategies = {
  product: (req: Request) => {
    return cacheMiddleware({
      type: 'product',
      ttl: 3600,
      keyGenerator: (r) => `product:${r.originalUrl}`,
      condition: (r) => !r.query.nocache,
    });
  },

  category: (req: Request) => {
    return cacheMiddleware({
      type: 'category',
      ttl: 7200,
      keyGenerator: (r) => `category:${r.originalUrl}`,
      condition: (r) => !r.query.nocache,
    });
  },

  search: (req: Request) => {
    return cacheMiddleware({
      type: 'search',
      ttl: 300,
      keyGenerator: (r) => `search:${r.originalUrl}`,
      condition: (r) => !r.query.nocache,
    });
  },

  stats: (req: Request) => {
    return cacheMiddleware({
      type: 'stats',
      ttl: 600,
      keyGenerator: (r) => `stats:${r.originalUrl}`,
      condition: (r) => !r.query.nocache,
    });
  },

  user: (req: Request) => {
    return cacheMiddleware({
      type: 'user',
      ttl: 1800,
      keyGenerator: (r) => `user:${r.user?.id}:${r.originalUrl}`,
      condition: (r) => !r.query.nocache && !!r.user,
    });
  },

  store: (req: Request) => {
    return cacheMiddleware({
      type: 'store',
      ttl: 3600,
      keyGenerator: (r) => `store:${r.params.storeId}:${r.originalUrl}`,
      condition: (r) => !r.query.nocache,
    });
  },

  noCache: (req: Request) => {
    return (req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-Cache', 'DISABLED');
      next();
    };
  },
};

/**
 * Cache invalidation for specific keys after mutations
 */
export const invalidateOnMutation = (keysToInvalidate: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.deleteMultiple(keysToInvalidate).then((count) => {
          logger.debug(`Invalidated ${count} cache keys after mutation`);
        }).catch((err) => {
          logger.error('Failed to invalidate cache keys:', err);
        });
      }
      return originalJson(body);
    } as any;

    next();
  };
};

/**
 * Cache statistics middleware
 * Tracks cache hits/misses for monitoring
 */
export let cacheStats = {
  hits: 0,
  misses: 0,
  getHitRate: () => {
    const total = cacheStats.hits + cacheStats.misses;
    return total > 0 ? ((cacheStats.hits / total) * 100).toFixed(2) : '0.00';
  },
  reset: () => {
    cacheStats.hits = 0;
    cacheStats.misses = 0;
  },
};

export const cacheStatsMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const original = res.setHeader;
    res.setHeader = function (name: string, value: string | number | readonly string[]) {
      if (name === 'X-Cache') {
        if (value === 'HIT') {
          cacheStats.hits++;
        } else if (value === 'MISS') {
          cacheStats.misses++;
        }
      }
      return original.call(this, name, value);
    };

    next();
  };
};

/**
 * Manual cache management endpoints (for admin)
 */
export const cacheManagementRoutes = {
  getStatus: async (req: Request, res: Response) => {
    try {
      const stats = await cache.getStats();
      res.json({
        connected: cache.isReady(),
        stats,
        hitRate: `${cacheStats.getHitRate()}%`,
        hits: cacheStats.hits,
        misses: cacheStats.misses,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get cache status' });
    }
  },

  flush: async (req: Request, res: Response) => {
    try {
      await cache.flush();
      cacheStats.reset();
      res.json({ message: 'Cache flushed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to flush cache' });
    }
  },

  invalidatePattern: async (req: Request, res: Response) => {
    try {
      const { pattern } = req.body;
      const count = await cache.invalidatePattern(pattern);
      res.json({ message: `Invalidated ${count} cache entries` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to invalidate cache pattern' });
    }
  },
};
