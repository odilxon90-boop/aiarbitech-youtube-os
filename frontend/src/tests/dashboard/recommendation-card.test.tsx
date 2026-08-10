import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecommendationCard, priorityBadge } from '../../components/dashboard/RecommendationCard';

describe('RecommendationCard', () => {
  it('surfaces the priority as a badge', () => {
    expect(priorityBadge('HIGH')).toBe('HIGH');
    expect(priorityBadge('MEDIUM')).toBe('MEDIUM');
    expect(priorityBadge('LOW')).toBe('LOW');
  });

  it('renders recommendation title, priority and reason', () => {
    const markup = renderToStaticMarkup(
      <RecommendationCard
        recommendation={{
          id: 'rec-1',
          priority: 'HIGH',
          title: 'Publish 3 shorts this week',
          reason: 'Shorts are driving growth.',
        }}
      />,
    );
    expect(markup).toContain('Publish 3 shorts this week');
    expect(markup).toContain('HIGH');
    expect(markup).toContain('Shorts are driving growth.');
  });
});