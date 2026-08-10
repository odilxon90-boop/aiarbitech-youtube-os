import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryPage } from '../../pages/MemoryPage';
import type { MemorySummary } from '../../memory/types';

const summary: MemorySummary = {
  stylePreferences: [
    { id: 'sp-1', category: 'Tone', value: 'Casual', confidence: 0.9 },
  ],
  contentPreferences: [
    { id: 'cp-1', topic: 'AI Automations', format: 'Tutorial', priority: 'HIGH', note: 'Top performer' },
  ],
  recentDecisions: [
    { id: 'd-1', date: '2026-07-12', title: 'Weekly shorts', outcome: 'ACCEPTED', impact: 'Growth +8%' },
  ],
  learningHistory: [
    { id: 'l-1', date: '2026-07-12', event: 'AI recommended weekly shorts', result: 'Adopted; growth improved.' },
  ],
};

describe('MemoryPage', () => {
  it('renders all memory sections from initial data', () => {
    const markup = renderToStaticMarkup(<MemoryPage initialData={summary} />);
    for (const expected of [
      'Creator Memory Center',
      'Style Preferences',
      'Tone',
      'Content Preferences',
      'AI Automations',
      'Decision History',
      'Weekly shorts',
      'ACCEPTED',
      'Learning Summary',
      '1 adopted',
      '0 rejected',
      'AI recommended weekly shorts',
    ]) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<MemoryPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading memory…');
  });
});
