/**
 * Rate limiting middleware — configurable rate limiting for the YouTube OS backend.
 *
 * Supports:
 *  - Global rate limits
 *  - Per-endpoint limits (public, authenticated, AI, admin)
 *  - Per-user limits (by token or IP)
 *  - Whitelist/blacklist support
 *  - 429 Too Many Requests responses with proper headers
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PlatformError } from '../shared/errors.js';

// ─── Configuration ─────────────────────────────────────────────────────────────

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (request: FastifyRequest) => string;
}

export interface RateLimitOptions {
  global?: RateLimitConfig;
  public?: RateLimitConfig;
  authenticated?: RateLimitConfig;
  ai?: RateLimitConfig;
  admin?: RateLimitConfig;
  whitelist?: string[];
  blacklist?: string[];
}

const DEFAULT_CONFIG: Required<RateLimitOptions> = {
  global: { windowMs: 60_000, max: 100, message: 'Too many requests. Please slow down.' },
  public: { windowMs: 60_000, max: 100, message: 'Too many requests. Please slow down.' },
  authenticated: { windowMs: 60_000, max: 50, message: 'Too many requests. Please slow down.' },
  ai: { windowMs: 60_000, max: 20, message: 'AI endpoint rate limit exceeded. Please slow down.' },
  admin: { windowMs: 60_000, max: 100, message: 'Admin endpoint rate limit exceeded. Please slow down.' },
  whitelist: [],
  blacklist: [],
};

// ─── Rate limit store ──────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.windowStart > entry.windowMs) store.delete(key);
  }
}, 5 * 60_000).unref();

// Export function to clear store for testing
export function clearRateLimitStore(): void {
  store.clear();
}

// ─── Helper functions ──────────────────────────────────────────────────────────

function clientIp(request: FastifyRequest): string {
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return (first ?? 'unknown').trim();
  }
  return request.ip ?? 'unknown';
}

function clientKey(request: FastifyRequest): string {
  // Use auth token if available, otherwise IP
  const auth = request.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring(7);
  }
  return clientIp(request);
}

function getEndpointType(url: string): 'public' | 'authenticated' | 'ai' | 'admin' {
  if (url.startsWith('/api/v1/admin')) return 'admin';
  if (url.startsWith('/api/v1/ai-sync') || url.startsWith('/api/v1/assistant')) return 'ai';
  if (url.startsWith('/api/v1/platform') || url.startsWith('/api/v1/health')) return 'public';
  return 'authenticated';
}

function checkRateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > config.windowMs) {
    store.set(key, { count: 1, windowStart: now, windowMs: config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetTime: now + config.windowMs };
  }

  entry.count += 1;
  if (entry.count > config.max) {
    return { allowed: false, remaining: 0, resetTime: entry.windowStart + config.windowMs };
  }

  return { allowed: true, remaining: config.max - entry.count, resetTime: entry.windowStart + config.windowMs };
}

// ─── Rate limiting middleware registration ────────────────────────────────────

export function registerRateLimitMiddleware(app: FastifyInstance, options: RateLimitOptions = {}): void {
  const config = { ...DEFAULT_CONFIG, ...options };

  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = clientIp(request);

    // Check blacklist
    if (config.blacklist.includes(ip)) {
      throw new PlatformError(403, 'FORBIDDEN', 'Access denied.');
    }

    // Skip rate limiting for whitelisted IPs
    if (config.whitelist.includes(ip)) {
      return;
    }

    // Determine endpoint type and get appropriate config
    const endpointType = getEndpointType(request.url);
    const endpointConfig = config[endpointType]!;

    // Check per-user limit (by token or IP)
    const userKey = clientKey(request);
    const userLimitResult = checkRateLimit(`user:${userKey}`, {
      windowMs: 3600_000, // 1 hour
      max: 1000,
      message: 'Per-user rate limit exceeded.',
    });

    if (!userLimitResult.allowed) {
      const retryAfter = Math.ceil((userLimitResult.resetTime - Date.now()) / 1000);
      reply
        .header('Retry-After', String(retryAfter))
        .header('X-RateLimit-Limit', '1000')
        .header('X-RateLimit-Remaining', '0')
        .header('X-RateLimit-Reset', String(Math.ceil(userLimitResult.resetTime / 1000)));
      throw new PlatformError(429, 'RATE_LIMITED', 'Per-user rate limit exceeded. Please try again later.');
    }

    // Check endpoint-specific limit
    const endpointKey = `${ip}:${endpointType}`;
    const endpointLimitResult = checkRateLimit(endpointKey, endpointConfig);

    if (!endpointLimitResult.allowed) {
      const retryAfter = Math.ceil((endpointLimitResult.resetTime - Date.now()) / 1000);
      reply
        .header('Retry-After', String(retryAfter))
        .header('X-RateLimit-Limit', String(endpointConfig.max))
        .header('X-RateLimit-Remaining', '0')
        .header('X-RateLimit-Reset', String(Math.ceil(endpointLimitResult.resetTime / 1000)));
      throw new PlatformError(429, 'RATE_LIMITED', endpointConfig.message ?? 'Too many requests. Please slow down.');
    }

    // Add rate limit headers to response
    reply
      .header('X-RateLimit-Limit', String(endpointConfig.max))
      .header('X-RateLimit-Remaining', String(endpointLimitResult.remaining))
      .header('X-RateLimit-Reset', String(Math.ceil(endpointLimitResult.resetTime / 1000)));
  });
}

