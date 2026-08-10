import type { AdminHealthResponse, AdminHealthMetric } from '../../admin/types';

const STATUS_ICON: Record<AdminHealthMetric['status'], string> = {
  OK: '🟢',
  DEGRADED: '🟡',
  DOWN: '🔴',
};

export interface HealthCardProps {
  health: AdminHealthResponse;
}

export function HealthCard({ health }: HealthCardProps) {
  return (
    <section className="card" aria-label="System Health">
      <h3 className="card-title">
        System Health — {STATUS_ICON[health.overall]} {health.overall}
      </h3>
      <ul className="health-metric-list">
        {health.metrics.map((metric) => (
          <li key={metric.service} className="health-metric-item">
            <div className="health-metric-head">
              <span className="health-status-icon">{STATUS_ICON[metric.status]}</span>
              <strong>{metric.service}</strong>
              <span className="health-latency">{metric.latencyMs} ms</span>
            </div>
            <p className="health-detail muted">{metric.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
