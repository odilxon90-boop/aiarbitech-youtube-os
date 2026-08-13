export function TrendChart({ points }: { points: readonly number[] }) {
  const peak = Math.max(...points, 1);
  return <section className="music-trend"><div><h3>Music trend activity</h3><p className="muted">Mock library activity over the last 7 days</p></div><div className="music-trend__bars" role="img" aria-label="Music trend chart">{points.map((point, index) => <span key={index} title={`${point} plays`} style={{ height: `${Math.round((point / peak) * 100)}%` }} />)}</div></section>;
}
