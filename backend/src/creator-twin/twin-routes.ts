import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { TwinController } from './twin-controller.js';
import { TwinService } from './twin-service.js';
export function registerTwinRoutes(app: FastifyInstance, controller = new TwinController(new TwinService())): void {
  app.get('/api/v1/twin/status', async (request) => successResponse(controller.status(request), request.correlationId));
  app.post('/api/v1/twin/activate', async (request) => successResponse(controller.activate(request), request.correlationId));
  app.post('/api/v1/twin/deactivate', async (request) => successResponse(controller.deactivate(request), request.correlationId));
  app.get('/api/v1/twin/decisions', async (request) => successResponse(controller.decisions(request), request.correlationId));
  app.post<{ Body: { source: string; summary: string } }>('/api/v1/twin/learn', async (request) => successResponse(controller.learn(request), request.correlationId));
  app.get('/api/v1/twin/recommendations', async (request) => successResponse(controller.recommendations(request), request.correlationId));
}
