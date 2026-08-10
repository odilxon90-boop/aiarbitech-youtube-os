import type { AIStatus } from '../../heir/types';

export interface AIStatusListProps {
  aiStatus: readonly AIStatus[];
}

export function AIStatusList({ aiStatus }: AIStatusListProps) {
  const signal = aiStatus.some((s) => s.state === 'ERROR') ? '🔴' : '🟢';
  return (
    <section className="card" aria-label="AI Director Status">
      <h3 className="card-title">AI Director Status {signal}</h3>
      <ul className="ai-status-list">
        {aiStatus.map((item) => (
          <li key={item.id} className={`ai-status-item ai-status-item--${item.state.toLowerCase()}`}>
            <div className="ai-status-head">
              <strong>{item.name}</strong>
              <span className="ai-state-badge">{item.state}</span>
            </div>
            <p className="muted">{item.message}</p>
            <small>Last active: {new Date(item.lastActive).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
