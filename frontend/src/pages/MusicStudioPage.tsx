import { useEffect, useMemo, useState } from 'react';
import { GenerateForm } from '../components/music/GenerateForm';
import { GenreList } from '../components/music/GenreList';
import { TrackList } from '../components/music/TrackList';
import { TrendChart } from '../components/music/TrendChart';
import { createMusicClient } from '../music/music-client';
import type { MusicClient, MusicTrack } from '../music/types';
import { ErrorState, LoadingState } from '../shared/components/AsyncStates';

const trends = [42, 58, 37, 71, 65, 84, 76];
interface MusicStudioPageProps { client?: MusicClient; initialTracks?: MusicTrack[]; }

export function MusicStudioPage({ client, initialTracks }: MusicStudioPageProps) {
  const musicClient = useMemo(() => client ?? createMusicClient(), [client]);
  const [tracks, setTracks] = useState<MusicTrack[] | undefined>(initialTracks);
  const [selectedGenre, setSelectedGenre] = useState<string>();
  const [error, setError] = useState<string>();
  const genres = [...new Set((tracks ?? initialTracks ?? []).map((track) => track.genre))];

  useEffect(() => {
    if (initialTracks) return;
    const controller = new AbortController();
    musicClient.browse(undefined, controller.signal).then(setTracks).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unable to load music library.');
    });
    return () => controller.abort();
  }, [musicClient, initialTracks]);

  const selectGenre = (genre?: string) => {
    setSelectedGenre(genre);
    void musicClient.browse(genre).then(setTracks).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to filter tracks.'));
  };
  const search = (query: string) => void musicClient.search(query).then((result) => { setSelectedGenre(undefined); setTracks(result); }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to search tracks.'));

  return <section className="music-studio-page" aria-labelledby="music-studio-title"><header className="music-studio-header"><div><p className="section-kicker">Creator audio</p><h2 id="music-studio-title">AI Music Studio</h2><p className="muted">Find licensed music for your next YouTube production.</p></div></header><GenerateForm onGenerate={search} /><TrendChart points={trends} />{error && <ErrorState message={error} />}{!tracks && !error && <LoadingState message="Loading music library…" />}{tracks && <><GenreList genres={genres} selectedGenre={selectedGenre} onSelect={selectGenre} /><TrackList tracks={tracks} /></>}</section>;
}
