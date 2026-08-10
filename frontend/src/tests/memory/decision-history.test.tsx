import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DecisionHistory } from '../../components/memory/DecisionHistory';
import type { DecisionRecord } from '../../memory/types';

const decisions: readonly DecisionRecord[] = [
  { id: 'd-1', date: '2026-07-12', title: 'Weekly shorts', outcome: 'ACCEPTED', impact: 'Growth +8%' },
  { id: 'd-2', date: '2026-07-10', title: 'Remove end screens', outcome: 'REJECTED', impact: 'Sessions dropped 4%' },
];

describe('DecisionHistory', () => {
  it('renders decision title, date, outcome and impact', () => {
    const markup = renderToStaticMarkup(<DecisionHistory decisions={decisions} />);
    for (const expected of [
      'Decision History',
      'Weekly shorts',
      '2026-07-12',
      'ACCEPTED',
      'Growth +8%',
      'Remove end screens',
      'REJECTED',
      'Sessions dropped 4%',
    ]) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state when no decisions exist', () => {
    const markup = renderToStaticMarkup(<DecisionHistory decisions={[]} />);
    expect(markup).toContain('No decisions recorded yet.');
  });
});
