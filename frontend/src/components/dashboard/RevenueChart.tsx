import type { RevenueSeries } from '../../dashboard/types';

export interface RevenueChartProps {
  series: RevenueSeries;
}

export function RevenueChart({ series }: RevenueChartProps) {
  if (series.points.length === 0) {
    return <p className="muted">No revenue data available.</p>;
  }
  const values = series.points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 720;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = series.points.map((p, idx) => ({
    x: padding.left + (idx / (series.points.length - 1)) * chartW,
    y: padding.top + chartH - ((p.value - min) / range) * chartH,
    value: p.value,
    date: p.date,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  const yTicks = 4;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const v = min + (range * i) / (yTicks - 1);
    return { label: `$${v.toFixed(0)}`, y: padding.top + chartH - (i / (yTicks - 1)) * chartH };
  });

  return (
    <section className="card revenue-chart" aria-label="Revenue Chart">
      <h3 className="card-title">Revenue (last 30 days)</h3>
      <svg className="revenue-chart__svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {yLabels.map((tick, i) => (
          <g key={`y-${i}`}>
            <line x1={padding.left} x2={width - padding.right} y1={tick.y} y2={tick.y} className="revenue-chart__grid" />
            <text x={padding.left - 6} y={tick.y + 4} textAnchor="end" className="revenue-chart__axis">
              {tick.label}
            </text>
          </g>
        ))}
        <polyline points={polyline} className="revenue-chart__line" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} className="revenue-chart__dot" />
        ))}
      </svg>
      <div className="revenue-chart__summary">
        <span>${series.points[series.points.length - 1]?.value.toFixed(2) ?? '$0.00'} latest</span>
        <span>${((values.reduce((a, b) => a + b, 0) / values.length) || 0).toFixed(2)} avg</span>
      </div>
    </section>
  );
}
