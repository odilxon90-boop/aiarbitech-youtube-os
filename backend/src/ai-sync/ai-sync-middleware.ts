<<<<<<< HEAD
import type { FastifyInstance } from 'fastify';
import { PlatformError } from '../shared/errors.js';

export function registerAiSyncMiddleware(app: FastifyInstance): void {
  app.addHook('onRequest', async (request) => {
    if (!request.url.startsWith('/api/v1/ai-sync')) return;
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new PlatformError(401, 'UNAUTHORIZED', 'A valid bearer token is required.');
    }
  });
=======
import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';

export function requireAISyncAccess(request: FastifyRequest): void {
  requirePermission(request, 'ai-sync:access');
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
