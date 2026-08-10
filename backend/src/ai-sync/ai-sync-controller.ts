<<<<<<< HEAD
import type {
  SyncStatusResponse,
  SyncHistoryEntry,
  Conflict,
  ConflictResolution,
  ModelVersion,
  ForceSyncResponse,
} from './ai-sync-service.js';
import {
  getSyncStatus,
  getSyncHistory,
  forceSync,
  getConflicts,
  resolveConflict as resolveConflictService,
  getModels,
} from './ai-sync-service.js';

export interface AISyncController {
  getStatus(): Promise<SyncStatusResponse>;
  getHistory(): Promise<{ history: SyncHistoryEntry[] }>;
  forceSync(): Promise<ForceSyncResponse>;
  getConflicts(): Promise<{ conflicts: Conflict[] }>;
  resolveConflict(conflictId: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL'): Promise<ConflictResolution>;
  getModels(): Promise<{ models: ModelVersion[] }>;
}

export const aiSyncController: AISyncController = {
  getStatus: () => getSyncStatus(),
  getHistory: () => getSyncHistory(),
  forceSync: async () => forceSync() as Promise<ForceSyncResponse>,
  getConflicts: () => getConflicts(),
  resolveConflict: (conflictId, resolution) => resolveConflictService(conflictId, resolution),
  getModels: () => getModels(),
};
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
