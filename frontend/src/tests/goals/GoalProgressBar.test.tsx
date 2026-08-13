import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GoalProgressBar } from '../../components/goals/GoalProgressBar';

describe('GoalProgressBar', () => it('shows current and target progress', () => {
  const markup = renderToStaticMarkup(<GoalProgressBar goal={{ id: 'goal-1', type: 'subscribers', title: 'Subscribers', target: 100, current: 45, deadline: '2026-12-31', status: 'ON_TRACK', createdAt: '', updatedAt: '' }} />);
  expect(markup).toContain('45 / 100');
  expect(markup).toContain('45%');
}));
