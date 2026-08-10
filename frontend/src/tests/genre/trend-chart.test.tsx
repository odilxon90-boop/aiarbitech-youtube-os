import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TrendChart } from '../../components/genre/TrendChart';
import type { GenreTrend } from '../../genre/types';

const trends: GenreTrend[] = [
  { id: 'genre-lofi', name: 'Lo-Fi Hip Hop', currentScore: 92, delta: 4.2, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 84 + i })) },
  { id: 'genre-synthwave', name: 'Synthwave', currentScore: 84, delta: 3.1, points: Array.from({ length: 30 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, score: 76 + i })) },
];

describe('TrendChart', () => {
  it('renders genre names and scores', () => {
    const markup = renderToStaticMarkup(<TrendChart trends={trends} />);
    expect(markup).toContain('Genre Trends');
    expect(markup).toContain('Lo-Fi Hip Hop');
    expect(markup).toContain('92/100');
    expect(markup).toContain('Synthwave');
    expect(markup).toContain('84/100');
  });

  it('renders positive delta with + sign', () => {
    const markup = renderToStaticMarkup(<TrendChart trends={trends} />);
    expect(markup).toContain('+4.2%');
  });

  it('renders empty list gracefully', () => {
    const markup = renderToStaticMarkup(<TrendChart trends={[]} />);
    expect(markup).toContain('Genre Trends');
  });
});
