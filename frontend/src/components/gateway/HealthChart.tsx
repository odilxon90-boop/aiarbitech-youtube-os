import type { GatewayHealthResponse } from '../../gateway/types';

export interface GatewayHealth { metric: string; value: string; status: string; }

interface HealthChartProps {
  metrics?: readonly GatewayHealth[];
  health?: GatewayHealthResponse;
}

export function HealthChart({ metrics, health }: HealthChartProps) {
  const items = health?.metrics ?? metrics ?? [];
  return (
    <section className="card gateway-card" aria-labelledby="gateway-health-title">
      <p className="section-kicker">Overall: {health?.overall ?? 'Mock health checks'}</p>
      <h2 id="gateway-health-title">Gateway Health</h2>
      <ul className="gateway-list">
        {items.map((metric) => {
          if ('service' in metric) {
            const icon = metric.status === 'OK' ? '🟢' : metric.status === 'DEGRADED' ? '🟡' : '🔴';
            return (
              <li key={metric.service}>
                <span>{icon} {metric.service}</span>
                <strong>{metric.availability.toFixed(2)}% availability · {metric.errorRate.toFixed(1)}% errors · {metric.latencyMs} ms</strong>
              </li>
            );
          }
          return <li key={metric.metric}><span>{metric.metric}</span><strong>{metric.value} · {metric.status}</strong></li>;
        })}
      </ul>
    </section>
  );
}
