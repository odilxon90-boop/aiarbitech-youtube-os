export interface AdminChannel { id: string; name: string; status: string; }
export function ChannelModeration({ channels }: { channels: readonly AdminChannel[] }) {
  return <section className="card admin-card" aria-labelledby="admin-channels-title"><p className="section-kicker">Mock moderation</p><h2 id="admin-channels-title">Channels</h2><ul className="admin-list">{channels.map((channel) => <li key={channel.id}><span>{channel.name}</span><small>{channel.status}</small></li>)}</ul></section>;
}
