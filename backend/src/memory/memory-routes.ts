import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { memoryController } from './memory-controller.js';
import type { PreferencesPayload } from './memory-service.js';

const MEMORY_READ = 'memory:read';
const MEMORY_WRITE = 'memory:write';

export function registerMemoryRoutes(app: FastifyInstance): void {
  app.get('/api/v1/memory/summary', async (request) => {
    requirePermission(request, MEMORY_READ);
    return successResponse(await memoryController.getSummary(), request.correlationId);
  });

  app.get('/api/v1/memory/preferences', async (request) => {
    requirePermission(request, MEMORY_READ);
    return successResponse(await memoryController.getPreferences(), request.correlationId);
  });

  app.put('/api/v1/memory/preferences', async (request) => {
    requirePermission(request, MEMORY_WRITE);
    const payload = request.body as PreferencesPayload;
    return successResponse(await memoryController.updatePreferences(payload), request.correlationId);
  });

  app.get('/api/v1/memory/decisions', async (request) => {
    requirePermission(request, MEMORY_READ);
    return successResponse(await memoryController.getDecisions(), request.correlationId);
  });

  app.post('/api/v1/memory/learn', async (request) => {
    requirePermission(request, MEMORY_WRITE);
    const body = request.body as { event: string; result: string };
    return successResponse(await memoryController.addLearning(body), request.correlationId);
  });
}
