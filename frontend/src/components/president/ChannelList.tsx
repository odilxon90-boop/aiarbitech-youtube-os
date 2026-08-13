import type { ChannelStat } from '../../president/types';

interface LegacyChannel { id: string; name: string; subscribers: number; monetized: boolean; growthPercent: number; }

export function ChannelList({ channels }: { channels: readonly (ChannelStat | LegacyChannel)[] }) {
  return <article className="president-card"><h3>Channels ({channels.length})</h3>{channels.length === 0 ? <p>No channels found.</p> : channels.map((channel) => {
    const title = 'title' in channel ? channel.title : channel.name;
    const growth = 'growth' in channel ? channel.growth : channel.growthPercent;
    const subscribers = typeof channel.subscribers === 'number' ? channel.subscribers.toLocaleString() : channel.subscribers;
    return <p key={channel.id}><strong>{title}</strong> · {subscribers} subscribers · {growth >= 0 ? '+' : ''}{growth}% · {channel.monetized ? 'Monetized' : 'Not monetized'}</p>;
  })}</article>;
}
