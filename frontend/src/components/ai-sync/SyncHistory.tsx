export interface SyncHistoryItem { id: string; timestamp: string; status: string; detail: string; }
export function SyncHistory({ events }: { events: readonly SyncHistoryItem[] }) {
  return <section className="card sync-card sync-card--wide" aria-labelledby="sync-history-title"><p className="section-kicker">Last 20 mock events</p><h2 id="sync-history-title">Sync history</h2><ul className="sync-list">{events.map((event) => <li key={event.id}><span>{event.status}: {event.detail}</span><small>{event.timestamp}</small></li>)}</ul></section>;
}
