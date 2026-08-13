import type { MusicTrack } from '../../music/types';

function duration(seconds: number): string { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }

export function TrackList({ tracks }: { tracks: readonly MusicTrack[] }) {
  return <section className="music-track-list"><h3>Available tracks ({tracks.length})</h3>{tracks.length === 0 ? <p className="muted">No tracks match your search.</p> : <ul>{tracks.map((track) => <li key={track.id}><div><strong>{track.title}</strong><span>{track.artist} · {track.genre} · {duration(track.durationSeconds)}</span></div><span className="music-license">{track.license.replace('_', ' ')}</span></li>)}</ul>}</section>;
}
