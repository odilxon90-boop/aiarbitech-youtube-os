export type SyncStatus = 'ACTIVE' | 'IDLE' | 'ERROR' | 'DISCONNECTED';
export type ConflictResolution = 'UNRESOLVED' | 'ACCEPT_LOCAL' | 'ACCEPT_GLOBAL' | 'MANUAL_OVERRIDE';

export interface SyncEvent {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  detail: string;
}

export interface SyncConflict {
  id: string;
  subject: string;
  localDecision: string;
  globalRecommendation: string;
  resolution: ConflictResolution;
}

export interface AIModelVersion {
  id: string;
  name: string;
  version: string;
  scope: 'LOCAL_DIRECTOR' | 'GLOBAL_AI_CORE';
  active: boolean;
  releasedAt: string;
}

export interface ForceSyncResult {
  id: string;
  status: 'SUCCESS';
  syncedAt: string;
  detail: string;
}

const history: readonly SyncEvent[] = Array.from({ length: 20 }, (_, index) => ({
  id: `sync-${String(index + 1).padStart(2, '0')}`,
  timestamp: `2026-08-09T${String(18 - Math.floor(index / 3)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}:00.000Z`,
  status: index % 8 === 0 ? 'WARNING' : 'SUCCESS',
  detail: index % 8 === 0 ? 'Mock recommendation requires review.' : 'Mock director recommendation synchronized.',
}));

const conflicts: SyncConflict[] = [
  ['conflict-01', 'video-aurora', 'Publish now', 'Schedule for 18:00', 'UNRESOLVED'],
  ['conflict-02', 'video-horizon', 'Use concise title', 'Use keyword-first title', 'ACCEPT_GLOBAL'],
  ['conflict-03', 'channel-byte-sized', 'Daily cadence', 'Three uploads weekly', 'ACCEPT_LOCAL'],
  ['conflict-04', 'video-draft', 'Include CTA', 'Remove CTA', 'MANUAL_OVERRIDE'],
  ['conflict-05', 'channel-creator-lab', 'Retention target 60%', 'Retention target 65%', 'UNRESOLVED'],
].map(([id, subject, localDecision, globalRecommendation, resolution]) => ({
  id: id!,
  subject: subject!,
  localDecision: localDecision!,
  globalRecommendation: globalRecommendation!,
  resolution: resolution as ConflictResolution,
}));

const models: readonly AIModelVersion[] = [
  { id: 'model-01', name: 'AIArbiTech Director', version: '1.4.0', scope: 'LOCAL_DIRECTOR', active: true, releasedAt: '2026-07-15T00:00:00.000Z' },
  { id: 'model-02', name: 'Global AI Core Recommendations', version: '3.2.1', scope: 'GLOBAL_AI_CORE', active: true, releasedAt: '2026-08-01T00:00:00.000Z' },
  { id: 'model-03', name: 'Global AI Core Safety', version: '2.8.0', scope: 'GLOBAL_AI_CORE', active: true, releasedAt: '2026-07-28T00:00:00.000Z' },
];

const forceSyncResults: readonly Omit<ForceSyncResult, 'syncedAt'>[] = Array.from({ length: 5 }, (_, index) => ({
  id: `force-sync-${index + 1}`,
  status: 'SUCCESS',
  detail: `Mock force sync ${index + 1} completed without external requests.`,
}));

export class AISyncService {
  private forceSyncCount = 0;

  getStatus() {
    return { status: 'ACTIVE' as SyncStatus, connectionHealth: 'HEALTHY', lastSynchronizedAt: history[0]!.timestamp, networkRequestPerformed: false };
  }
  getHistory(): readonly SyncEvent[] { return history; }
  forceSync(): ForceSyncResult {
    this.forceSyncCount += 1;
    const template = forceSyncResults[(this.forceSyncCount - 1) % forceSyncResults.length]!;
    return {
      ...template,
      syncedAt: new Date().toISOString(),
    };
  }
  getConflicts(): readonly SyncConflict[] { return conflicts; }
  resolveConflict(id: string, resolution: Exclude<ConflictResolution, 'UNRESOLVED'>): SyncConflict {
    const conflict = conflicts.find((item) => item.id === id);
    if (!conflict) throw new Error(`Conflict ${id} was not found.`);
    conflict.resolution = resolution;
    return conflict;
  }
  getModels(): readonly AIModelVersion[] { return models; }
}
