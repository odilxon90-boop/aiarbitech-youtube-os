/**
 * Cache service — high-level API for caching frequently accessed data.
 *
 * Provides cache strategies for:
 *  - Dashboard summary (60s TTL)
 *  - Genre trends (5m TTL)
 *  - Intelligence profile (2m TTL)
 *  - User preferences (10m TTL)
 *  - Analytics data (3m TTL)
 */

import { cacheGet, cacheSet, cacheDelete, cacheDeleteMany } from './redis-client.js';

// Simple debug logging
const debugLog = (message: string, context?: Record<string, unknown>) => {
  if (process.env.DEBUG_CACHE) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), message, ...context }));
  }
};

// ─── Cache key patterns ──────────────────────────────────────────────────────

const CACHE_KEYS = {
  DASHBOARD_SUMMARY: (userId: string) => `cache:dashboard:summary:${userId}`,
  DASHBOARD_METRICS: (userId: string) => `cache:dashboard:metrics:${userId}`,
  GENRE_TRENDS: 'cache:genre:trends',
  GENRE_RECOMMENDATIONS: (userId: string) => `cache:genre:recommendations:${userId}`,
  INTELLIGENCE_PROFILE: (userId: string) => `cache:intelligence:profile:${userId}`,
  INTELLIGENCE_ANALYSIS: (userId: string) => `cache:intelligence:analysis:${userId}`,
  MEMORY_SUMMARY: (userId: string) => `cache:memory:summary:${userId}`,
  ANALYTICS_TRENDS: (userId: string) => `cache:analytics:trends:${userId}`,
  ANALYTICS_PERFORMANCE: (userId: string) => `cache:analytics:performance:${userId}`,
  GOALS_LIST: (userId: string) => `cache:goals:list:${userId}`,
  VIDEO_SUGGESTIONS: (userId: string) => `cache:video:suggestions:${userId}`,
  ADMIN_STATS: 'cache:admin:stats',
  GATEWAY_STATUS: 'cache:gateway:status',
  GATEWAY_HEALTH: 'cache:gateway:health',
  GATEWAY_ENDPOINTS: 'cache:gateway:endpoints',
};

// ─── Cache TTLs (in seconds) ─────────────────────────────────────────────────

const CACHE_TTL = {
  DASHBOARD_SUMMARY: 60, // 1 minute
  GENRE_TRENDS: 300, // 5 minutes
  INTELLIGENCE_PROFILE: 120, // 2 minutes
  MEMORY_SUMMARY: 180, // 3 minutes
  ANALYTICS_DATA: 180, // 3 minutes
  ADMIN_STATS: 300, // 5 minutes
  GATEWAY_STATUS: 30, // 30 seconds
  GATEWAY_HEALTH: 60, // 1 minute
};

// ─── Dashboard Cache ─────────────────────────────────────────────────────────

export async function getDashboardSummary<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.DASHBOARD_SUMMARY(userId));
}

export async function setDashboardSummary<T>(userId: string, data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.DASHBOARD_SUMMARY(userId), data, CACHE_TTL.DASHBOARD_SUMMARY);
  debugLog('Dashboard summary cached', { userId, ttl: CACHE_TTL.DASHBOARD_SUMMARY });
}

export async function invalidateDashboardSummary(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.DASHBOARD_SUMMARY(userId));
    debugLog('Dashboard summary invalidated', { userId });
  } else {
    // Invalidate all dashboard caches
    await cacheDeleteMany([CACHE_KEYS.DASHBOARD_SUMMARY('*')]);
    debugLog('All dashboard summaries invalidated');
  }
}

// ─── Genre Cache ────────────────────────────────────────────────────────────

export async function getGenreTrends<T>(): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.GENRE_TRENDS);
}

export async function setGenreTrends<T>(data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.GENRE_TRENDS, data, CACHE_TTL.GENRE_TRENDS);
  debugLog('Genre trends cached', { ttl: CACHE_TTL.GENRE_TRENDS });
}

export async function invalidateGenreTrends(): Promise<void> {
  await cacheDelete(CACHE_KEYS.GENRE_TRENDS);
  debugLog('Genre trends invalidated');
}

export async function getGenreRecommendations<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.GENRE_RECOMMENDATIONS(userId));
}

export async function setGenreRecommendations<T>(userId: string, data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.GENRE_RECOMMENDATIONS(userId), data, CACHE_TTL.GENRE_TRENDS);
  debugLog('Genre recommendations cached', { userId });
}

export async function invalidateGenreRecommendations(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.GENRE_RECOMMENDATIONS(userId));
  } else {
    await cacheDeleteMany([CACHE_KEYS.GENRE_RECOMMENDATIONS('*')]);
  }
  debugLog('Genre recommendations invalidated', { userId });
}

// ─── Intelligence Cache ──────────────────────────────────────────────────────

export async function getIntelligenceProfile<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.INTELLIGENCE_PROFILE(userId));
}

export async function setIntelligenceProfile<T>(userId: string, data: T): Promise<void> {
  await cacheSet(
    CACHE_KEYS.INTELLIGENCE_PROFILE(userId),
    data,
    CACHE_TTL.INTELLIGENCE_PROFILE,
  );
  debugLog('Intelligence profile cached', { userId, ttl: CACHE_TTL.INTELLIGENCE_PROFILE });
}

export async function invalidateIntelligenceProfile(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.INTELLIGENCE_PROFILE(userId));
  } else {
    await cacheDeleteMany([CACHE_KEYS.INTELLIGENCE_PROFILE('*')]);
  }
  debugLog('Intelligence profile invalidated', { userId });
}

// ─── Analytics Cache ────────────────────────────────────────────────────────

export async function getAnalyticsTrends<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.ANALYTICS_TRENDS(userId));
}

export async function setAnalyticsTrends<T>(userId: string, data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.ANALYTICS_TRENDS(userId), data, CACHE_TTL.ANALYTICS_DATA);
  debugLog('Analytics trends cached', { userId });
}

export async function invalidateAnalyticsTrends(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.ANALYTICS_TRENDS(userId));
  } else {
    await cacheDeleteMany([CACHE_KEYS.ANALYTICS_TRENDS('*')]);
  }
  debugLog('Analytics trends invalidated', { userId });
}

// ─── Memory Cache ───────────────────────────────────────────────────────────

export async function getMemorySummary<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.MEMORY_SUMMARY(userId));
}

export async function setMemorySummary<T>(userId: string, data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.MEMORY_SUMMARY(userId), data, CACHE_TTL.MEMORY_SUMMARY);
  debugLog('Memory summary cached', { userId });
}

export async function invalidateMemorySummary(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.MEMORY_SUMMARY(userId));
  } else {
    await cacheDeleteMany([CACHE_KEYS.MEMORY_SUMMARY('*')]);
  }
  debugLog('Memory summary invalidated', { userId });
}

// ─── Gateway Cache ──────────────────────────────────────────────────────────

export async function getGatewayStatus<T>(): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.GATEWAY_STATUS);
}

export async function setGatewayStatus<T>(data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.GATEWAY_STATUS, data, CACHE_TTL.GATEWAY_STATUS);
  debugLog('Gateway status cached', { ttl: CACHE_TTL.GATEWAY_STATUS });
}

export async function invalidateGatewayStatus(): Promise<void> {
  await cacheDelete(CACHE_KEYS.GATEWAY_STATUS);
  debugLog('Gateway status invalidated');
}

export async function getGatewayHealth<T>(): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.GATEWAY_HEALTH);
}

export async function setGatewayHealth<T>(data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.GATEWAY_HEALTH, data, CACHE_TTL.GATEWAY_HEALTH);
  debugLog('Gateway health cached', { ttl: CACHE_TTL.GATEWAY_HEALTH });
}

export async function invalidateGatewayHealth(): Promise<void> {
  await cacheDelete(CACHE_KEYS.GATEWAY_HEALTH);
  debugLog('Gateway health invalidated');
}

export async function getGatewayEndpoints<T>(): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.GATEWAY_ENDPOINTS);
}

export async function setGatewayEndpoints<T>(data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.GATEWAY_ENDPOINTS, data, CACHE_TTL.GATEWAY_STATUS);
  debugLog('Gateway endpoints cached');
}

export async function invalidateGatewayEndpoints(): Promise<void> {
  await cacheDelete(CACHE_KEYS.GATEWAY_ENDPOINTS);
  debugLog('Gateway endpoints invalidated');
}

// ─── Admin Cache ────────────────────────────────────────────────────────────

export async function getAdminStats<T>(): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.ADMIN_STATS);
}

export async function setAdminStats<T>(data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.ADMIN_STATS, data, CACHE_TTL.ADMIN_STATS);
  debugLog('Admin stats cached', { ttl: CACHE_TTL.ADMIN_STATS });
}

export async function invalidateAdminStats(): Promise<void> {
  await cacheDelete(CACHE_KEYS.ADMIN_STATS);
  debugLog('Admin stats invalidated');
}

// ─── Goals Cache ────────────────────────────────────────────────────────────

export async function getGoalsList<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.GOALS_LIST(userId));
}

export async function setGoalsList<T>(userId: string, data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.GOALS_LIST(userId), data, CACHE_TTL.ANALYTICS_DATA);
  debugLog('Goals list cached', { userId });
}

export async function invalidateGoalsList(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.GOALS_LIST(userId));
  } else {
    await cacheDeleteMany([CACHE_KEYS.GOALS_LIST('*')]);
  }
  debugLog('Goals list invalidated', { userId });
}

// ─── Video Cache ────────────────────────────────────────────────────────────

export async function getVideoSuggestions<T>(userId: string): Promise<T | null> {
  return cacheGet<T>(CACHE_KEYS.VIDEO_SUGGESTIONS(userId));
}

export async function setVideoSuggestions<T>(userId: string, data: T): Promise<void> {
  await cacheSet(CACHE_KEYS.VIDEO_SUGGESTIONS(userId), data, CACHE_TTL.ANALYTICS_DATA);
  debugLog('Video suggestions cached', { userId });
}

export async function invalidateVideoSuggestions(userId?: string): Promise<void> {
  if (userId) {
    await cacheDelete(CACHE_KEYS.VIDEO_SUGGESTIONS(userId));
  } else {
    await cacheDeleteMany([CACHE_KEYS.VIDEO_SUGGESTIONS('*')]);
  }
  debugLog('Video suggestions invalidated', { userId });
}
