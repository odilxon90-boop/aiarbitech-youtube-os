import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import type { MetricsCollector } from './metrics.js';
import type { CacheWarmingService } from '../cache/warming.service.js';

export function registerMonitoringHealthRoutes(
  app: FastifyInstance,
  metrics: MetricsCollector,
  cacheWarming: CacheWarmingService,
): void {
  app.get('/health', async (request) => successResponse({
    status: 'UP',
    uptimeSeconds: Math.floor(process.uptime()),
    version: '0.1.0',
    metrics: metrics.snapshot(),
  }, request.correlationId));
  app.get('/health/db', async (request) => successResponse({ status: 'UP', connectivity: 'MOCK_CONNECTED' }, request.correlationId));
  app.get('/health/gateway', async (request) => successResponse({ status: 'UP', connectivity: 'MOCK_CONNECTED', networkRequestPerformed: false }, request.correlationId));
  app.get('/health/cache', async (request) => successResponse(await cacheWarming.health(), request.correlationId));
}
