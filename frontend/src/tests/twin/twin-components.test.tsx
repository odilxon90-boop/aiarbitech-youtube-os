import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DecisionHistory } from '../../components/twin/DecisionHistory';
import { LearningForm } from '../../components/twin/LearningForm';
import { RecommendationList } from '../../components/twin/RecommendationList';
import { StatusCard } from '../../components/twin/StatusCard';
describe('Creator Twin components', () => {
  it('renders status and decisions', () => { expect(renderToStaticMarkup(<StatusCard status="LEARNING" />)).toContain('LEARNING'); expect(renderToStaticMarkup(<DecisionHistory decisions={[{ id: 'd1', decision: 'Mock decision', outcome: 'SUCCESS' }]} />)).toContain('Mock decision'); });
  it('renders learning and recommendations', () => { expect(renderToStaticMarkup(<LearningForm />)).toContain('Save mock learning'); expect(renderToStaticMarkup(<RecommendationList recommendations={[{ id: 'r1', idea: 'Mock idea', confidencePercent: 90 }]} />)).toContain('90%'); });
});
