import type { DecisionRecord } from '../../memory/types';

export interface DecisionHistoryProps {
  decisions: readonly DecisionRecord[];
}

export function DecisionHistory({ decisions }: DecisionHistoryProps) {
  return (
    <section className="card" aria-label="Decision History">
      <h3 className="card-title">Decision History</h3>
      {decisions.length === 0 ? (
        <p className="muted">No decisions recorded yet.</p>
      ) : (
        <ul className="decision-list">
          {decisions.map((decision) => (
            <li key={decision.id} className="decision-item">
              <div className="decision-head">
                <strong>{decision.title}</strong>
                <span
                  className={`outcome-badge outcome-badge--${decision.outcome.toLowerCase()}`}
                >
                  {decision.outcome}
                </span>
              </div>
              <span className="muted">{decision.date}</span>
              <p>{decision.impact}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
