import type { AdminHealthResponse } from '../../admin/types';

export interface HealthMetric { name: string; status: 'GREEN' | 'YELLOW' | 'RED'; detail: string; }

interface HealthCardProps {
  metrics?: readonly HealthMetric[];
  health?: AdminHealthResponse;
}

const statusIcon = (status: string): string => {
  if (status === 'OK' || status === 'GREEN') return '🟢';
  if (status === 'DEGRADED' || status === 'YELLOW') return '🟡';
  return '🔴';
};

export function HealthCard({ metrics, health }: HealthCardProps) {
  const items = health?.metrics ?? metrics ?? [];
  return (
    <section className="card admin-card admin-card--wide" aria-labelledby="admin-health-title">
      <p className="section-kicker">Overall: {health?.overall ?? 'Mock system status'}</p>
      <h2 id="admin-health-title">System Health</h2>
      <ul className="admin-list">
        {items.map((metric) => {
          const name = 'service' in metric ? metric.service : metric.name;
          return (
            <li key={name}>
              <span>{statusIcon(metric.status)} {name}: {metric.detail}</span>
              <small>{metric.status}{'latencyMs' in metric ? ` · ${metric.latencyMs} ms` : ''}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
