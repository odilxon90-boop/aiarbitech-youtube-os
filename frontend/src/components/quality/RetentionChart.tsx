export interface RetentionPoint {
  timestampSeconds: number;
  retentionPercent: number;
}

export function RetentionChart({ points, confidence }: { points: readonly RetentionPoint[]; confidence: number }) {
  const chartPoints = points.map((point, index) => `${index * 100},${100 - point.retentionPercent}`).join(' ');
  return (
    <section className="card quality-card" aria-labelledby="retention-title">
      <p className="section-kicker">Mock prediction</p>
      <h2 id="retention-title">Retention prediction</h2>
      <svg className="retention-chart" viewBox="0 0 300 100" role="img" aria-label={`Retention confidence ${confidence}%`}>
        <polyline points={chartPoints} fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
      <p className="muted">Estimated viewer retention with {confidence}% confidence.</p>
    </section>
  );
}
