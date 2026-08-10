import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { QualityController } from './quality-controller.js';
import { QualityService } from './quality-service.js';

export function registerQualityRoutes(app: FastifyInstance, controller = new QualityController(new QualityService())): void {
  app.get<{ Params: { videoId: string } }>('/api/v1/quality/score/:videoId', async (request) =>
    successResponse(controller.score(request), request.correlationId),
  );
  app.get<{ Params: { videoId: string } }>('/api/v1/quality/retention/:videoId', async (request) =>
    successResponse(controller.retention(request), request.correlationId),
  );
  app.get<{ Params: { videoId: string } }>('/api/v1/quality/readiness/:videoId', async (request) =>
    successResponse(controller.readiness(request), request.correlationId),
  );
  app.get<{ Params: { videoId: string } }>('/api/v1/quality/checklist/:videoId', async (request) =>
    successResponse(controller.checklist(request), request.correlationId),
  );
}
