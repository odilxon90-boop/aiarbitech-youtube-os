import { describe, expect, it } from 'vitest';
import { NoopLogger } from '../shared/logger.js';
import type { CacheStore } from '../cache/warming.service.js';
import { CacheWarmingService } from '../cache/warming.service.js';

class MemoryCacheStore implements CacheStore {
  readonly values = new Map<string, string>();
  setAttempts = 0;
  failuresRemaining = 0;

  async set(key: string, value: string): Promise<void> {
    this.setAttempts += 1;
    if (this.failuresRemaining > 0) {
      this.failuresRemaining -= 1;
      throw new Error('Transient Redis failure');
    }
    this.values.set(key, value);
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  async disconnect(): Promise<void> {}
}

const config = {
  enabled: true,
  intervalSeconds: 900,
  maxItems: 100,
  retryAttempts: 3,
  ttlSeconds: 900,
};

describe('Cache warming service', () => {
  it('warms startup data by priority and reports healthy cache status', async () => {
    const cache = new MemoryCacheStore();
    const service = new CacheWarmingService(config, cache, new NoopLogger());

    await service.warmOnStartup();
    service.recordCacheResult(true);
    service.recordCacheResult(true);
    service.recordCacheResult(false);

    expect(cache.values.size).toBe(16);
    expect(cache.values.has('genre:popular:1')).toBe(true);
    expect(cache.values.has('dashboard:summary:admin')).toBe(true);
    expect(cache.values.has('channel:statistics:top:5')).toBe(true);
    await expect(service.health()).resolves.toMatchObject({
      status: 'HEALTHY',
      warmedItems: 16,
      cacheHitRatePercent: 66.66666666666666,
    });
  });

  it('retries transient failures and refreshes scheduled cache entries', async () => {
    const cache = new MemoryCacheStore();
    cache.failuresRemaining = 2;
    const service = new CacheWarmingService(config, cache, new NoopLogger());

    await service.warmOnStartup();
    await service.refreshScheduled();

    expect(cache.setAttempts).toBeGreaterThan(41);
    expect(cache.values.has('video:trending:1')).toBe(true);
    expect(cache.values.has('user:preferences:active:5')).toBe(true);
    await expect(service.health()).resolves.toMatchObject({
      status: 'HEALTHY',
      scheduledRefreshes: 1,
      warmedItems: 41,
      failedItems: 0,
    });
  });

  it('reports unavailable when Redis is not configured', async () => {
    const service = new CacheWarmingService(config, undefined, new NoopLogger());

    await service.warmOnStartup();

    await expect(service.health()).resolves.toMatchObject({
      status: 'UNAVAILABLE',
      lastError: 'REDIS_URL is not configured.',
    });
  });
});
