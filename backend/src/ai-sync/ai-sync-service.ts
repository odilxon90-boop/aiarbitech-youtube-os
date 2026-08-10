export type SyncStatus = 'ACTIVE' | 'IDLE' | 'ERROR' | 'DISCONNECTED';
<<<<<<< HEAD

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

const MOCK_STATUS = {
  status: 'ACTIVE' as const,
  lastSyncAt: '2026-08-09T12:00:00.000Z',
  localVersion: 'youtube-os-v0.4.2',
  globalVersion: 'global-core-v3.1.0',
  message: 'Sync connection healthy.',
};

const MOCK_HISTORY = Array.from({ length: 22 }, (_, idx) => ({
  id: `sync-${idx + 1}`,
  timestamp: new Date(Date.now() - idx * 3600_000).toISOString(),
  status: (idx % 7 === 0 ? 'ERROR' : 'ACTIVE') as SyncHistoryEntry['status'],
  details: idx % 7 === 0 ? 'Partial failure; retrying.' : 'Sync completed successfully.',
  durationMs: 1200 + idx * 50,
}));

const MOCK_CONFLICTS = [
  { id: 'c-1', type: 'RECOMMENDATION', localValue: 'PRIORITY_A', globalValue: 'PRIORITY_B', detectedAt: '2026-08-09T11:00:00.000Z', status: 'OPEN' as const },
  { id: 'c-2', type: 'MODEL_WEIGHTS', localValue: '0.8', globalValue: '0.9', detectedAt: '2026-08-09T10:30:00.000Z', status: 'RESOLVED' as const, resolution: { id: 'cr-1', conflictId: 'c-2', resolution: 'GLOBAL' as const, resolvedAt: '2026-08-09T10:35:00.000Z', resolvedBy: 'admin-1', notes: 'Accepted global weights.' } },
  { id: 'c-3', type: 'CONTENT_POLICY', localValue: 'LENIENT', globalValue: 'STRICT', detectedAt: '2026-08-09T09:00:00.000Z', status: 'OPEN' as const },
  { id: 'c-4', type: 'SCHEDULING', localValue: 'HOURLY', globalValue: 'DAILY', detectedAt: '2026-08-09T08:00:00.000Z', status: 'RESOLVED' as const, resolution: { id: 'cr-2', conflictId: 'c-4', resolution: 'LOCAL' as const, resolvedAt: '2026-08-09T08:10:00.000Z', resolvedBy: 'president-1' } },
  { id: 'c-5', type: 'FEATURE_FLAG', localValue: 'true', globalValue: 'false', detectedAt: '2026-08-09T07:00:00.000Z', status: 'OPEN' as const },
];

const MOCK_MODELS = [
  { id: 'm-1', name: 'Recommendation Engine', version: 'v3.1.0', active: true, deployedAt: '2026-08-01T00:00:00.000Z', metadata: { region: 'global', accuracy: '94.2%' } },
  { id: 'm-2', name: 'Content Classifier', version: 'v2.8.1', active: true, deployedAt: '2026-07-20T00:00:00.000Z', metadata: { region: 'global', accuracy: '91.5%' } },
  { id: 'm-3', name: 'Thumbnail Optimizer', version: 'v1.4.0', active: false, deployedAt: '2026-07-01T00:00:00.000Z', metadata: { region: 'deprecated', accuracy: '87.3%' } },
];

const MOCK_FORCE_SYNC_RESULTS = [
  { success: true, syncedAt: '2026-08-09T12:00:00.000Z', changesApplied: 3, message: 'Sync completed.' },
  { success: true, syncedAt: '2026-08-09T11:00:00.000Z', changesApplied: 1, message: 'Sync completed.' },
  { success: false, syncedAt: '2026-08-09T10:00:00.000Z', changesApplied: 0, message: 'Global core unreachable.' },
  { success: true, syncedAt: '2026-08-09T09:00:00.000Z', changesApplied: 5, message: 'Sync completed.' },
  { success: true, syncedAt: '2026-08-09T08:00:00.000Z', changesApplied: 2, message: 'Sync completed.' },
];

let forceSyncIndex = 0;

export async function getSyncStatus() {
  return MOCK_STATUS;
}

export async function getSyncHistory() {
  return { history: MOCK_HISTORY };
}

export async function forceSync() {
  const result = MOCK_FORCE_SYNC_RESULTS[forceSyncIndex % MOCK_FORCE_SYNC_RESULTS.length];
  forceSyncIndex += 1;
  return result;
}

export async function getConflicts() {
  return { conflicts: MOCK_CONFLICTS };
}

export async function resolveConflict(conflictId: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL') {
  const conflict = MOCK_CONFLICTS.find((c) => c.id === conflictId);
  if (!conflict) throw new Error(`Conflict ${conflictId} not found.`);
  const resolutionEntry = {
    id: `cr-${Date.now()}`,
    conflictId,
    resolution,
    resolvedAt: new Date().toISOString(),
    resolvedBy: 'current-user',
    notes: `Resolved via ${resolution} decision.`,
  } as const;
  conflict.status = 'RESOLVED';
  conflict.resolution = resolutionEntry as any;
  return resolutionEntry;
}

export async function getModels() {
  return { models: MOCK_MODELS };
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
