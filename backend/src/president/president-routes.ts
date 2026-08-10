import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { presidentController } from './president-controller.js';

const PRESIDENT_ACCESS = 'president:access';

export function registerPresidentRoutes(app: FastifyInstance): void {
  app.get('/api/v1/president/dashboard', async (request) => {
    requirePermission(request, PRESIDENT_ACCESS);
    return successResponse(await presidentController.getDashboard(), request.correlationId);
  });

  app.get('/api/v1/president/health', async (request) => {
    requirePermission(request, PRESIDENT_ACCESS);
    return successResponse(await presidentController.getHealth(), request.correlationId);
  });

  app.get('/api/v1/president/revenue', async (request) => {
    requirePermission(request, PRESIDENT_ACCESS);
    return successResponse(await presidentController.getRevenue(), request.correlationId);
  });

  app.get('/api/v1/president/channels', async (request) => {
    requirePermission(request, PRESIDENT_ACCESS);
    return successResponse(await presidentController.getChannels(), request.correlationId);
  });

  app.get('/api/v1/president/ai-status', async (request) => {
    requirePermission(request, PRESIDENT_ACCESS);
    return successResponse(await presidentController.getAiStatus(), request.correlationId);
  });

  app.get('/api/v1/president/risks', async (request) => {
    requirePermission(request, PRESIDENT_ACCESS);
    return successResponse(await presidentController.getRisks(), request.correlationId);
  });
}
