import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CategoryBreakdown } from '../../components/success/CategoryBreakdown';
import { HistoryChart } from '../../components/success/HistoryChart';
import { ImprovementList } from '../../components/success/ImprovementList';
import { ScoreCard } from '../../components/success/ScoreCard';
describe('Success Score components', () => {
  it('renders score and category breakdown', () => { expect(renderToStaticMarkup(<ScoreCard score={72} />)).toContain('72'); expect(renderToStaticMarkup(<CategoryBreakdown categories={[{ id: 'ai', name: 'AI usage', score: 78 }]} />)).toContain('AI usage'); });
  it('renders history and improvements', () => { expect(renderToStaticMarkup(<HistoryChart points={[{ date: 'today', score: 72 }]} />)).toContain('<svg'); expect(renderToStaticMarkup(<ImprovementList suggestions={[{ id: '1', priority: 'HIGH', suggestion: 'Improve', expectedImpact: '+5' }]} />)).toContain('Improve'); });
});
