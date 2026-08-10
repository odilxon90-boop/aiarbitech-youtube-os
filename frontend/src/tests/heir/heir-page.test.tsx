import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeirPanelPage } from '../../pages/HeirPanelPage';
import type { HeirDashboard } from '../../heir/types';

const dashboard: HeirDashboard = {
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
  training: {
    modulesCompleted: 3,
    totalModules: 4,
    overallScore: 82,
    nextSteps: ['Complete advanced module'],
    modules: [
      { id: 't-1', title: 'Platform Fundamentals', completed: true, score: 90 },
    ],
  },
};

describe('HeirPanelPage', () => {
  it('renders all heir sections from initial data', () => {
    const markup = renderToStaticMarkup(<HeirPanelPage initialData={dashboard} />);
    for (const expected of ['Heir Panel', 'Platform Health', 'Revenue Overview', 'Channels', 'AI Director Status', 'Risk Alerts', 'Training Progress', 'Channel 1', 'Risk 1', 'Platform Fundamentals']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<HeirPanelPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading heir panel…');
  });
});
