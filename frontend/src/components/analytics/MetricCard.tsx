import type { MetricSummary } from '../../analytics/types';

export function formatDelta(delta: number): string {
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
}

export interface MetricCardProps {
  summary: MetricSummary;
}

export function MetricCard({ summary }: MetricCardProps) {
  const isPositive = summary.delta >= 0;
  return (
    <article className="metric-card">
      <p className="metric-card__label">{summary.label}</p>
      <p className="metric-card__value">{summary.display}</p>
      <p
        className={
          isPositive
            ? 'metric-card__delta metric-card__delta--up'
            : 'metric-card__delta metric-card__delta--down'
        }
      >
        {formatDelta(summary.delta)}
      </p>
    </article>
  );
}