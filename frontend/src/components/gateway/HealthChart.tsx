<<<<<<< HEAD
import type { GatewayHealthResponse, GatewayHealthMetric } from '../../gateway/types';

const STATUS_ICON: Record<GatewayHealthMetric['status'], string> = {
  OK: '🟢',
  DEGRADED: '🟡',
  DOWN: '🔴',
};

export interface HealthChartProps {
  health: GatewayHealthResponse;
}

export function HealthChart({ health }: HealthChartProps) {
  const maxLatency = Math.max(...health.metrics.map((m) => m.latencyMs), 1);

  return (
    <section className="card" aria-label="Gateway Health">
      <h3 className="card-title">
        Gateway Health — {STATUS_ICON[health.overall]} {health.overall}
      </h3>
      <ul className="health-chart-list">
        {health.metrics.map((metric) => (
          <li key={metric.service} className="health-chart-item">
            <div className="health-chart-head">
              <span>{STATUS_ICON[metric.status]}</span>
              <strong>{metric.service}</strong>
              <span className="health-availability">{metric.availability.toFixed(2)}%</span>
            </div>
            <div className="health-bar-row">
              <div
                className="health-bar"
                role="meter"
                aria-label={`${metric.service} latency`}
                aria-valuenow={metric.latencyMs}
                aria-valuemin={0}
                aria-valuemax={maxLatency}
              >
                <div
                  className="health-bar-fill"
                  style={{ width: `${Math.round((metric.latencyMs / maxLatency) * 100)}%` }}
                />
              </div>
              <span className="health-latency">{metric.latencyMs} ms</span>
            </div>
            <div className="health-chart-footer">
              <span className="muted">Error rate: {metric.errorRate.toFixed(1)}%</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
=======
export interface GatewayHealth { metric: string; value: string; status: string; }
export function HealthChart({ metrics }: { metrics: readonly GatewayHealth[] }) { return <section className="card gateway-card" aria-labelledby="gateway-health-title"><p className="section-kicker">Mock health checks</p><h2 id="gateway-health-title">Health</h2><ul className="gateway-list">{metrics.map((metric) => <li key={metric.metric}><span>{metric.metric}</span><strong>{metric.value} · {metric.status}</strong></li>)}</ul></section>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
