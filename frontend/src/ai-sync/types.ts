export type SyncStatus = 'ACTIVE' | 'IDLE' | 'ERROR' | 'DISCONNECTED';

export interface SyncStatusResponse {
  status: SyncStatus;
  lastSyncAt: string;
  localVersion: string;
  globalVersion: string;
  message: string;
}

export interface SyncHistoryEntry {
  id: string;
  timestamp: string;
  status: SyncStatus;
  details: string;
  durationMs: number;
}

export interface ConflictResolution {
  id: string;
  conflictId: string;
  resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL';
  resolvedAt: string;
  resolvedBy: string;
  notes?: string;
}

export interface Conflict {
  id: string;
  type: string;
  localValue: string;
  globalValue: string;
  detectedAt: string;
  status: 'OPEN' | 'RESOLVED';
  resolution?: ConflictResolution;
}

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  active: boolean;
  deployedAt: string;
  metadata: Record<string, string>;
}

export interface ForceSyncResponse {
  success: boolean;
  syncedAt: string;
  changesApplied: number;
  message: string;
}
