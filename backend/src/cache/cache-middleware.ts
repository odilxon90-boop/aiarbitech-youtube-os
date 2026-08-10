/**
 * Cache middleware — automatic caching for GET requests.
 *
 * Intercepts GET requests and:
 *  1. Checks cache for existing response
 *  2. Returns cached response if available
 *  3. Falls through to handler if cache miss
 *  4. Caches response before sending
 *
 * Cacheable endpoints are defined with metadata.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { cacheGet, cacheSet, isRedisHealthy } from './redis-client.js';

// Simple debug logging
const debugLog = (message: string, context?: Record<string, unknown>) => {
  if (process.env.DEBUG_CACHE) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), message, ...context }));
  }
};

// ─── Cache metadata ─────────────────────────────────────────────────────────

interface CacheConfig {
  key: (request: FastifyRequest) => string;
  ttl: number; // seconds
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  // Dashboard
  'GET /api/v1/dashboard/summary': {
    key: (req) => `cache:dashboard:summary:${req.auth?.subject || 'anon'}`,
    ttl: 60,
  },
  'GET /api/v1/dashboard/metrics': {
    key: (req) => `cache:dashboard:metrics:${req.auth?.subject || 'anon'}`,
    ttl: 60,
  },

  // Analytics
  'GET /api/v1/analytics/trends': {
    key: (req) => `cache:analytics:trends:${req.auth?.subject || 'anon'}`,
    ttl: 180,
  },
  'GET /api/v1/analytics/performance': {
    key: (req) => `cache:analytics:performance:${req.auth?.subject || 'anon'}`,
    ttl: 180,
  },

  // Genre
  'GET /api/v1/genre/trends': {
    key: () => 'cache:genre:trends',
    ttl: 300,
  },
  'GET /api/v1/genre/recommendations': {
    key: (req) => `cache:genre:recommendations:${req.auth?.subject || 'anon'}`,
    ttl: 300,
  },

  // Intelligence
  'GET /api/v1/intelligence/profile': {
    key: (req) => `cache:intelligence:profile:${req.auth?.subject || 'anon'}`,
    ttl: 120,
  },
  'GET /api/v1/intelligence/analysis': {
    key: (req) => `cache:intelligence:analysis:${req.auth?.subject || 'anon'}`,
    ttl: 120,
  },

  // Memory
  'GET /api/v1/memory/summary': {
    key: (req) => `cache:memory:summary:${req.auth?.subject || 'anon'}`,
    ttl: 180,
  },

  // Goals (read-only)
  'GET /api/v1/goals/list': {
    key: (req) => `cache:goals:list:${req.auth?.subject || 'anon'}`,
    ttl: 180,
  },

  // Video
  'GET /api/v1/video/suggestions': {
    key: (req) => `cache:video:suggestions:${req.auth?.subject || 'anon'}`,
    ttl: 180,
  },

  // Gateway
  'GET /api/v1/gateway/status': {
    key: () => 'cache:gateway:status',
    ttl: 30,
  },
  'GET /api/v1/gateway/health': {
    key: () => 'cache:gateway:health',
    ttl: 60,
  },
  'GET /api/v1/gateway/endpoints': {
    key: () => 'cache:gateway:endpoints',
    ttl: 30,
  },

  // Admin
  'GET /api/v1/admin/stats': {
    key: () => 'cache:admin:stats',
    ttl: 300,
  },
};

// ─── Helper: Should cache this request? ──────────────────────────────────────

function isCacheable(request: FastifyRequest): boolean {
  // Only cache GET requests
  if (request.method !== 'GET') {
    return false;
  }

  // Only cache if Redis is available or in-memory cache is active
  if (!isRedisHealthy()) {
    return false;
  }

  // Don't cache if explicitly disabled via query param
  if (request.query && (request.query as Record<string, unknown>)['no-cache'] !== undefined) {
    return false;
  }

  return true;
}

// ─── Helper: Get cache config for route ────────────────────────────────────

function getCacheConfig(request: FastifyRequest): CacheConfig | null {
  // Match route pattern
  const urlPath = request.url.split('?')[0] || '/';
  const routeKey = `${request.method} ${urlPath}`;

  // Exact match
  if (CACHE_CONFIGS[routeKey]) {
    return CACHE_CONFIGS[routeKey];
  }

  // Pattern match (for routes with params)
  for (const [pattern, config] of Object.entries(CACHE_CONFIGS)) {
    const spaceIndex = pattern.indexOf(' ');
    if (spaceIndex === -1) continue;

    const method = pattern.substring(0, spaceIndex);
    const path = pattern.substring(spaceIndex + 1);

    if (method === request.method) {
      // Simple pattern matching: /api/v1/goals/list matches /api/v1/goals/:id
      const pathRegex = new RegExp(`^${path.replace(/:[\w]+/g, '[^/]+').replace(/\//g, '\\/')}$`);
      if (pathRegex.test(urlPath)) {
        return config;
      }
    }
  }

  return null;
}

// ─── Cache middleware hook ──────────────────────────────────────────────────

export function registerCacheMiddleware(app: FastifyInstance): void {
  // Pre-handler: Check cache
  app.addHook('onRequest', async (request, reply) => {
    if (!isCacheable(request)) {
      return;
    }

    const config = getCacheConfig(request);
    if (!config) {
      return;
    }

    try {
      const cacheKey = config.key(request);
      const cachedResponse = await cacheGet<unknown>(cacheKey);

      if (cachedResponse) {
        debugLog('Cache hit', { method: request.method, url: request.url, cacheKey });
        reply.header('X-Cache', 'HIT').send(cachedResponse);
      }
    } catch (err) {
      debugLog('Cache retrieval error', {
        error: err instanceof Error ? err.message : String(err),
      });
      // Continue with normal request on cache error
    }
  });

  // Post-handler: Cache successful responses
  app.addHook('onSend', async (request, reply, payload) => {
    if (!isCacheable(request)) {
      return payload;
    }

    const config = getCacheConfig(request);
    if (!config) {
      return payload;
    }

    // Only cache successful responses (2xx, 3xx)
    if (reply.statusCode >= 400) {
      return payload;
    }

    try {
      const cacheKey = config.key(request);
      let responseData = payload;

      // Parse payload if it's a string (JSON)
      if (typeof payload === 'string') {
        try {
          responseData = JSON.parse(payload);
        } catch {
          // Not JSON, cache as-is
        }
      }

      await cacheSet(cacheKey, responseData, config.ttl);
      debugLog('Cache set', {
        method: request.method,
        url: request.url,
        cacheKey,
        ttl: config.ttl,
      });

      reply.header('X-Cache', 'SET');
    } catch (err) {
      debugLog('Cache set error', {
        error: err instanceof Error ? err.message : String(err),
      });
      // Continue — caching failure should not block response
    }

    return payload;
  });
}

// ─── Helper: Register cache config for custom routes ────────────────────────

export function registerCustomCacheConfig(pattern: string, config: CacheConfig): void {
  CACHE_CONFIGS[pattern] = config;
  debugLog('Custom cache config registered', { pattern, ttl: config.ttl });
}

// ─── Helper: Get current cache configs (for testing/debugging) ──────────────

export function getCacheConfigs(): Record<string, CacheConfig> {
  return { ...CACHE_CONFIGS };
}
