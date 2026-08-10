<<<<<<< HEAD
import type { ChannelStat } from '../../president/types';

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
=======
export function ChannelList({ channels }: { channels: readonly { id: string; name: string; subscribers: number; monetized: boolean; growthPercent: number }[] }) { return <article><h3>Channels</h3>{channels.map((channel) => <p key={channel.id}>{channel.name} - {channel.subscribers.toLocaleString()} subscribers, {channel.growthPercent}% growth, {channel.monetized ? 'monetized' : 'not monetized'}</p>)}</article>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
