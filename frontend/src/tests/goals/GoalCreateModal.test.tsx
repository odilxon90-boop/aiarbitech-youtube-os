import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GoalCreateModal } from '../../components/goals/GoalCreateModal';

describe('GoalCreateModal', () => {
  it('does not render while closed', () => expect(renderToStaticMarkup(<GoalCreateModal open={false} onClose={() => undefined} onCreate={() => undefined} />)).toBe(''));
  it('renders goal inputs and submit action while open', () => {
    const markup = renderToStaticMarkup(<GoalCreateModal open onClose={() => undefined} onCreate={() => undefined} />);
    for (const expected of ['New Goal', 'Type', 'Title', 'Target', 'Deadline', 'Cancel', 'Create']) expect(markup).toContain(expected);
  });
});
