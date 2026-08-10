import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GenrePage } from '../../pages/GenrePage';
import type { GenreSummary } from '../../genre/types';

const summary: GenreSummary = {
  trends: [
    { id: 'genre-lofi', name: 'Lo-Fi Hip Hop', currentScore: 92, delta: 4.2, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 84 + i * 0.2 })) },
    { id: 'genre-synthwave', name: 'Synthwave', currentScore: 84, delta: 3.1, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 76 + i * 0.2 })) },
    { id: 'genre-afrobeats', name: 'Afrobeats', currentScore: 88, delta: 2.8, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 80 + i * 0.2 })) },
    { id: 'genre-phonk', name: 'Phonk', currentScore: 78, delta: 1.9, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 70 + i * 0.2 })) },
    { id: 'genre-drill', name: 'Drill', currentScore: 82, delta: 0.3, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 74 + i * 0.2 })) },
  ],
  recommendations: [
    { id: 'grec-1', name: 'Lo-Fi Hip Hop', confidence: 96, reason: 'Highest viewer retention.', tags: ['study', 'focus'] },
    { id: 'grec-2', name: 'Synthwave', confidence: 88, reason: 'Rising engagement.', tags: ['retro', '80s'] },
    { id: 'grec-3', name: 'Afrobeats', confidence: 82, reason: 'Global audience growth.', tags: ['danceable'] },
    { id: 'grec-4', name: 'City Pop', confidence: 77, reason: 'Nostalgia-driven virality.', tags: ['nostalgic'] },
    { id: 'grec-5', name: 'Phonk', confidence: 71, reason: 'Dominant in automotive.', tags: ['dark'] },
  ],
  popularity: [
    { id: 'genre-lofi', name: 'Lo-Fi Hip Hop', score: 92, rank: 1, change: 'UP' },
    { id: 'genre-afrobeats', name: 'Afrobeats', score: 88, rank: 2, change: 'UP' },
    { id: 'genre-synthwave', name: 'Synthwave', score: 84, rank: 3, change: 'UP' },
    { id: 'genre-drill', name: 'Drill', score: 82, rank: 4, change: 'STABLE' },
    { id: 'genre-phonk', name: 'Phonk', score: 78, rank: 5, change: 'UP' },
  ],
};

describe('GenrePage', () => {
  it('renders all genre sections from initial data without fetching', () => {
    const markup = renderToStaticMarkup(<GenrePage initialData={summary} />);
    for (const expected of [
      'AI Music Genre Recommendation',
      'Genre Trends',
      'Lo-Fi Hip Hop',
      'Synthwave',
      'AI Genre Recommendations',
      'Highest viewer retention.',
      '96% match',
      'Genre Popularity Rankings',
      '#1',
      'Afrobeats',
    ]) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<GenrePage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading genre data');
  });
});
