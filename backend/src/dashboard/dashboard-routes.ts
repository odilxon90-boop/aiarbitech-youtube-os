import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { dashboardController } from './dashboard-controller.js';

const DASHBOARD_READ = 'dashboard:read';

/**
 * Creator Dashboard routes. GET only, authenticated, and permission-checked.
 * Returns structured JSON via the shared API envelope.
 */
export function registerDashboardRoutes(app: FastifyInstance): void {
  app.get('/api/v1/dashboard/summary', async (request) => {
    requirePermission(request, DASHBOARD_READ);
    return successResponse(await dashboardController.getSummary(), request.correlationId);
  });

  app.get('/api/v1/dashboard/kpi', async (request) => {
    requirePermission(request, DASHBOARD_READ);
    return successResponse(await dashboardController.getKpis(), request.correlationId);
  });

  app.get('/api/v1/dashboard/recommendations', async (request) => {
    requirePermission(request, DASHBOARD_READ);
    return successResponse(await dashboardController.getRecommendations(), request.correlationId);
  });
}