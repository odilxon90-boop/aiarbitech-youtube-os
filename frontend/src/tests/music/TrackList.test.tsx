import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TrackList } from '../../components/music/TrackList';

describe('TrackList', () => {
  it('displays track metadata and licensing', () => {
    const markup = renderToStaticMarkup(<TrackList tracks={[{ id: 'track-1', title: 'Creator Beat', artist: 'Lumen', genre: 'Hip Hop', durationSeconds: 152, license: 'ROYALTY_FREE', tags: [] }]} />);
    for (const expected of ['Available tracks (1)', 'Creator Beat', 'Lumen', 'Hip Hop', '2:32', 'ROYALTY FREE']) expect(markup).toContain(expected);
  });
  it('renders an empty state', () => expect(renderToStaticMarkup(<TrackList tracks={[]} />)).toContain('No tracks match your search.'));
});
