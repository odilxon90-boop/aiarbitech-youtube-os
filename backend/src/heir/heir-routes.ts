import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { heirController } from './heir-controller.js';

const HEIR_ACCESS = 'heir:access';

export function registerHeirRoutes(app: FastifyInstance): void {
  app.get('/api/v1/heir/dashboard', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getDashboard(), request.correlationId);
  });

  app.get('/api/v1/heir/health', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getHealth(), request.correlationId);
  });

  app.get('/api/v1/heir/revenue', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getRevenue(), request.correlationId);
  });

  app.get('/api/v1/heir/channels', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getChannels(), request.correlationId);
  });

  app.get('/api/v1/heir/ai-status', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getAiStatus(), request.correlationId);
  });

  app.get('/api/v1/heir/risks', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getRisks(), request.correlationId);
  });

  app.get('/api/v1/heir/training', async (request) => {
    requirePermission(request, HEIR_ACCESS);
    return successResponse(await heirController.getTraining(), request.correlationId);
  });
}
