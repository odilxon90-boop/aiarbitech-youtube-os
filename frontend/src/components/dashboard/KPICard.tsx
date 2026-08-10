import type { Kpi } from '../../dashboard/types';

interface KPICardProps {
  kpi: Kpi;
}

export function kpiDelta(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function KPICard({ kpi }: KPICardProps) {
  const positive = kpi.delta >= 0;
  return (
    <article className="kpi-card">
      <p className="kpi-label">{kpi.label}</p>
      <p className="kpi-value">{kpi.value}</p>
      <p className={`kpi-delta ${positive ? 'kpi-delta--up' : 'kpi-delta--down'}`}>
        {kpiDelta(kpi.delta)} <span className="kpi-hint">{kpi.hint}</span>
      </p>
    </article>
  );
}