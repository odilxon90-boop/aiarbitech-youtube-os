<<<<<<< HEAD
import type { SyncHistoryEntry } from '../../ai-sync/types';

export interface SyncHistoryProps {
  entries: readonly SyncHistoryEntry[];
}

export function SyncHistory({ entries }: SyncHistoryProps) {
  return (
    <section className="card" aria-label="Sync History">
      <h3 className="card-title">Sync History ({entries.length})</h3>
      {entries.length === 0 ? (
        <p className="muted">No sync history available.</p>
      ) : (
        <ul className="sync-history-list">
          {entries.slice(0, 20).map((entry) => (
            <li key={entry.id} className="sync-history-item">
              <div className="sync-history-head">
                <strong>{new Date(entry.timestamp).toLocaleString()}</strong>
                <span className={entry.status === 'ACTIVE' ? 'trend-up' : 'trend-down'}>{entry.status}</span>
              </div>
              <p className="muted">{entry.details}</p>
              <small>{entry.durationMs}ms</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
=======
export interface SyncHistoryItem { id: string; timestamp: string; status: string; detail: string; }
export function SyncHistory({ events }: { events: readonly SyncHistoryItem[] }) {
  return <section className="card sync-card sync-card--wide" aria-labelledby="sync-history-title"><p className="section-kicker">Last 20 mock events</p><h2 id="sync-history-title">Sync history</h2><ul className="sync-list">{events.map((event) => <li key={event.id}><span>{event.status}: {event.detail}</span><small>{event.timestamp}</small></li>)}</ul></section>;
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
