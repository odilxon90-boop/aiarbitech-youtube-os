<<<<<<< HEAD
import type { RiskAlert } from '../../president/types';

export interface RiskListProps {
  risks: readonly RiskAlert[];
}

export function RiskList({ risks }: RiskListProps) {
  return (
    <section className="card" aria-label="Risk Alerts">
      <h3 className="card-title">Risk Alerts</h3>
      {risks.length === 0 ? (
        <p className="muted">No risk alerts.</p>
      ) : (
        <ul className="risk-list">
          {risks.map((risk) => (
            <li key={risk.id} className={`risk-item risk-item--${risk.severity.toLowerCase()}`}>
              <div className="risk-head">
                <strong>{risk.title}</strong>
                <span className={`severity-badge severity-badge--${risk.severity.toLowerCase()}`}>{risk.severity}</span>
              </div>
              <p className="muted">{risk.description}</p>
              <small>{risk.category}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
=======
export function RiskList({ risks }: { risks: readonly { id: string; title: string; severity: string; detail: string }[] }) { return <article><h3>Risk Alerts</h3>{risks.map((risk) => <p key={risk.id}><strong>{risk.severity}</strong> {risk.title}: {risk.detail}</p>)}</article>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
