import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecommendationList } from '../../components/intelligence/RecommendationList';
import type { Recommendation } from '../../intelligence/types';

const recommendations: readonly Recommendation[] = [
  { id: 'r-1', priority: 'HIGH', title: 'Post on a fixed schedule', description: 'Increase upload frequency.' },
  { id: 'r-2', priority: 'MEDIUM', title: 'Reply to top comments', description: 'Boost engagement within 24 hours.' },
];

describe('RecommendationList', () => {
  it('renders recommendations with priority badges', () => {
    const markup = renderToStaticMarkup(<RecommendationList recommendations={recommendations} />);
    for (const expected of [
      'AI Recommendations',
      'Post on a fixed schedule',
      'Increase upload frequency.',
      'HIGH',
      'Reply to top comments',
      'MEDIUM',
    ]) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<RecommendationList recommendations={[]} />);
    expect(markup).toContain('No recommendations available.');
  });
});
