import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { dashboardController } from '../dashboard/dashboard-controller.js';

export function registerCreatorRoutes(app: FastifyInstance): void {
  app.get('/api/v1/creator/stats', async (request) => {
    requirePermission(request, 'dashboard:read');
    return successResponse(await dashboardController.getSummary(), request.correlationId);
  });
}
