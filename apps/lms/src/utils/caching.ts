/**
 * Simple in-memory cache for API responses
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default TTL

  /**
   * Get an item from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set an item in the cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
  }

  /**
   * Delete an item from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired items from the cache
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get the number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
export const apiCache = new ApiCache();

/**
 * Wrap an async function with caching
 */
export function withCache<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn: (...args: Args) => string,
  options: CacheOptions = {}
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const cacheKey = keyFn(...args);
    const cachedData = apiCache.get<T>(cacheKey);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    const data = await fn(...args);
    apiCache.set(cacheKey, data, options);
    return data;
  };
}

/**
 * Clear cache entries that match a key prefix
 */
export function clearCacheByPrefix(prefix: string): void {
  for (const [key] of apiCache['cache'].entries()) {
    if (key.startsWith(prefix)) {
      apiCache.delete(key);
    }
  }
}

// Set up automatic cache cleanup
setInterval(() => {
  apiCache.clearExpired();
}, 60 * 1000); // Run every minute 