import type { MetricSeries } from '../../analytics/types';

export interface TimeSeriesChartProps {
  series: MetricSeries;
}

const WIDTH = 560;
const HEIGHT = 180;
const PAD = 16;

export function TimeSeriesChart({ series }: TimeSeriesChartProps) {
  const { label, points } = series;
  if (points.length === 0) {
    return <p className="muted">No data available.</p>;
  }

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = points.length > 1 ? (WIDTH - 2 * PAD) / (points.length - 1) : 0;

  const y = (value: number): number =>
    HEIGHT - PAD - ((value - min) / span) * (HEIGHT - 2 * PAD);

  return (
    <div className="time-series" data-testid="time-series-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`${label} over time`}
        className="time-series__svg"
      >
        {points.map((point, index) => (
          <circle
            key={`${point.date}-${index}`}
            cx={PAD + index * step}
            cy={y(point.value)}
            r="2.5"
            fill="#57d6ff"
          />
        ))}
        <polyline
          fill="none"
          stroke="#57d6ff"
          strokeWidth="2"
          points={points.map((point, index) => `${PAD + index * step},${y(point.value)}`).join(' ')}
        />
      </svg>
    </div>
  );
}
