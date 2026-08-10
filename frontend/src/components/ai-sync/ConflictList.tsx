<<<<<<< HEAD
import type { Conflict } from '../../ai-sync/types';

export interface ConflictListProps {
  conflicts: readonly Conflict[];
  onResolve: (conflictId: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL') => void;
}

export function ConflictList({ conflicts, onResolve }: ConflictListProps) {
  return (
    <section className="card" aria-label="Conflicts">
      <h3 className="card-title">Conflicts ({conflicts.length})</h3>
      {conflicts.length === 0 ? (
        <p className="muted">No conflicts detected.</p>
      ) : (
        <ul className="conflict-list">
          {conflicts.map((conflict) => (
            <li key={conflict.id} className={`conflict-item conflict-item--${conflict.status.toLowerCase()}`}>
              <div className="conflict-head">
                <strong>{conflict.type}</strong>
                <span className={`status-badge ${conflict.status === 'OPEN' ? 'status-badge--editing' : 'status-badge--published'}`}>{conflict.status}</span>
              </div>
              <p className="muted">Local: {conflict.localValue} | Global: {conflict.globalValue}</p>
              <small>Detected: {new Date(conflict.detectedAt).toLocaleString()}</small>
              {conflict.status === 'OPEN' && (
                <div className="conflict-actions">
                  <button type="button" onClick={() => onResolve(conflict.id, 'LOCAL')}>Accept Local</button>
                  <button type="button" onClick={() => onResolve(conflict.id, 'GLOBAL')}>Accept Global</button>
                  <button type="button" onClick={() => onResolve(conflict.id, 'MANUAL')}>Manual Override</button>
                </div>
              )}
              {conflict.resolution && (
                <p className="muted">Resolved: {conflict.resolution.resolution} by {conflict.resolution.resolvedBy}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
=======
export interface SyncConflict { id: string; subject: string; localDecision: string; globalRecommendation: string; resolution: string; }
export function ConflictList({ conflicts }: { conflicts: readonly SyncConflict[] }) {
  return <section className="card sync-card" aria-labelledby="sync-conflicts-title"><p className="section-kicker">Mock conflict detection</p><h2 id="sync-conflicts-title">Conflicts</h2><ul className="sync-list">{conflicts.map((conflict) => <li key={conflict.id}><span>{conflict.subject}: {conflict.localDecision} / {conflict.globalRecommendation}</span><small>{conflict.resolution}</small></li>)}</ul></section>;
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
