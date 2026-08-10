import type { LearningEntry } from '../../memory/types';

export interface LearningSummaryProps {
  items: readonly LearningEntry[];
}

export function LearningSummary({ items }: LearningSummaryProps) {
  const adopted = items.filter((item) => item.result.toLowerCase().includes('adopted')).length;
  const rejected = items.filter((item) => item.result.toLowerCase().includes('rejected')).length;
  return (
    <section className="card" aria-label="Learning Summary">
      <h3 className="card-title">Learning Summary</h3>
      <div className="learning-meta">
        <span>{adopted} adopted</span>
        <span>{rejected} rejected</span>
      </div>
      <ul className="learning-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className="muted">{item.date}</span>
            <p>{item.event}</p>
            <small>{item.result}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
