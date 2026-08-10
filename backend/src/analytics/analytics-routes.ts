import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { analyticsController } from './analytics-controller.js';

const ANALYTICS_READ = 'analytics:read';

/**
 * Creator Analytics Center routes. GET only, authenticated, and permission-checked.
 * Returns structured JSON via the shared API envelope.
 */
export function registerAnalyticsRoutes(app: FastifyInstance): void {
  app.get('/api/v1/analytics/summary', async (request) => {
    requirePermission(request, ANALYTICS_READ);
    return successResponse(await analyticsController.getSummary(), request.correlationId);
  });

  app.get('/api/v1/analytics/trends', async (request) => {
    requirePermission(request, ANALYTICS_READ);
    return successResponse(await analyticsController.getTrends(), request.correlationId);
  });

  app.get('/api/v1/analytics/performance', async (request) => {
    requirePermission(request, ANALYTICS_READ);
    return successResponse(await analyticsController.getPerformance(), request.correlationId);
  });
}