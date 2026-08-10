<<<<<<< HEAD
import type { AuditLogEntry } from '../../admin/types';

const OUTCOME_CLASS: Record<AuditLogEntry['outcome'], string> = {
  SUCCESS: 'outcome--success',
  FAILURE: 'outcome--failure',
};

export interface AuditLogListProps {
  entries: readonly AuditLogEntry[];
}

export function AuditLogList({ entries }: AuditLogListProps) {
  return (
    <section className="card" aria-label="Audit Logs">
      <h3 className="card-title">Audit Logs</h3>
      <p className="muted">{entries.length} recent events</p>
      {entries.length === 0 ? (
        <p className="muted">No audit log entries found.</p>
      ) : (
        <ul className="audit-log-list">
          {entries.map((entry) => (
            <li key={entry.id} className="audit-log-item">
              <div className="audit-log-head">
                <strong>{entry.action}</strong>
                <span className={`outcome-badge ${OUTCOME_CLASS[entry.outcome]}`}>{entry.outcome}</span>
              </div>
              <div className="audit-log-meta">
                <span>{entry.actor} ({entry.actorRole})</span>
                <span>{entry.resource}/{entry.resourceId}</span>
              </div>
              <div className="audit-log-footer">
                <span className="muted">{entry.at.replace('T', ' ').slice(0, 19)} UTC</span>
                <span className="muted ip-addr">{entry.ip}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
=======
export interface AuditLog { id: string; timestamp: string; actor: string; action: string; }
export function AuditLogList({ logs }: { logs: readonly AuditLog[] }) {
  return <section className="card admin-card admin-card--wide" aria-labelledby="admin-audit-title"><p className="section-kicker">Mock audit trail</p><h2 id="admin-audit-title">Audit logs</h2><ul className="admin-list">{logs.map((log) => <li key={log.id}><span>{log.action} by {log.actor}</span><small>{log.timestamp}</small></li>)}</ul></section>;
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
