import type { HealthMetric } from '../../president/types';

export interface HealthCardProps {
  metrics: readonly HealthMetric[];
}

export function HealthCard({ metrics }: HealthCardProps) {
  const healthy = metrics.filter((m) => m.status === 'HEALTHY').length;
  const degraded = metrics.filter((m) => m.status === 'DEGRADED').length;
  const critical = metrics.filter((m) => m.status === 'CRITICAL').length;
  const signal = critical > 0 ? '🔴' : degraded > 0 ? '🟡' : '🟢';

  return (
    <section className="card" aria-label="Platform Health">
      <h3 className="card-title">Platform Health {signal}</h3>
      <div className="health-summary">
        <span>{healthy} healthy</span>
        <span>{degraded} degraded</span>
        <span>{critical} critical</span>
      </div>
      <ul className="health-list">
        {metrics.map((metric) => (
          <li key={metric.id} className={`health-item health-item--${metric.status.toLowerCase()}`}>
            <strong>{metric.name}</strong>
            <span className="health-status">{metric.status}</span>
            <p className="muted">{metric.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
