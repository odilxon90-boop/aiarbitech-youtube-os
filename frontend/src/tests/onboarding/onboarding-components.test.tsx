import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecommendationDisplay } from '../../components/onboarding/RecommendationDisplay';
import { StepContent } from '../../components/onboarding/StepContent';
import { StepProgress } from '../../components/onboarding/StepProgress';
describe('Onboarding components', () => {
  it('renders step content and progress', () => { expect(renderToStaticMarkup(<StepContent step={{ title: 'Profile', description: 'Mock profile' }} />)).toContain('Profile'); expect(renderToStaticMarkup(<StepProgress current={3} total={9} />)).toContain('33%'); });
  it('renders AI recommendations', () => expect(renderToStaticMarkup(<RecommendationDisplay recommendations={['Mock advice']} />)).toContain('Mock advice'));
});
