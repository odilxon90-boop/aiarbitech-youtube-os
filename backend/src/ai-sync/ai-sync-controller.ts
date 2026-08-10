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
