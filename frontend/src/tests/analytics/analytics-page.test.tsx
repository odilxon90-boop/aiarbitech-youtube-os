import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import type { AnalyticsBundle } from '../../analytics/types';

const bundle: AnalyticsBundle = {
  summary: {
    generatedAt: '2026-08-09T00:00:00.000Z',
    metrics: [
      { metric: 'subscribers', label: 'Subscribers', value: 27436, delta: 5.1, display: '27,436' },
      { metric: 'views', label: 'Views', value: 135420, delta: 12.4, display: '135,420' },
      { metric: 'watchTime', label: 'Watch Time (h)', value: 11104, delta: 9.6, display: '11,104h' },
      { metric: 'ctr', label: 'CTR (%)', value: 6.23, delta: -0.3, display: '6.23%' },
      { metric: 'revenue', label: 'Revenue ($)', value: 1165.5, delta: 14.2, display: '$1,165.50' },
    ],
  },
  trends: {
    generatedAt: '2026-08-09T00:00:00.000Z',
    series: [
      {
        metric: 'views',
        label: 'Views',
        points: [
          { date: '2026-07-11', value: 4200 },
          { date: '2026-07-12', value: 5100 },
        ],
      },
    ],
  },
  performance: {
    generatedAt: '2026-08-09T00:00:00.000Z',
    topVideos: [{ id: 'v1', title: 'Top 5 AI Automations', views: 48210, watchTimeHours: 12840, ctr: 8.4, revenue: 412.5 }],
    geography: [{ country: 'United States', share: 34, viewers: 44800 }],
    devices: [{ device: 'Mobile', share: 58, viewers: 76500 }],
  },
};

describe('AnalyticsPage', () => {
  it('renders the analytics center from initial data', () => {
    const markup = renderToStaticMarkup(<AnalyticsPage initialData={bundle} />);
    expect(markup).toContain('Creator Analytics Center');
    expect(markup).toContain('Key Metrics (last 30 days)');
    expect(markup).toContain('Top 5 AI Automations');
    expect(markup).toContain('United States');
    expect(markup).toContain('Mobile');
    expect(markup).toContain('data-testid="time-series-chart"');
    expect(markup).toContain('data-testid="metric-tabs"');
  });

  it('shows a loading state before data is supplied', () => {
    const noopClient = { loadBundle: vi.fn() } as never;
    const markup = renderToStaticMarkup(<AnalyticsPage client={noopClient} />);
    expect(markup).toContain('Loading creator analytics…');
  });
});