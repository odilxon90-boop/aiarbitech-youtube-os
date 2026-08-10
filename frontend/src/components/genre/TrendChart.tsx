import type { GenreTrend } from '../../genre/types';

export interface TrendChartProps {
  trends: readonly GenreTrend[];
}

export function TrendChart({ trends }: TrendChartProps) {
  const top = [...trends].sort((a, b) => b.currentScore - a.currentScore).slice(0, 5);

  return (
    <section className="card" aria-label="Genre Trends">
      <h3 className="card-title">Genre Trends (Top 5)</h3>
      <ul className="trend-list">
        {top.map((trend) => {
          const deltaSign = trend.delta >= 0 ? '+' : '';
          return (
            <li key={trend.id} className="trend-item">
              <div className="trend-head">
                <strong>{trend.name}</strong>
                <span
                  className={`trend-delta ${trend.delta >= 0 ? 'trend-delta--up' : 'trend-delta--down'}`}
                >
                  {deltaSign}{trend.delta.toFixed(1)}%
                </span>
              </div>
              <div className="trend-score-row">
                <span className="trend-score">{trend.currentScore}/100</span>
                <div
                  className="trend-bar"
                  role="progressbar"
                  aria-valuenow={trend.currentScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="trend-bar-fill" style={{ width: `${trend.currentScore}%` }} />
                </div>
              </div>
              <div className="trend-sparkline" aria-hidden="true">
                {trend.points.slice(-7).map((pt) => (
                  <span
                    key={pt.date}
                    className="sparkline-dot"
                    title={`${pt.date}: ${pt.score}`}
                    style={{ height: `${Math.round((pt.score / 100) * 32)}px` }}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
