import { ReadinessBadge } from './ReadinessBadge';

export interface ChecklistEntry {
  id: string;
  label: string;
  status: 'PASS' | 'FAIL';
}

export function Checklist({ items }: { items: readonly ChecklistEntry[] }) {
  return (
    <section className="card quality-card quality-card--wide" aria-labelledby="checklist-title">
      <p className="section-kicker">Publish controls</p>
      <h2 id="checklist-title">Quality checklist</h2>
      <ul className="quality-checklist">
        {items.map((item) => <li key={item.id}><span>{item.label}</span><ReadinessBadge status={item.status} /></li>)}
      </ul>
    </section>
  );
}
