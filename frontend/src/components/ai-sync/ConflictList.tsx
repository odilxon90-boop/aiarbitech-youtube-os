export interface SyncConflict { id: string; subject: string; localDecision: string; globalRecommendation: string; resolution: string; }
export function ConflictList({ conflicts }: { conflicts: readonly SyncConflict[] }) {
  return <section className="card sync-card" aria-labelledby="sync-conflicts-title"><p className="section-kicker">Mock conflict detection</p><h2 id="sync-conflicts-title">Conflicts</h2><ul className="sync-list">{conflicts.map((conflict) => <li key={conflict.id}><span>{conflict.subject}: {conflict.localDecision} / {conflict.globalRecommendation}</span><small>{conflict.resolution}</small></li>)}</ul></section>;
}
