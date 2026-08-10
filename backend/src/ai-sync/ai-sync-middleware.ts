import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';

export function requireAISyncAccess(request: FastifyRequest): void {
  requirePermission(request, 'ai-sync:access');
}
