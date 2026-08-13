import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GoalRecommendations } from '../../components/goals/GoalRecommendations';

describe('GoalRecommendations', () => {
  it('lists recommendations by category', () => {
    const markup = renderToStaticMarkup(<GoalRecommendations recommendations={[{ id: 'rec-1', goalId: 'goal-1', category: 'SEO', title: 'Improve titles', suggestion: 'Use outcome-led titles.' }]} />);
    for (const expected of ['AI Recommendations', 'SEO Improvement Suggestions', 'Improve titles', 'Use outcome-led titles.']) expect(markup).toContain(expected);
  });
  it('renders an empty state', () => expect(renderToStaticMarkup(<GoalRecommendations recommendations={[]} />)).toContain('No recommendations yet.'));
});
