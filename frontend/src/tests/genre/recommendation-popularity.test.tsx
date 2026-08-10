import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecommendationList } from '../../components/genre/RecommendationList';
import { PopularityList } from '../../components/genre/PopularityList';
import type { GenreRecommendation, GenrePopularity } from '../../genre/types';

const recommendations: GenreRecommendation[] = [
  { id: 'grec-1', name: 'Lo-Fi Hip Hop', confidence: 96, reason: 'Best watch time in niche.', tags: ['study', 'chill'] },
  { id: 'grec-2', name: 'Synthwave', confidence: 88, reason: 'Strong cross-niche appeal.', tags: ['retro'] },
];

const popularity: GenrePopularity[] = [
  { id: 'genre-lofi', name: 'Lo-Fi Hip Hop', score: 92, rank: 1, change: 'UP' },
  { id: 'genre-drill', name: 'Drill', score: 82, rank: 2, change: 'STABLE' },
  { id: 'genre-indie', name: 'Indie Folk', score: 62, rank: 3, change: 'DOWN' },
];

describe('RecommendationList', () => {
  it('renders genre recommendations with confidence and tags', () => {
    const markup = renderToStaticMarkup(<RecommendationList recommendations={recommendations} />);
    expect(markup).toContain('AI Genre Recommendations');
    expect(markup).toContain('Lo-Fi Hip Hop');
    expect(markup).toContain('96% match');
    expect(markup).toContain('Best watch time in niche.');
    expect(markup).toContain('study');
    expect(markup).toContain('Synthwave');
    expect(markup).toContain('88% match');
  });

  it('shows empty state when no recommendations', () => {
    const markup = renderToStaticMarkup(<RecommendationList recommendations={[]} />);
    expect(markup).toContain('No genre recommendations available.');
  });
});

describe('PopularityList', () => {
  it('renders genres ranked by popularity', () => {
    const markup = renderToStaticMarkup(<PopularityList genres={popularity} />);
    expect(markup).toContain('Genre Popularity Rankings');
    expect(markup).toContain('#1');
    expect(markup).toContain('Lo-Fi Hip Hop');
    expect(markup).toContain('92/100');
    expect(markup).toContain('#2');
    expect(markup).toContain('Drill');
    expect(markup).toContain('Indie Folk');
  });

  it('renders change direction indicators', () => {
    const markup = renderToStaticMarkup(<PopularityList genres={popularity} />);
    expect(markup).toContain('▲');
    expect(markup).toContain('━');
    expect(markup).toContain('▼');
  });

  it('shows empty state when no genres', () => {
    const markup = renderToStaticMarkup(<PopularityList genres={[]} />);
    expect(markup).toContain('No popularity data available.');
  });
});
