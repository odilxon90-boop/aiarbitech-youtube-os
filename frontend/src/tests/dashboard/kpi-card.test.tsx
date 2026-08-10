import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { KPICard, kpiDelta } from '../../components/dashboard/KPICard';

describe('KPICard', () => {
  it('formats positive and negative deltas', () => {
    expect(kpiDelta(12.4)).toBe('+12.4%');
    expect(kpiDelta(-0.4)).toBe('-0.4%');
    expect(kpiDelta(0)).toBe('+0.0%');
  });

  it('renders label, value and delta with hierarchy', () => {
    const markup = renderToStaticMarkup(
      <KPICard kpi={{ id: 'views', label: 'Views', value: '128,400', delta: 12.4, hint: 'last 28 days' }} />,
    );
    expect(markup).toContain('Views');
    expect(markup).toContain('128,400');
    expect(markup).toContain('+12.4%');
    expect(markup).toContain('last 28 days');
  });
});