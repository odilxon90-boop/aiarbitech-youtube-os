<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
import { createAISyncClient, type AISyncClient } from '../ai-sync/ai-sync-client';
import type { SyncStatusResponse, SyncHistoryEntry, Conflict, ModelVersion, ForceSyncResponse } from '../ai-sync/types';
import { StatusCard } from '../components/ai-sync/StatusCard';
import { SyncHistory } from '../components/ai-sync/SyncHistory';
import { ConflictList } from '../components/ai-sync/ConflictList';
import { ModelVersionList } from '../components/ai-sync/ModelVersionList';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface AISyncPageProps {
  client?: AISyncClient;
  initialStatus?: SyncStatusResponse;
  initialHistory?: SyncHistoryEntry[];
  initialConflicts?: Conflict[];
  initialModels?: ModelVersion[];
}

export function AISyncPage({ client, initialStatus, initialHistory, initialConflicts, initialModels }: AISyncPageProps) {
  const [status, setStatus] = useState<AsyncState<SyncStatusResponse>>(() =>
    initialStatus ? successState(initialStatus) : loadingState(),
  );
  const [history, setHistory] = useState<AsyncState<SyncHistoryEntry[]>>(() =>
    initialHistory ? successState(initialHistory) : loadingState(),
  );
  const [conflicts, setConflicts] = useState<AsyncState<Conflict[]>>(() =>
    initialConflicts ? successState(initialConflicts) : loadingState(),
  );
  const [models, setModels] = useState<AsyncState<ModelVersion[]>>(() =>
    initialModels ? successState(initialModels) : loadingState(),
  );
  const [forceSyncResult, setForceSyncResult] = useState<AsyncState<ForceSyncResponse> | null>(null);
  const syncClient = useMemo(() => client ?? createAISyncClient(), [client]);
  const hasInitialData = initialStatus !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setStatus(loadingState());
    setHistory(loadingState());
    setConflicts(loadingState());
    setModels(loadingState());

    Promise.all([
      syncClient.loadStatus(controller.signal).then((data) => setStatus(successState(data))),
      syncClient.loadHistory(controller.signal).then((data) => setHistory(successState(data.history))),
      syncClient.loadConflicts(controller.signal).then((data) => setConflicts(successState(data.conflicts))),
      syncClient.loadModels(controller.signal).then((data) => setModels(successState(data.models))),
    ]).catch((error: unknown) => {
      if (!controller.signal.aborted) {
        const message = error instanceof Error ? error.message : 'Unable to load AI Sync data.';
        setStatus((prev) => prev.status === 'loading' ? errorState(message) : prev);
        setHistory((prev) => prev.status === 'loading' ? errorState(message) : prev);
        setConflicts((prev) => prev.status === 'loading' ? errorState(message) : prev);
        setModels((prev) => prev.status === 'loading' ? errorState(message) : prev);
      }
    });

    return () => controller.abort();
  }, [syncClient, hasInitialData]);

  const handleForceSync = async () => {
    setForceSyncResult(loadingState());
    try {
      const result = await syncClient.forceSync();
      setForceSyncResult(successState(result));
    } catch (error) {
      setForceSyncResult(errorState(error instanceof Error ? error.message : 'Force sync failed.'));
    }
  };

  const handleResolve = async (conflictId: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL') => {
    try {
      await syncClient.resolveConflict(conflictId, resolution);
      setConflicts((prev) => {
        if (prev.status !== 'success' || !prev.data) return prev;
        return successState(prev.data.map((c) => c.id === conflictId ? { ...c, status: 'RESOLVED' as const, resolution: { id: `cr-${Date.now()}`, conflictId, resolution, resolvedAt: new Date().toISOString(), resolvedBy: 'current-user', notes: `Resolved via ${resolution} decision.` } } : c));
      });
    } catch (error) {
      // In a real app, surface error. For mock, keep silent or show toast.
    }
  };

  return (
    <section className="ai-sync-page" aria-label="AI Director Sync">
      <header className="ai-sync-header">
        <div>
          <p className="section-kicker">AI Director</p>
          <h2 className="ai-sync-title">Global AI Core Sync</h2>
        </div>
        <button type="button" className="generate-form button" onClick={handleForceSync}>
          Force Sync
        </button>
      </header>

      {status.status === 'loading' && <LoadingState message="Loading AI Sync status…" />}
      {status.status === 'empty' && <EmptyState message="No AI Sync data is available." />}
      {status.status === 'error' && (
        <ErrorState message={status.error ?? 'Unable to load AI Sync data.'} />
      )}
      {status.status === 'success' && status.data && (
        <div className="ai-sync-columns">
          <div className="ai-sync-column">
            <StatusCard status={status.data} />
            <SyncHistory entries={history.status === 'success' && history.data ? history.data : []} />
            {forceSyncResult && forceSyncResult.status === 'success' && forceSyncResult.data && (
              <div className="card" aria-label="Force Sync Result">
                <h3 className="card-title">Force Sync Result</h3>
                <p className={forceSyncResult.data.success ? 'trend-up' : 'trend-down'}>
                  {forceSyncResult.data.success ? 'Success' : 'Failed'}: {forceSyncResult.data.message}
                </p>
                <p className="muted">Changes applied: {forceSyncResult.data.changesApplied}</p>
              </div>
            )}
          </div>
          <div className="ai-sync-column">
            <ConflictList conflicts={conflicts.status === 'success' && conflicts.data ? conflicts.data : []} onResolve={handleResolve} />
            <ModelVersionList models={models.status === 'success' && models.data ? models.data : []} />
          </div>
        </div>
      )}
    </section>
  );
=======
import { ConflictList } from '../components/ai-sync/ConflictList';
import { ModelVersionList } from '../components/ai-sync/ModelVersionList';
import { StatusCard } from '../components/ai-sync/StatusCard';
import { SyncHistory } from '../components/ai-sync/SyncHistory';

const history = Array.from({ length: 20 }, (_, index) => ({ id: `sync-${index}`, timestamp: `2026-08-09T12:${String(index).padStart(2, '0')}:00Z`, status: index % 5 === 0 ? 'WARNING' : 'SUCCESS', detail: 'Mock recommendation synchronized.' }));
const conflicts = [
  { id: 'c1', subject: 'video-aurora', localDecision: 'Publish now', globalRecommendation: 'Schedule for 18:00', resolution: 'UNRESOLVED' },
  { id: 'c2', subject: 'video-horizon', localDecision: 'Concise title', globalRecommendation: 'Keyword-first title', resolution: 'ACCEPT_GLOBAL' },
  { id: 'c3', subject: 'channel-byte-sized', localDecision: 'Daily', globalRecommendation: 'Three weekly', resolution: 'ACCEPT_LOCAL' },
  { id: 'c4', subject: 'video-draft', localDecision: 'Include CTA', globalRecommendation: 'Remove CTA', resolution: 'MANUAL_OVERRIDE' },
  { id: 'c5', subject: 'creator-lab', localDecision: '60%', globalRecommendation: '65%', resolution: 'UNRESOLVED' },
];
const models = [
  { id: 'm1', name: 'AIArbiTech Director', version: '1.4.0', scope: 'LOCAL_DIRECTOR', active: true },
  { id: 'm2', name: 'Global AI Core Recommendations', version: '3.2.1', scope: 'GLOBAL_AI_CORE', active: true },
  { id: 'm3', name: 'Global AI Core Safety', version: '2.8.0', scope: 'GLOBAL_AI_CORE', active: true },
];
export function AISyncPage() {
  return <section className="ai-sync-page" aria-labelledby="ai-sync-title"><div className="sync-header"><div><p className="eyebrow">Mock data only</p><h2 id="ai-sync-title">AI Director ↔ Global AI Core Sync</h2></div><button type="button">Force mock sync</button></div><div className="sync-grid"><StatusCard status="ACTIVE" lastSynchronizedAt="2026-08-09T12:00:00Z" /><ModelVersionList models={models} /><ConflictList conflicts={conflicts} /><SyncHistory events={history} /></div></section>;
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
