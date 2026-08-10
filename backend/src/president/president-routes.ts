import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { PresidentController } from './president-controller.js';
import { PresidentService } from './president-service.js';
export function registerPresidentRoutes(app: FastifyInstance, controller = new PresidentController(new PresidentService())): void {
  app.get('/api/v1/president/dashboard', async (request) => successResponse(controller.dashboard(request), request.correlationId));
  app.get('/api/v1/president/health', async (request) => successResponse(controller.health(request), request.correlationId));
  app.get('/api/v1/president/revenue', async (request) => successResponse(controller.revenue(request), request.correlationId));
  app.get('/api/v1/president/channels', async (request) => successResponse(controller.channels(request), request.correlationId));
  app.get('/api/v1/president/ai-status', async (request) => successResponse(controller.aiStatus(request), request.correlationId));
  app.get('/api/v1/president/risks', async (request) => successResponse(controller.risks(request), request.correlationId));
}
