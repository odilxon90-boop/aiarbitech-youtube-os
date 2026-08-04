import type { HealthStatus } from './types';

function HealthItem({ label, value }: { label: string; value: string }) {
  const healthy = value === 'ALIVE' || value === 'READY' || value === 'VALID';
  return (
    <li>
      <span className={`status-dot ${healthy ? 'status-dot--healthy' : ''}`} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </li>
  );
}

export function HealthStatusPage({ health }: { health: HealthStatus }) {
  return (
    <section className="card" aria-labelledby="health-title">
      <p className="section-kicker">Platform runtime</p>
      <h2 id="health-title">Health status</h2>
      <ul className="health-list">
        <HealthItem label="Backend liveness" value={health.live} />
        <HealthItem label="Platform readiness" value={health.ready} />
        <HealthItem label="Environment validation" value={health.environment} />
      </ul>
    </section>
  );
}
