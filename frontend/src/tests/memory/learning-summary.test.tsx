import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LearningSummary } from '../../components/memory/LearningSummary';
import type { LearningEntry } from '../../memory/types';

const items: readonly LearningEntry[] = [
  { id: 'l-1', date: '2026-07-12', event: 'AI recommended weekly shorts', result: 'Adopted; growth improved.' },
  { id: 'l-2', date: '2026-07-10', event: 'AI recommended removing end screens', result: 'Rejected; sessions dropped.' },
  { id: 'l-3', date: '2026-07-08', event: 'AI suggested voiceover', result: 'Adopted; faster production.' },
];

describe('LearningSummary', () => {
  it('renders learning list and adopted/rejected counts', () => {
    const markup = renderToStaticMarkup(<LearningSummary items={items} />);
    for (const expected of [
      'Learning Summary',
      '2 adopted',
      '1 rejected',
      'AI recommended weekly shorts',
      'Adopted; growth improved.',
      'Rejected; sessions dropped.',
      '2026-07-12',
    ]) {
      expect(markup).toContain(expected);
    }
  });
});
