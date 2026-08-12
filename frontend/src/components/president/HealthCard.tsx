import type { HealthMetric } from '../../president/types';

interface LegacyHealthMetric { name: string; status: string; detail: string }

export function HealthCard({ metrics }: { metrics: readonly (HealthMetric | LegacyHealthMetric)[] }) {
  const count = (status: string): number => metrics.filter((metric) => metric.status === status).length;
  return (
    <article>
      <h3>Platform Health</h3>
      <p>{count('HEALTHY')} healthy · {count('DEGRADED')} degraded · {count('CRITICAL')} critical</p>
      {metrics.map((metric) => (
        <p key={'id' in metric ? metric.id : metric.name}>
          <strong>{metric.status}</strong> {metric.name}: {'message' in metric ? metric.message : metric.detail}
        </p>
      ))}
    </article>
  );
}
