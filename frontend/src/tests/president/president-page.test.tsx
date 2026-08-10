import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PresidentPanelPage } from '../../pages/PresidentPanelPage';
import type { PresidentDashboard } from '../../president/types';

const dashboard: PresidentDashboard = {
  health: [
    { id: 'h-1', name: 'API', status: 'HEALTHY', message: 'All good.' },
  ],
  revenue: { total: 100000, monthly: 12000, trend: 5.2, currency: 'USD' },
  channels: [
    { id: 'c-1', title: 'Channel 1', subscribers: '10,000', growth: 5.2, monetized: true },
  ],
  aiStatus: [
    { id: 'ai-1', name: 'Director', state: 'ACTIVE', lastActive: '2026-08-09T12:00:00.000Z', message: 'Running.' },
  ],
  risks: [
    { id: 'r-1', severity: 'HIGH', title: 'Risk 1', description: 'Desc', category: 'Cat' },
  ],
};

describe('PresidentPanelPage', () => {
  it('renders all president sections from initial data', () => {
    const markup = renderToStaticMarkup(<PresidentPanelPage initialData={dashboard} />);
    for (const expected of ['President Panel', 'Platform Health', 'Revenue Overview', 'Channels', 'AI Director Status', 'Risk Alerts', 'Channel 1', 'Risk 1']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<PresidentPanelPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading president panel…');
  });
});
