import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PreferenceList } from '../../components/memory/PreferenceList';
import type { StylePreference, ContentPreference } from '../../memory/types';

const styles: readonly StylePreference[] = [
  { id: 'sp-1', category: 'Tone', value: 'Casual', confidence: 0.9 },
  { id: 'sp-2', category: 'Visual style', value: 'Cinematic', confidence: 0.8 },
];

const content: readonly ContentPreference[] = [
  { id: 'cp-1', topic: 'AI', format: 'Tutorial', priority: 'HIGH', note: 'Top performer' },
  { id: 'cp-2', topic: 'Reviews', format: 'Listicle', priority: 'MEDIUM', note: 'Affiliate friendly' },
];

describe('PreferenceList', () => {
  it('renders style and content preferences with badges', () => {
    const markup = renderToStaticMarkup(<PreferenceList stylePreferences={styles} contentPreferences={content} />);
    for (const expected of [
      'Style Preferences',
      'Tone',
      'Casual',
      '90%',
      'Content Preferences',
      'AI',
      'Tutorial',
      'HIGH',
      'Top performer',
    ]) {
      expect(markup).toContain(expected);
    }
  });
});
