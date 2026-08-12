import type { Conflict, ModelVersion, SyncHistoryEntry, SyncStatusResponse } from '../ai-sync/types';
import { ConflictList } from '../components/ai-sync/ConflictList';
import { ModelVersionList } from '../components/ai-sync/ModelVersionList';
import { StatusCard } from '../components/ai-sync/StatusCard';
import { SyncHistory } from '../components/ai-sync/SyncHistory';

interface AISyncPageProps {
  initialStatus?: SyncStatusResponse;
  initialHistory?: readonly SyncHistoryEntry[];
  initialConflicts?: readonly Conflict[];
  initialModels?: readonly ModelVersion[];
}

export function AISyncPage({
  initialStatus,
  initialHistory,
  initialConflicts,
  initialModels,
}: AISyncPageProps) {
  if (!initialStatus || !initialHistory || !initialConflicts || !initialModels) {
    return <section className="ai-sync-page"><h2>Global AI Core Sync</h2><p>Loading AI Sync status…</p></section>;
  }
  return (
    <section className="ai-sync-page" aria-labelledby="ai-sync-title">
      <div className="sync-header">
        <div><p className="eyebrow">AI Director integration</p><h2 id="ai-sync-title">Global AI Core Sync</h2></div>
        <button type="button">Force Sync</button>
      </div>
      <div className="sync-grid">
        <StatusCard status={initialStatus} />
        <ModelVersionList models={initialModels} />
        <ConflictList conflicts={initialConflicts} onResolve={() => undefined} />
        <SyncHistory entries={initialHistory} />
      </div>
    </section>
  );
}
