import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { AISyncController } from './ai-sync-controller.js';
import type { ConflictResolution } from './ai-sync-service.js';
import { AISyncService } from './ai-sync-service.js';

export function registerAISyncRoutes(app: FastifyInstance, controller = new AISyncController(new AISyncService())): void {
  app.get('/api/v1/ai-sync/status', async (request) => successResponse(controller.status(request), request.correlationId));
  app.get('/api/v1/ai-sync/history', async (request) => successResponse(controller.history(request), request.correlationId));
  app.post('/api/v1/ai-sync/force-sync', async (request) => successResponse(controller.forceSync(request), request.correlationId));
  app.get('/api/v1/ai-sync/conflicts', async (request) => successResponse(controller.conflicts(request), request.correlationId));
  app.post<{ Params: { conflictId: string }; Body: { resolution: Exclude<ConflictResolution, 'UNRESOLVED'> } }>('/api/v1/ai-sync/resolve/:conflictId', async (request) =>
    successResponse(controller.resolve(request), request.correlationId),
  );
  app.get('/api/v1/ai-sync/models', async (request) => successResponse(controller.models(request), request.correlationId));
}
