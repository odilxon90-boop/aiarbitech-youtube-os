import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RevenueCard } from '../../components/president/RevenueCard';
import type { RevenueOverview } from '../../president/types';

const revenue: RevenueOverview = { total: 100000, monthly: 12000, trend: 5.2, currency: 'USD' };

describe('RevenueCard', () => {
  it('renders revenue metrics with trend sign', () => {
    const markup = renderToStaticMarkup(<RevenueCard revenue={revenue} />);
    expect(markup).toContain('Revenue Overview');
    expect(markup).toContain('Total');
    expect(markup).toContain('100');
    expect(markup).toContain('Monthly');
    expect(markup).toContain('12');
    expect(markup).toContain('Trend');
    expect(markup).toContain('+5.2%');
  });

  it('renders negative trend', () => {
    const markup = renderToStaticMarkup(<RevenueCard revenue={{ ...revenue, trend: -3.1 }} />);
    expect(markup).toContain('-3.1%');
  });
});
