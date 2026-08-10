import { createClient } from 'redis';
import type { PlatformLogger } from '../shared/logger.js';
import type { CacheWarmingConfig } from './warming.config.js';

export interface CacheStore {
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  ping(): Promise<string>;
  disconnect(): Promise<void>;
}

export class RedisCacheStore implements CacheStore {
  private readonly client;

  constructor(url: string) {
    this.client = createClient({ url, socket: { connectTimeout: 5_000, reconnectStrategy: false } });
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.connect();
    await this.client.set(key, value, { EX: ttlSeconds });
  }

  async ping(): Promise<string> {
    await this.connect();
    return this.client.ping();
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) await this.client.quit();
  }

  private async connect(): Promise<void> {
    if (!this.client.isOpen) await this.client.connect();
  }
}

interface WarmItem {
  key: string;
  value: unknown;
  priority: 1 | 2 | 3;
}

export interface CacheWarmingHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE' | 'DISABLED';
  warmedItems: number;
  failedItems: number;
  scheduledRefreshes: number;
  cacheHitRatePercent: number;
  lastWarmedAt?: string;
  lastError?: string;
}

export class CacheWarmingService {
  private warmedItems = 0;
  private failedItems = 0;
  private scheduledRefreshes = 0;
  private cacheReads = 0;
  private cacheHits = 0;
  private lastWarmedAt: string | undefined;
  private lastError: string | undefined;

  constructor(
    private readonly config: CacheWarmingConfig,
    private readonly cache: CacheStore | undefined,
    private readonly logger: PlatformLogger,
  ) {}

  async warmOnStartup(): Promise<void> {
    await this.warm(this.startupItems());
  }

  async refreshScheduled(): Promise<void> {
    this.scheduledRefreshes += 1;
    await this.warm(this.scheduledItems());
  }

  recordCacheResult(hit: boolean): void {
    this.cacheReads += 1;
    if (hit) this.cacheHits += 1;
  }

  async health(): Promise<CacheWarmingHealth> {
    if (!this.config.enabled) return this.snapshot('DISABLED');
    if (!this.cache) return this.snapshot('UNAVAILABLE', 'REDIS_URL is not configured.');
    try {
      await this.cache.ping();
      return this.snapshot(this.failedItems === 0 ? 'HEALTHY' : 'DEGRADED');
    } catch (error) {
      return this.snapshot('UNAVAILABLE', error instanceof Error ? error.message : 'Redis health check failed.');
    }
  }

  async close(): Promise<void> {
    await this.cache?.disconnect();
  }

  private async warm(items: readonly WarmItem[]): Promise<void> {
    if (!this.config.enabled) return;
    if (!this.cache) {
      this.lastError = 'REDIS_URL is not configured.';
      this.logger.warn('Cache warming skipped because Redis is not configured.');
      return;
    }
    try {
      await this.cache.ping();
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Redis is unavailable.';
      this.logger.warn('Cache warming skipped because Redis is unavailable.', { error: this.lastError });
      return;
    }

    this.lastError = undefined;
    const prioritizedItems = [...items]
      .sort((left, right) => left.priority - right.priority)
      .slice(0, this.config.maxItems);

    for (const item of prioritizedItems) {
      try {
        await this.withRetry(() => this.cache!.set(item.key, JSON.stringify(item.value), this.config.ttlSeconds));
        this.warmedItems += 1;
      } catch (error) {
        this.failedItems += 1;
        this.lastError = error instanceof Error ? error.message : 'Cache warming failed.';
        this.logger.error('Cache warming item failed.', { key: item.key, error: this.lastError });
      }
    }
    this.lastWarmedAt = new Date().toISOString();
    this.logger.info('Cache warming completed.', {
      itemCount: prioritizedItems.length,
      warmedItems: this.warmedItems,
      failedItems: this.failedItems,
    });
  }

  private async withRetry(operation: () => Promise<void>): Promise<void> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt += 1) {
      try {
        await operation();
        return;
      } catch (error) {
        lastError = error;
        this.logger.warn('Cache warming attempt failed.', { attempt, retryAttempts: this.config.retryAttempts });
      }
    }
    throw lastError;
  }

  private snapshot(status: CacheWarmingHealth['status'], error?: string): CacheWarmingHealth {
    return {
      status,
      warmedItems: this.warmedItems,
      failedItems: this.failedItems,
      scheduledRefreshes: this.scheduledRefreshes,
      cacheHitRatePercent: this.cacheReads === 0 ? 0 : (this.cacheHits / this.cacheReads) * 100,
      ...(this.lastWarmedAt ? { lastWarmedAt: this.lastWarmedAt } : {}),
      ...(error ?? this.lastError ? { lastError: error ?? this.lastError! } : {}),
    };
  }

  private startupItems(): readonly WarmItem[] {
    const genres = ['Education', 'Gaming', 'Music', 'Technology', 'Lifestyle', 'Comedy', 'Sports', 'News', 'Travel', 'Finance'];
    return [
      ...genres.map((genre, index) => ({
        key: `genre:popular:${index + 1}`,
        value: { genre, rank: index + 1 },
        priority: 1 as const,
      })),
      {
        key: 'dashboard:summary:admin',
        value: { creatorScore: 72, activeWorkflows: 2, qualityScore: 91, viewsTrendPercent: 12 },
        priority: 1,
      },
      ...Array.from({ length: 5 }, (_, index) => ({
        key: `channel:statistics:top:${index + 1}`,
        value: { channelId: `channel-${index + 1}`, views: 100_000 - index * 10_000, subscribers: 10_000 - index * 1_000 },
        priority: 3 as const,
      })),
    ];
  }

  private scheduledItems(): readonly WarmItem[] {
    return [
      ...this.startupItems().filter((item) => item.key.startsWith('genre:popular:')),
      ...Array.from({ length: 10 }, (_, index) => ({
        key: `video:trending:${index + 1}`,
        value: { videoId: `video-trending-${index + 1}`, rank: index + 1 },
        priority: 1 as const,
      })),
      ...Array.from({ length: 5 }, (_, index) => ({
        key: `user:preferences:active:${index + 1}`,
        value: { userId: `user-${index + 1}`, theme: 'system', notificationsEnabled: true },
        priority: 2 as const,
      })),
    ];
  }
}
