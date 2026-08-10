import type { AdminChannel } from '../../admin/types';

const STATUS_CLASS: Record<AdminChannel['moderationStatus'], string> = {
  APPROVED: 'mod-badge--approved',
  UNDER_REVIEW: 'mod-badge--review',
  SUSPENDED: 'mod-badge--suspended',
  FLAGGED: 'mod-badge--flagged',
};

export interface ChannelModerationProps {
  channels: readonly AdminChannel[];
}

export function ChannelModeration({ channels }: ChannelModerationProps) {
  const flagged = channels.filter((c) => c.moderationStatus !== 'APPROVED');
  return (
    <section className="card" aria-label="Channel Moderation">
      <h3 className="card-title">Channel Moderation</h3>
      <p className="muted">
        {channels.length} channels · {flagged.length} requiring attention
      </p>
      {channels.length === 0 ? (
        <p className="muted">No channels found.</p>
      ) : (
        <ul className="channel-moderation-list">
          {channels.map((channel) => (
            <li key={channel.id} className="channel-mod-item">
              <div className="channel-mod-head">
                <strong>{channel.title}</strong>
                <span className={`mod-badge ${STATUS_CLASS[channel.moderationStatus]}`}>
                  {channel.moderationStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="channel-mod-meta">
                <span>Owner: {channel.ownerName}</span>
                <span>{channel.subscriberCount} subscribers · {channel.videoCount} videos</span>
              </div>
              {channel.flags.length > 0 && (
                <div className="channel-flags">
                  {channel.flags.map((flag) => (
                    <span key={flag} className="flag-tag">⚠️ {flag}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
