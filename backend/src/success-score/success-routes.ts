import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { SuccessController } from './success-controller.js';
import { SuccessService } from './success-service.js';
export function registerSuccessScoreRoutes(app: FastifyInstance, controller = new SuccessController(new SuccessService())): void {
  app.get('/api/v1/success-score/current', async (request) => successResponse(controller.current(request), request.correlationId));
  app.get('/api/v1/success-score/history', async (request) => successResponse(controller.history(request), request.correlationId));
  app.get('/api/v1/success-score/breakdown', async (request) => successResponse(controller.breakdown(request), request.correlationId));
  app.get('/api/v1/success-score/improvements', async (request) => successResponse(controller.improvements(request), request.correlationId));
}
