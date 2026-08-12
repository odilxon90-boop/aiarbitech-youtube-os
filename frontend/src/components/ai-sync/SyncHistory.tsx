import type { SyncHistoryEntry } from '../../ai-sync/types';

export interface SyncHistoryItem { id: string; timestamp: string; status: string; detail: string; }

interface SyncHistoryProps {
  events?: readonly SyncHistoryItem[];
  entries?: readonly SyncHistoryEntry[];
}

export function SyncHistory({ events, entries }: SyncHistoryProps) {
  const items = entries ?? events ?? [];
  return (
    <section className="card sync-card sync-card--wide" aria-labelledby="sync-history-title">
      <p className="section-kicker">Last 20 sync events</p>
      <h2 id="sync-history-title">Sync History ({items.length})</h2>
      {items.length === 0 ? (
        <p>No sync history available.</p>
      ) : (
        <ul className="sync-list">
          {items.map((event) => (
            <li key={event.id}>
              <span>{event.status}: {'details' in event ? event.details : event.detail}</span>
              <small>{event.timestamp}{'durationMs' in event ? ` · ${event.durationMs}ms` : ''}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
