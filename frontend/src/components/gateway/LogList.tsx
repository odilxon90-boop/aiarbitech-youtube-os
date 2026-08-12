import type { GatewayLogEntry } from '../../gateway/types';

export interface GatewayLog { id: string; endpoint: string; status: string; latencyMs: number; }

interface LogListProps {
  logs?: readonly GatewayLog[];
  entries?: readonly GatewayLogEntry[];
}

export function LogList({ logs, entries }: LogListProps) {
  const items = entries ?? logs ?? [];
  return (
    <section className="card gateway-card gateway-card--wide" aria-labelledby="gateway-logs-title">
      <p className="section-kicker">{items.length} recent requests</p>
      <h2 id="gateway-logs-title">Gateway Request Logs</h2>
      {items.length === 0 ? (
        <p>No log entries found.</p>
      ) : (
        <ul className="gateway-list">
          {items.map((log) => (
            <li key={log.id}>
              <span>
                {'endpointName' in log ? log.endpointName : log.endpoint}: {'outcome' in log ? log.outcome : log.status}
                {'statusCode' in log ? ` · ${log.statusCode}` : ''}
              </span>
              <small>{log.latencyMs}{'endpointName' in log ? ' ms' : 'ms'}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
