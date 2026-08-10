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
