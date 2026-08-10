import type { Weakness } from '../../intelligence/types';

export interface WeaknessListProps {
  weaknesses: readonly Weakness[];
}

export function WeaknessList({ weaknesses }: WeaknessListProps) {
  return (
    <section className="card" aria-label="Weaknesses">
      <h3 className="card-title">Weaknesses</h3>
      {weaknesses.length === 0 ? (
        <p className="muted">No weaknesses recorded yet.</p>
      ) : (
        <ul className="attribute-list">
          {weaknesses.map((weakness) => (
            <li key={weakness.id}>
              <strong>{weakness.title}</strong>
              <p>{weakness.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
