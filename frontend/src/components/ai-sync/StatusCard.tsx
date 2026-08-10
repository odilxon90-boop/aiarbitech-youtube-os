export function StatusCard({ status, lastSynchronizedAt }: { status: string; lastSynchronizedAt: string }) {
  return <section className="card sync-card" aria-labelledby="sync-status-title"><p className="section-kicker">Mock connection</p><h2 id="sync-status-title">Sync status</h2><strong className="sync-status">{status}</strong><p className="muted">Last sync: {lastSynchronizedAt}</p></section>;
}
