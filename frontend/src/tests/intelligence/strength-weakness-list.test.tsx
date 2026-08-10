import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StrengthList } from '../../components/intelligence/StrengthList';
import type { Strength } from '../../intelligence/types';

const strengths: readonly Strength[] = [
  { id: 's-1', title: 'High production quality', description: 'Consistent cinematic style.' },
  { id: 's-2', title: 'Clear explanations', description: 'Complex topics simplified.' },
];

const weakness: readonly import('../../intelligence/types').Weakness[] = [
  { id: 'w-1', title: 'Low engagement', description: 'Comments are underutilized.' },
];

import { WeaknessList } from '../../components/intelligence/WeaknessList';

describe('StrengthList', () => {
  it('renders strengths', () => {
    const markup = renderToStaticMarkup(<StrengthList strengths={strengths} />);
    for (const expected of ['Strengths', 'High production quality', 'Consistent cinematic style.', 'Clear explanations']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<StrengthList strengths={[]} />);
    expect(markup).toContain('No strengths recorded yet.');
  });
});

describe('WeaknessList', () => {
  it('renders weaknesses', () => {
    const markup = renderToStaticMarkup(<WeaknessList weaknesses={weakness} />);
    for (const expected of ['Weaknesses', 'Low engagement', 'Comments are underutilized.']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<WeaknessList weaknesses={[]} />);
    expect(markup).toContain('No weaknesses recorded yet.');
  });
});
