import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GoalsPage } from '../../pages/GoalsPage';
import type { GoalsBundle } from '../../goals/types';

const data: GoalsBundle = { goals: [{ id: 'goal-1', type: 'subscribers', title: 'Reach 1,000 subscribers', target: 1000, current: 500, deadline: '2026-12-31', status: 'ON_TRACK', createdAt: '', updatedAt: '' }], recommendations: [{ id: 'rec-1', goalId: 'goal-1', category: 'STEPS', title: 'Publish weekly', suggestion: 'Publish once per week.' }] };

describe('GoalsPage', () => {
  it('renders goals, recommendations, and create navigation', () => {
    const markup = renderToStaticMarkup(<GoalsPage initialData={data} />);
    for (const expected of ['Creator Goal Center', 'Reach 1,000 subscribers', 'AI Recommendations', 'Publish weekly', 'Create goal']) expect(markup).toContain(expected);
  });
  it('renders loading state without initial data', () => expect(renderToStaticMarkup(<GoalsPage />)).toContain('Loading goals…'));
});
