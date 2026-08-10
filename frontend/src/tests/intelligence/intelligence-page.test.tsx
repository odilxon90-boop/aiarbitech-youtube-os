import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IntelligencePage } from '../../pages/IntelligencePage';
import type { IntelligenceSummary } from '../../intelligence/types';

const summary: IntelligenceSummary = {
  profile: {
    name: 'Alex Creator',
    level: 'Intermediate',
    experience: '2 years',
    niche: 'AI Automations & Productivity',
  },
  skills: [
    { name: 'Thumbnail Design', score: 82 },
    { name: 'Video Editing', score: 88 },
  ],
  strengths: [
    { id: 's-1', title: 'High production quality', description: 'Consistent cinematic style.' },
  ],
  weaknesses: [
    { id: 'w-1', title: 'Low engagement', description: 'Comments are underutilized.' },
  ],
  recommendations: [
    { id: 'r-1', priority: 'HIGH', title: 'Post on a fixed schedule', description: 'Increase upload frequency.' },
  ],
};

describe('IntelligencePage', () => {
  it('renders all intelligence sections from initial data', () => {
    const markup = renderToStaticMarkup(<IntelligencePage initialData={summary} />);
    for (const expected of [
      'Creator Intelligence Center',
      'Creator Profile',
      'Alex Creator',
      'Skill Assessment',
      'Thumbnail Design',
      'Strengths',
      'High production quality',
      'Weaknesses',
      'Low engagement',
      'AI Recommendations',
      'Post on a fixed schedule',
    ]) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<IntelligencePage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading intelligence…');
  });
});
