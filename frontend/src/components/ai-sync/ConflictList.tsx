import type { Conflict } from '../../ai-sync/types';

export interface SyncConflict { id: string; subject: string; localDecision: string; globalRecommendation: string; resolution: string; }

interface ConflictListProps {
  conflicts: readonly (Conflict | SyncConflict)[];
  onResolve?: (id: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL') => void;
}

export function ConflictList({ conflicts, onResolve }: ConflictListProps) {
  return (
    <section className="card sync-card" aria-labelledby="sync-conflicts-title">
      <p className="section-kicker">Mock conflict detection</p>
      <h2 id="sync-conflicts-title">Conflicts ({conflicts.length})</h2>
      {conflicts.length === 0 ? (
        <p>No conflicts detected.</p>
      ) : (
        <ul className="sync-list">
          {conflicts.map((conflict) => {
            const typed = 'type' in conflict;
            const label = typed ? conflict.type : conflict.subject;
            const local = typed ? conflict.localValue : conflict.localDecision;
            const global = typed ? conflict.globalValue : conflict.globalRecommendation;
            const state = typed ? conflict.status : conflict.resolution;
            const resolution = typed && conflict.resolution ? conflict.resolution.resolution : state;
            const open = typed ? conflict.status === 'OPEN' : conflict.resolution === 'UNRESOLVED';
            return (
              <li key={conflict.id}>
                <span>{label}: {local} / {global}</span>
                <small>{state}{resolution !== state ? ` · ${resolution}` : ''}</small>
                {open && onResolve && (
                  <div>
                    <button type="button" onClick={() => onResolve(conflict.id, 'LOCAL')}>Accept Local</button>
                    <button type="button" onClick={() => onResolve(conflict.id, 'GLOBAL')}>Accept Global</button>
                    <button type="button" onClick={() => onResolve(conflict.id, 'MANUAL')}>Manual Override</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
