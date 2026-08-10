import type { GatewayStatusResponse } from '../../gateway/types';

const STATUS_ICON: Record<GatewayStatusResponse['status'], string> = {
  ACTIVE: '🟢',
  DEGRADED: '🟡',
  DOWN: '🔴',
};

const CB_ICON: Record<GatewayStatusResponse['circuitBreaker'], string> = {
  CLOSED: '✅',
  HALF_OPEN: '⚠️',
  OPEN: '🚫',
};

export interface StatusCardProps {
  status: GatewayStatusResponse;
}

export function StatusCard({ status }: StatusCardProps) {
  return (
    <section className="card" aria-label="Gateway Status">
      <h3 className="card-title">
        {STATUS_ICON[status.status]} Integration Gateway — {status.status}
      </h3>
      <div className="gateway-status-grid">
        <div>
          <span className="muted">Version</span>
          <strong>{status.version}</strong>
        </div>
        <div>
          <span className="muted">Uptime</span>
          <strong>{status.uptime}</strong>
        </div>
        <div>
          <span className="muted">Connections</span>
          <strong>{status.activeConnections}</strong>
        </div>
        <div>
          <span className="muted">Circuit Breaker</span>
          <strong>{CB_ICON[status.circuitBreaker]} {status.circuitBreaker}</strong>
        </div>
        <div>
          <span className="muted">Rate Limit Remaining</span>
          <strong>{status.rateLimitRemaining.toLocaleString()}</strong>
        </div>
      </div>
      <p className="muted checked-at">Checked: {status.checkedAt.replace('T', ' ').slice(0, 19)} UTC</p>
    </section>
  );
}
