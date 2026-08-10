export interface AuditLog { id: string; timestamp: string; actor: string; action: string; }
export function AuditLogList({ logs }: { logs: readonly AuditLog[] }) {
  return <section className="card admin-card admin-card--wide" aria-labelledby="admin-audit-title"><p className="section-kicker">Mock audit trail</p><h2 id="admin-audit-title">Audit logs</h2><ul className="admin-list">{logs.map((log) => <li key={log.id}><span>{log.action} by {log.actor}</span><small>{log.timestamp}</small></li>)}</ul></section>;
}
