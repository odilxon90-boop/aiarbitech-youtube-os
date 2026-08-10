import type { FastifyRequest } from 'fastify';
import { requireAISyncAccess } from './ai-sync-middleware.js';
import type { AISyncService, ConflictResolution } from './ai-sync-service.js';

export class AISyncController {
  constructor(private readonly service: AISyncService) {}
  status(request: FastifyRequest) { requireAISyncAccess(request); return this.service.getStatus(); }
  history(request: FastifyRequest) { requireAISyncAccess(request); return this.service.getHistory(); }
  forceSync(request: FastifyRequest) { requireAISyncAccess(request); return this.service.forceSync(); }
  conflicts(request: FastifyRequest) { requireAISyncAccess(request); return this.service.getConflicts(); }
  resolve(request: FastifyRequest<{ Params: { conflictId: string }; Body: { resolution: Exclude<ConflictResolution, 'UNRESOLVED'> } }>) {
    requireAISyncAccess(request);
    return this.service.resolveConflict(request.params.conflictId, request.body.resolution);
  }
  models(request: FastifyRequest) { requireAISyncAccess(request); return this.service.getModels(); }
}
