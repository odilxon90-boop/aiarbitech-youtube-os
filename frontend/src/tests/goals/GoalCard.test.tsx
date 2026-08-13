import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GoalCard } from '../../components/goals/GoalCard';
import type { Goal } from '../../goals/types';

const goal: Goal = { id: 'goal-1', type: 'revenue', title: 'Reach $5,000', target: 5000, current: 2500, deadline: '2026-12-31', status: 'ON_TRACK', createdAt: '', updatedAt: '' };
describe('GoalCard', () => it('displays goal progress and actions', () => {
  const markup = renderToStaticMarkup(<GoalCard goal={goal} onUpdateProgress={() => undefined} onDelete={() => undefined} />);
  for (const expected of ['Reach $5,000', 'Revenue', 'ON TRACK', '50%', '+1 step', 'Delete']) expect(markup).toContain(expected);
}));
