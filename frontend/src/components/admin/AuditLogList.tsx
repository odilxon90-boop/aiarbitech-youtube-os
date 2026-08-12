import type { AuditLogEntry } from '../../admin/types';

export interface AuditLog { id: string; timestamp: string; actor: string; action: string; }

interface AuditLogListProps {
  logs?: readonly AuditLog[];
  entries?: readonly AuditLogEntry[];
}

export function AuditLogList({ logs, entries }: AuditLogListProps) {
  const items = entries ?? logs ?? [];
  return (
    <section className="card admin-card admin-card--wide" aria-labelledby="admin-audit-title">
      <p className="section-kicker">{items.length} recent events</p>
      <h2 id="admin-audit-title">Audit Logs</h2>
      {items.length === 0 ? (
        <p>No audit log entries found.</p>
      ) : (
        <ul className="admin-list">
          {items.map((log) => (
            <li key={log.id}>
              <span>
                {log.action} by {log.actor}
                {'outcome' in log ? ` · ${log.outcome} · ${log.ip}` : ''}
              </span>
              <small>{'at' in log ? log.at : log.timestamp}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
