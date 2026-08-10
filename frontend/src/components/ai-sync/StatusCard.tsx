import type { SyncStatusResponse } from '../../ai-sync/types';

export interface StatusCardProps {
  status: SyncStatusResponse;
}

export function StatusCard({ status }: StatusCardProps) {
  const signal = status.status === 'ACTIVE' ? '🟢' : status.status === 'IDLE' ? '🟡' : status.status === 'ERROR' ? '🔴' : '⚪';
  return (
    <section className="card" aria-label="Sync Status">
      <h3 className="card-title">Sync Status {signal}</h3>
      <div className="sync-status-grid">
        <div>
          <span>Status</span>
          <strong>{status.status}</strong>
        </div>
        <div>
          <span>Local Version</span>
          <strong>{status.localVersion}</strong>
        </div>
        <div>
          <span>Global Version</span>
          <strong>{status.globalVersion}</strong>
        </div>
        <div>
          <span>Last Sync</span>
          <strong>{new Date(status.lastSyncAt).toLocaleString()}</strong>
        </div>
      </div>
      <p className="muted">{status.message}</p>
    </section>
  );
}
