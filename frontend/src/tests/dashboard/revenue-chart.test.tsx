import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import type { RevenueSeries } from '../../dashboard/types';

const series: RevenueSeries = {
  points: [
    { date: '2026-07-10', value: 18.4 },
    { date: '2026-07-11', value: 20.1 },
    { date: '2026-07-12', value: 19.7 },
  ],
};

describe('RevenueChart', () => {
  it('renders an SVG line chart with circles and axis labels', () => {
    const markup = renderToStaticMarkup(<RevenueChart series={series} />);
    expect(markup).toContain('Revenue (last 30 days)');
    expect(markup).toContain('<svg');
    expect(markup).toContain('<polyline');
    expect((markup.match(/<circle/g) || []).length).toBe(series.points.length);
  });

  it('falls back when no points are provided', () => {
    const markup = renderToStaticMarkup(<RevenueChart series={{ points: [] }} />);
    expect(markup).toContain('No revenue data available.');
  });
});
