import type { ActivityItem } from '../../dashboard/types';

export interface RecentActivityListProps {
  items: readonly ActivityItem[];
}

export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <section className="card" aria-label="Recent Activity">
      <h3 className="card-title">Recent Activity</h3>
      {items.length === 0 ? (
        <p className="muted">No recent activity.</p>
      ) : (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.id}>
              {item.message}
              <span>{item.at}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
