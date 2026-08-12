import type { SyncStatusResponse } from '../../ai-sync/types';

interface StatusCardProps {
  status: SyncStatusResponse | string;
  lastSynchronizedAt?: string;
}

export function StatusCard({ status, lastSynchronizedAt }: StatusCardProps) {
  const data = typeof status === 'string' ? undefined : status;
  const state = typeof status === 'string' ? status : status.status;
  return (
    <section className="card sync-card" aria-labelledby="sync-status-title">
      <p className="section-kicker">Mock connection</p>
      <h2 id="sync-status-title">Sync Status</h2>
      <strong className="sync-status">{state}</strong>
      <p className="muted">Last sync: {data?.lastSyncAt ?? lastSynchronizedAt ?? 'Never'}</p>
      {data && <p>Local {data.localVersion} · Global {data.globalVersion}</p>}
      {data?.message && <p>{data.message}</p>}
    </section>
  );
}
