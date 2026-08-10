import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TrainingProgress } from '../../components/heir/TrainingProgress';
import type { TrainingProgress as TrainingProgressType } from '../../heir/types';

const progress: TrainingProgressType = {
  modulesCompleted: 3,
  totalModules: 4,
  overallScore: 82,
  nextSteps: ['Complete advanced module', 'Review compliance'],
  modules: [
    { id: 't-1', title: 'Platform Fundamentals', completed: true, score: 90 },
    { id: 't-2', title: 'Content Governance', completed: true, score: 88 },
    { id: 't-3', title: 'Revenue Optimization', completed: true, score: 82 },
    { id: 't-4', title: 'Advanced Moderation', completed: false, score: 0 },
  ],
};

describe('TrainingProgress', () => {
  it('renders training progress', () => {
    const markup = renderToStaticMarkup(<TrainingProgress progress={progress} />);
    for (const expected of ['Training Progress', '3/4 modules completed', '75%', 'Score: 82%', 'Platform Fundamentals', 'Content Governance', 'Revenue Optimization', 'Advanced Moderation', 'Completed', 'In Progress', 'Next Steps', 'Complete advanced module', 'Review compliance']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty next steps list', () => {
    const markup = renderToStaticMarkup(<TrainingProgress progress={{ ...progress, nextSteps: [] }} />);
    expect(markup).not.toContain('Next Steps');
  });
});
