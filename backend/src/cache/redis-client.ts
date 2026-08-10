/**
 * Redis client — connection pool and configuration for caching layer.
 *
 * Features:
 *  - Singleton connection pool
 *  - Graceful fallback to in-memory cache if Redis unavailable
 *  - Automatic reconnection
 *  - Health check monitoring
 */

import { createClient, type RedisClientType } from 'redis';

// Simple console-based logging for cache operations
const debugLog = (message: string, context?: Record<string, unknown>) => {
  if (process.env.DEBUG_CACHE) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), message, ...context }));
  }
};

const errorLog = (message: string, context?: Record<string, unknown>) => {
  console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: 'error', message, ...context }));
};

const infoLog = (message: string, context?: Record<string, unknown>) => {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'info', message, ...context }));
};

type RedisClient = RedisClientType;

let redisClient: RedisClient | null = null;
let isRedisAvailable = false;
let inMemoryCache = new Map<string, { value: unknown; expireAt: number }>();

const REDIS_RECONNECT_INTERVAL = 5000; // 5 seconds
const REDIS_COMMAND_TIMEOUT = 2000; // 2 seconds

// ─── Redis Connection ────────────────────────────────────────────────────────

/**
 * Initialize Redis connection pool.
 * Falls back to in-memory cache if Redis is unavailable.
 */
export async function initializeRedis(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    infoLog('REDIS_URL not configured — using in-memory cache fallback');
    isRedisAvailable = false;
    return;
  }

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            errorLog('Redis reconnect failed after 10 retries — using in-memory fallback');
            return new Error('Redis reconnection limit exceeded');
          }
          return Math.min(retries * 100, REDIS_RECONNECT_INTERVAL);
        },
        connectTimeout: 5000,
      },
      commandsQueueMaxLength: 100,
    });

    redisClient.on('error', (err) => {
      errorLog('Redis client error', { error: err.message });
      isRedisAvailable = false;
    });

    redisClient.on('connect', () => {
      infoLog('Redis client connected');
      isRedisAvailable = true;
    });

    redisClient.on('reconnecting', () => {
      debugLog('Redis client reconnecting...');
    });

    await redisClient.connect();
    isRedisAvailable = true;
    infoLog('Redis cache initialized successfully');
  } catch (err) {
    errorLog('Failed to initialize Redis — using in-memory fallback', {
      error: err instanceof Error ? err.message : String(err),
    });
    isRedisAvailable = false;
    redisClient = null;
  }
}

/**
 * Gracefully close Redis connection.
 */
export async function closeRedis(): Promise<void> {
  if (redisClient && isRedisAvailable) {
    try {
      await redisClient.quit();
      infoLog('Redis connection closed');
    } catch (err) {
      errorLog('Error closing Redis connection', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

/**
 * Get value from cache (Redis or in-memory fallback).
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    if (isRedisAvailable && redisClient) {
      const value = await Promise.race([
        redisClient.get(key),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Redis command timeout')), REDIS_COMMAND_TIMEOUT),
        ),
      ]);

      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    }
  } catch (err) {
    debugLog('Redis get error — falling back to in-memory', {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // In-memory fallback
  const inMemEntry = inMemoryCache.get(key);
  if (inMemEntry && inMemEntry.expireAt > Date.now()) {
    return inMemEntry.value as T;
  }
  if (inMemEntry) {
    inMemoryCache.delete(key);
  }
  return null;
}

/**
 * Set value in cache with TTL (Time To Live).
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  try {
    if (isRedisAvailable && redisClient) {
      await Promise.race([
        redisClient.setEx(key, ttlSeconds, JSON.stringify(value)),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Redis command timeout')), REDIS_COMMAND_TIMEOUT),
        ),
      ]);
      return;
    }
  } catch (err) {
    debugLog('Redis set error — falling back to in-memory', {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // In-memory fallback
  inMemoryCache.set(key, {
    value,
    expireAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Delete value from cache.
 */
export async function cacheDelete(key: string): Promise<void> {
  try {
    if (isRedisAvailable && redisClient) {
      await Promise.race([
        redisClient.del(key),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Redis command timeout')), REDIS_COMMAND_TIMEOUT),
        ),
      ]);
      return;
    }
  } catch (err) {
    debugLog('Redis delete error — falling back to in-memory', {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // In-memory fallback
  inMemoryCache.delete(key);
}

/**
 * Delete multiple keys (pattern-based or explicit list).
 */
export async function cacheDeleteMany(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  try {
    if (isRedisAvailable && redisClient) {
      await Promise.race([
        redisClient.del(keys),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Redis command timeout')), REDIS_COMMAND_TIMEOUT),
        ),
      ]);
      return;
    }
  } catch (err) {
    debugLog('Redis delete many error — falling back to in-memory', {
      keyCount: keys.length,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // In-memory fallback
  keys.forEach((key) => inMemoryCache.delete(key));
}

/**
 * Clear all cache entries.
 */
export async function cacheClear(): Promise<void> {
  try {
    if (isRedisAvailable && redisClient) {
      await Promise.race([
        redisClient.flushDb(),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Redis command timeout')), REDIS_COMMAND_TIMEOUT),
        ),
      ]);
      return;
    }
  } catch (err) {
    debugLog('Redis clear error — falling back to in-memory', {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // In-memory fallback
  inMemoryCache.clear();
}

/**
 * Check Redis availability and health.
 */
export function isRedisHealthy(): boolean {
  return isRedisAvailable;
}

/**
 * Get in-memory cache size (for monitoring).
 */
export function getInMemoryCacheSize(): number {
  return inMemoryCache.size;
}

/**
 * Cleanup expired in-memory entries (run periodically).
 */
export function pruneInMemoryCache(): void {
  const now = Date.now();
  let pruned = 0;

  for (const [key, entry] of inMemoryCache.entries()) {
    if (entry.expireAt <= now) {
      inMemoryCache.delete(key);
      pruned++;
    }
  }

  if (pruned > 0) {
    debugLog('Pruned in-memory cache', { pruned, remaining: inMemoryCache.size });
  }
}
