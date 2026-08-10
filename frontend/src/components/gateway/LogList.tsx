<<<<<<< HEAD
import type { GatewayLogEntry } from '../../gateway/types';

const OUTCOME_CLASS: Record<GatewayLogEntry['outcome'], string> = {
  SUCCESS: 'outcome--success',
  ERROR: 'outcome--error',
  TIMEOUT: 'outcome--timeout',
  CIRCUIT_OPEN: 'outcome--circuit',
};

export interface LogListProps {
  entries: readonly GatewayLogEntry[];
}

export function LogList({ entries }: LogListProps) {
  return (
    <section className="card" aria-label="Gateway Logs">
      <h3 className="card-title">Gateway Request Logs</h3>
      <p className="muted">{entries.length} recent requests</p>
      {entries.length === 0 ? (
        <p className="muted">No log entries found.</p>
      ) : (
        <ul className="gateway-log-list">
          {entries.map((entry) => (
            <li key={entry.id} className="gateway-log-item">
              <div className="log-head">
                <code className="log-method">{entry.method}</code>
                <span className="log-endpoint">{entry.endpointName}</span>
                <span className={`outcome-badge ${OUTCOME_CLASS[entry.outcome]}`}>{entry.outcome}</span>
                <span className="log-status">{entry.statusCode}</span>
              </div>
              <div className="log-meta">
                <span className="muted">{entry.latencyMs} ms</span>
                <span className="muted">{entry.actor}</span>
                <span className="muted">{entry.calledAt.replace('T', ' ').slice(0, 19)} UTC</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
=======
export interface GatewayLog { id: string; endpoint: string; status: string; latencyMs: number; }
export function LogList({ logs }: { logs: readonly GatewayLog[] }) { return <section className="card gateway-card gateway-card--wide" aria-labelledby="gateway-logs-title"><p className="section-kicker">Last 50 mock calls</p><h2 id="gateway-logs-title">Request logs</h2><ul className="gateway-list">{logs.map((log) => <li key={log.id}><span>{log.endpoint}: {log.status}</span><small>{log.latencyMs}ms</small></li>)}</ul></section>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
