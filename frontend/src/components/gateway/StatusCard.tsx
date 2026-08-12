import type { GatewayStatusResponse } from '../../gateway/types';

export function StatusCard({ status }: { status: GatewayStatusResponse | string }) {
  const data = typeof status === 'string' ? undefined : status;
  const state = typeof status === 'string' ? status : status.status;
  const icon = state === 'ACTIVE' ? '🟢' : state === 'DEGRADED' ? '🟡' : '🔴';
  return (
    <section className="card gateway-card" aria-labelledby="gateway-status-title">
      <p className="section-kicker">Mock gateway</p>
      <h2 id="gateway-status-title">Gateway Status</h2>
      <strong className="gateway-status">{icon} {state}</strong>
      {data && (
        <dl>
          <dt>Version</dt><dd>{data.version}</dd>
          <dt>Uptime</dt><dd>{data.uptime}</dd>
          <dt>Active connections</dt><dd>{data.activeConnections}</dd>
          <dt>Circuit breaker</dt><dd>{data.circuitBreaker}</dd>
          <dt>Rate limit remaining</dt><dd>{data.rateLimitRemaining.toLocaleString()}</dd>
        </dl>
      )}
    </section>
  );
}
