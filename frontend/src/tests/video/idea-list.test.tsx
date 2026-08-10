import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IdeaList } from '../../components/video/IdeaList';
import type { VideoIdea } from '../../video/types';

const ideas: readonly VideoIdea[] = [
  { id: 'idea-1', title: 'Top 10 AI Tools', description: 'Best tools for creators.', confidence: 0.92, trend: 'AI Tools' },
  { id: 'idea-2', title: 'Automate YouTube', description: 'Use Python to automate uploads.', confidence: 0.88, trend: 'Automation' },
];

describe('IdeaList', () => {
  it('renders ideas with confidence badges and trend labels', () => {
    const markup = renderToStaticMarkup(<IdeaList ideas={ideas} />);
    for (const expected of ['Video Ideas', 'Top 10 AI Tools', 'Best tools for creators.', '92%', 'Trend: AI Tools', 'Automate YouTube']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<IdeaList ideas={[]} />);
    expect(markup).toContain('No video ideas available.');
  });
});
