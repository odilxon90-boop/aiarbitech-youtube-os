import type { ChannelHealth } from '../../dashboard/types';

export interface ChannelHealthCardProps {
  health: ChannelHealth;
}

export function ChannelHealthCard({ health }: ChannelHealthCardProps) {
  return (
    <section className="card channel-health" aria-label="Channel Health">
      <h3 className="card-title">Channel Health</h3>
      <div className="channel-health__header">
        <span className="channel-health__score">{health.score}/100</span>
        <span className={`channel-health__label channel-health__label--${health.label.toLowerCase()}`}>{health.label}</span>
      </div>
      <ul className="channel-health__details">
        {health.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </section>
  );
}
