export interface HealthMetric { name: string; status: 'GREEN' | 'YELLOW' | 'RED'; detail: string; }
export function HealthCard({ metrics }: { metrics: readonly HealthMetric[] }) {
  return <section className="card admin-card admin-card--wide" aria-labelledby="admin-health-title"><p className="section-kicker">Mock system status</p><h2 id="admin-health-title">System health</h2><ul className="admin-list">{metrics.map((metric) => <li key={metric.name}><span>{metric.name}: {metric.detail}</span><small className={`health-status health-status--${metric.status.toLowerCase()}`}>{metric.status}</small></li>)}</ul></section>;
}
