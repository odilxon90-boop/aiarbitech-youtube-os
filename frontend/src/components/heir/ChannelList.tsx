import type { ChannelStat } from '../../heir/types';

export interface ChannelListProps {
  channels: readonly ChannelStat[];
}

export function ChannelList({ channels }: ChannelListProps) {
  return (
    <section className="card" aria-label="Channel Statistics">
      <h3 className="card-title">Channels ({channels.length})</h3>
      {channels.length === 0 ? (
        <p className="muted">No channels found.</p>
      ) : (
        <ul className="channel-list">
          {channels.map((channel) => (
            <li key={channel.id} className="channel-item">
              <div className="channel-head">
                <strong>{channel.title}</strong>
                <span className="monetization-badge">{channel.monetized ? 'Monetized' : 'Not monetized'}</span>
              </div>
              <div className="channel-meta">
                <span>{channel.subscribers} subscribers</span>
                <span className={channel.growth >= 0 ? 'trend-up' : 'trend-down'}>
                  {channel.growth >= 0 ? '+' : ''}{channel.growth}% growth
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
