import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SkillList } from '../../components/intelligence/SkillList';
import type { SkillAssessment } from '../../intelligence/types';

const skills: readonly SkillAssessment[] = [
  { name: 'Thumbnail Design', score: 82 },
  { name: 'Audience Retention', score: 74 },
  { name: 'Video Editing', score: 88 },
];

describe('SkillList', () => {
  it('renders skills with score bars', () => {
    const markup = renderToStaticMarkup(<SkillList skills={skills} />);
    for (const expected of [
      'Skill Assessment',
      'Thumbnail Design',
      '82/100',
      'Audience Retention',
      '74/100',
      'Video Editing',
      '88/100',
    ]) {
      expect(markup).toContain(expected);
    }
    expect((markup.match(/class="skill-fill"/g) || []).length).toBe(3);
  });
});
