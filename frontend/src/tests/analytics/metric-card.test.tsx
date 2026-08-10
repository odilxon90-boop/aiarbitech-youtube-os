import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MetricCard, formatDelta } from '../../components/analytics/MetricCard';
import type { MetricSummary } from '../../analytics/types';

describe('MetricCard', () => {
  it('formats deltas with a sign', () => {
    expect(formatDelta(12.4)).toBe('+12.4%');
    expect(formatDelta(-0.3)).toBe('-0.3%');
    expect(formatDelta(0)).toBe('+0.0%');
  });

  it('renders the label, display value and signed delta', () => {
    const summary: MetricSummary = {
      metric: 'views',
      label: 'Views',
      value: 123456,
      delta: 12.4,
      display: '123,456',
    };
    const markup = renderToStaticMarkup(<MetricCard summary={summary} />);
    expect(markup).toContain('Views');
    expect(markup).toContain('123,456');
    expect(markup).toContain('+12.4%');
    expect(markup).toContain('metric-card__delta--up');

    const negative: MetricSummary = { ...summary, delta: -5.2, display: '1,234' };
    const negMarkup = renderToStaticMarkup(<MetricCard summary={negative} />);
    expect(negMarkup).toContain('-5.2%');
  });
});