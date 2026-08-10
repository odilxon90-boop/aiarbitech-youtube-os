import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConflictList } from '../../components/ai-sync/ConflictList';
import type { Conflict } from '../../ai-sync/types';

const conflicts: readonly Conflict[] = [
  { id: 'c-1', type: 'RECOMMENDATION', localValue: 'A', globalValue: 'B', detectedAt: '2026-08-09T12:00:00.000Z', status: 'OPEN' },
  { id: 'c-2', type: 'MODEL_WEIGHTS', localValue: '0.8', globalValue: '0.9', detectedAt: '2026-08-09T11:00:00.000Z', status: 'RESOLVED', resolution: { id: 'cr-1', conflictId: 'c-2', resolution: 'GLOBAL', resolvedAt: '2026-08-09T11:05:00.000Z', resolvedBy: 'admin-1' } },
];

describe('ConflictList', () => {
  it('renders conflicts with actions for open conflicts', () => {
    const markup = renderToStaticMarkup(<ConflictList conflicts={conflicts} onResolve={() => {}} />);
    for (const expected of ['Conflicts (2)', 'RECOMMENDATION', 'MODEL_WEIGHTS', 'OPEN', 'RESOLVED', 'Accept Local', 'Accept Global', 'Manual Override', 'GLOBAL']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<ConflictList conflicts={[]} onResolve={() => {}} />);
    expect(markup).toContain('No conflicts detected.');
  });
});
