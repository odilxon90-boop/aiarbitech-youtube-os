import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProfileCard } from '../../components/intelligence/ProfileCard';
import type { CreatorProfile } from '../../intelligence/types';

const profile: CreatorProfile = {
  name: 'Alex Creator',
  level: 'Intermediate',
  experience: '2 years',
  niche: 'AI Automations & Productivity',
};

describe('ProfileCard', () => {
  it('renders creator profile details', () => {
    const markup = renderToStaticMarkup(<ProfileCard profile={profile} />);
    for (const expected of [
      'Creator Profile',
      'Alex Creator',
      'Intermediate',
      '2 years',
      'AI Automations &amp; Productivity',
    ]) {
      expect(markup).toContain(expected);
    }
  });
});
