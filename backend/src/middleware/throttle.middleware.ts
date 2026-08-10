/**
 * Throttle middleware — request throttling with burst control.
 *
 * Implements token bucket algorithm for smooth rate limiting:
 *  - Allows short bursts of requests
 *  - Enforces sustained rate limits
 *  - Returns 429 with Retry-After header when throttled
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PlatformError } from '../shared/errors.js';

// ─── Throttle configuration ────────────────────────────────────────────────────

export interface ThrottleConfig {
  bucketSize: number; // Maximum burst size
  refillRate: number; // Tokens per second
  message?: string;
}

export interface ThrottleOptions {
  default?: ThrottleConfig;
  strict?: ThrottleConfig; // For sensitive endpoints
  permissive?: ThrottleConfig; // For public endpoints
}

const DEFAULT_THROTTLE_CONFIG: Required<ThrottleOptions> = {
  default: { bucketSize: 10, refillRate: 1, message: 'Request throttled. Please slow down.' },
  strict: { bucketSize: 5, refillRate: 0.5, message: 'Too many requests. Please wait before retrying.' },
  permissive: { bucketSize: 20, refillRate: 2, message: 'Request throttled. Please slow down.' },
};

// ─── Token bucket store ────────────────────────────────────────────────────────

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const bucketStore = new Map<string, TokenBucket>();

// Clean up expired buckets every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of bucketStore) {
    // Remove buckets that haven't been used in 1 hour
    if (now - bucket.lastRefill > 3600_000) {
      bucketStore.delete(key);
    }
  }
}, 10 * 60_000).unref();

// ─── Helper functions ──────────────────────────────────────────────────────────

function clientIp(request: FastifyRequest): string {
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return (first ?? 'unknown').trim();
  }
  return request.ip ?? 'unknown';
}

function getBucket(key: string, config: ThrottleConfig): TokenBucket {
  let bucket = bucketStore.get(key);
  const now = Date.now();

  if (!bucket) {
    bucket = { tokens: config.bucketSize, lastRefill: now };
    bucketStore.set(key, bucket);
    return bucket;
  }

  // Refill tokens based on elapsed time
  const elapsed = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = elapsed * config.refillRate;
  bucket.tokens = Math.min(config.bucketSize, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  return bucket;
}

function consumeToken(bucket: TokenBucket): boolean {
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}

function getEndpointThrottleType(url: string): 'default' | 'strict' | 'permissive' {
  if (url.startsWith('/api/v1/admin') || url.startsWith('/api/v1/gateway/call')) return 'strict';
  if (url.startsWith('/api/v1/platform') || url.startsWith('/api/v1/health')) return 'permissive';
  return 'default';
}

// ─── Throttle middleware registration ─────────────────────────────────────────

export function registerThrottleMiddleware(app: FastifyInstance, options: ThrottleOptions = {}): void {
  const config = { ...DEFAULT_THROTTLE_CONFIG, ...options };

  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = clientIp(request);
    const throttleType = getEndpointThrottleType(request.url);
    const throttleConfig = config[throttleType]!;

    const bucketKey = `throttle:${ip}:${throttleType}`;
    const bucket = getBucket(bucketKey, throttleConfig);

    if (!consumeToken(bucket)) {
      // Calculate retry-after based on refill rate
      const retryAfter = Math.ceil(1 / throttleConfig.refillRate);
      reply
        .header('Retry-After', String(retryAfter))
        .header('X-Throttle-Limit', String(throttleConfig.bucketSize))
        .header('X-Throttle-Remaining', '0');
      throw new PlatformError(429, 'THROTTLED', throttleConfig.message ?? 'Request throttled. Please slow down.');
    }

    // Add throttle headers
    reply
      .header('X-Throttle-Limit', String(throttleConfig.bucketSize))
      .header('X-Throttle-Remaining', String(Math.floor(bucket.tokens)));
  });
}
