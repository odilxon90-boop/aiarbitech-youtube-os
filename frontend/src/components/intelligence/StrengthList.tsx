import type { Strength } from '../../intelligence/types';

export interface StrengthListProps {
  strengths: readonly Strength[];
}

export function StrengthList({ strengths }: StrengthListProps) {
  return (
    <section className="card" aria-label="Strengths">
      <h3 className="card-title">Strengths</h3>
      {strengths.length === 0 ? (
        <p className="muted">No strengths recorded yet.</p>
      ) : (
        <ul className="attribute-list">
          {strengths.map((strength) => (
            <li key={strength.id}>
              <strong>{strength.title}</strong>
              <p>{strength.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
