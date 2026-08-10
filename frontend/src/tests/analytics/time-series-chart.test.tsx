import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TimeSeriesChart } from '../../components/analytics/TimeSeriesChart';
import type { MetricSeries } from '../../analytics/types';

const views: MetricSeries = {
  metric: 'views',
  label: 'Views',
  points: [
    { date: '2026-07-11', value: 4200 },
    { date: '2026-07-12', value: 5100 },
    { date: '2026-07-13', value: 4700 },
  ],
};

describe('TimeSeriesChart', () => {
  it('renders an SVG chart and one circle per data point', () => {
    const markup = renderToStaticMarkup(<TimeSeriesChart series={views} />);
    expect(markup).toContain('data-testid="time-series-chart"');
    expect(markup).toContain('<svg');
    expect(markup).toContain('<polyline');
    expect(markup).toContain('aria-label="Views over time"');
    expect(markup.match(/<circle/g)).toHaveLength(3);
  });

  it('falls back when a series has no points', () => {
    const empty: MetricSeries = { metric: 'views', label: 'Views', points: [] };
    const markup = renderToStaticMarkup(<TimeSeriesChart series={empty} />);
    expect(markup).toContain('No data available.');
  });
});