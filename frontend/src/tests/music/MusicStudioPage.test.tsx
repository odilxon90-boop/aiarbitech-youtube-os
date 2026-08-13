import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MusicStudioPage } from '../../pages/MusicStudioPage';
import type { MusicTrack } from '../../music/types';

const tracks: MusicTrack[] = [{ id: 'track-1', title: 'Sunrise Circuit', artist: 'Ari Nova', genre: 'Electronic', durationSeconds: 184, license: 'ROYALTY_FREE', tags: [] }];
describe('MusicStudioPage', () => {
  it('renders the studio, discovery form, genre navigation, and track list', () => {
    const markup = renderToStaticMarkup(<MusicStudioPage initialTracks={tracks} />);
    for (const expected of ['AI Music Studio', 'Find tracks', 'Music trend activity', 'All genres', 'Sunrise Circuit']) expect(markup).toContain(expected);
  });
  it('renders a loading state while library data is loading', () => expect(renderToStaticMarkup(<MusicStudioPage />)).toContain('Loading music library…'));
});
