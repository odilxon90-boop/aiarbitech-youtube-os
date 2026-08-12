import type { AdminChannel } from '../../admin/types';

interface LegacyChannel {
  id: string;
  name: string;
  status: string;
}

type Channel = AdminChannel | LegacyChannel;

export function ChannelModeration({ channels }: { channels: readonly Channel[] }) {
  const flagged = channels.filter((channel) =>
    'flags' in channel ? channel.flags.length > 0 : channel.status !== 'APPROVED',
  ).length;
  return (
    <section className="card admin-card" aria-labelledby="admin-channels-title">
      <p className="section-kicker">{channels.length} channels · {flagged} requiring attention</p>
      <h2 id="admin-channels-title">Channel Moderation</h2>
      {channels.length === 0 ? (
        <p>No channels found.</p>
      ) : (
        <ul className="admin-list">
          {channels.map((channel) => {
            const title = 'title' in channel ? channel.title : channel.name;
            const status = 'moderationStatus' in channel ? channel.moderationStatus : channel.status;
            const flags = 'flags' in channel ? channel.flags : [];
            return (
              <li key={channel.id}>
                <span>{title}</span>
                <small>{status.replaceAll('_', ' ')}{flags.length > 0 ? ` · ${flags.join(', ')}` : ''}</small>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
