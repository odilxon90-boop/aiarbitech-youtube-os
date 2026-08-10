import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { aiSyncController } from './ai-sync-controller.js';

const AI_SYNC_ACCESS = 'ai-sync:access';

export function registerAiSyncRoutes(app: FastifyInstance): void {
  app.get('/api/v1/ai-sync/status', async (request) => {
    requirePermission(request, AI_SYNC_ACCESS);
    return successResponse(await aiSyncController.getStatus(), request.correlationId);
  });

  app.get('/api/v1/ai-sync/history', async (request) => {
    requirePermission(request, AI_SYNC_ACCESS);
    return successResponse(await aiSyncController.getHistory(), request.correlationId);
  });

  app.post('/api/v1/ai-sync/force-sync', async (request) => {
    requirePermission(request, AI_SYNC_ACCESS);
    return successResponse(await aiSyncController.forceSync(), request.correlationId);
  });

  app.get('/api/v1/ai-sync/conflicts', async (request) => {
    requirePermission(request, AI_SYNC_ACCESS);
    return successResponse(await aiSyncController.getConflicts(), request.correlationId);
  });

  app.post('/api/v1/ai-sync/resolve/:conflictId', async (request, reply) => {
    requirePermission(request, AI_SYNC_ACCESS);
    const conflictId = (request.params as { conflictId: string }).conflictId;
    const body = (request.body as { resolution?: 'LOCAL' | 'GLOBAL' | 'MANUAL' } | null) ?? {};
    const resolution = body.resolution;
    if (!resolution || !['LOCAL', 'GLOBAL', 'MANUAL'].includes(resolution)) {
      return reply.status(400).send({
        error: { code: 'BAD_REQUEST', message: 'resolution must be LOCAL, GLOBAL, or MANUAL.' },
      });
    }
    return successResponse(await aiSyncController.resolveConflict(conflictId, resolution), request.correlationId);
  });

  app.get('/api/v1/ai-sync/models', async (request) => {
    requirePermission(request, AI_SYNC_ACCESS);
    return successResponse(await aiSyncController.getModels(), request.correlationId);
  });
}
