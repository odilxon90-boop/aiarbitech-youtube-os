import type { EnvironmentConfig } from '../config/environment.js';

export interface CacheWarmingConfig {
  enabled: boolean;
  intervalSeconds: number;
  maxItems: number;
  retryAttempts: number;
  ttlSeconds: number;
}

export function getCacheWarmingConfig(config: EnvironmentConfig): CacheWarmingConfig {
  return {
    enabled: config.CACHE_WARMING_ENABLED,
    intervalSeconds: config.CACHE_WARMING_INTERVAL_SECONDS,
    maxItems: config.CACHE_WARMING_MAX_ITEMS,
    retryAttempts: config.CACHE_WARMING_RETRY_ATTEMPTS,
    ttlSeconds: config.CACHE_WARMING_INTERVAL_SECONDS,
  };
}
