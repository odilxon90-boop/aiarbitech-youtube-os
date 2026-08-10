import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { DashboardPage } from '../../pages/DashboardPage';
import type { DashboardSummary } from '../../dashboard/types';

const summary: DashboardSummary = {
  aiStatus: {
    level: 'HEALTHY',
    label: 'HEALTHY',
    detail: 'AI Director is running a healthy recommendation pipeline.',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  monetization: { current: 512, goal: 1000, note: 'Affiliate + paid subscription earnings.' },
  channels: [
    { id: 'chn-1', title: 'AIArbiTech Actions', subscriberCount: '18,240', videoCount: 42 },
  ],
  kpis: [
    { id: 'views', label: 'Views', value: '128,400', delta: 12.4, hint: 'last 28 days' },
  ],
  recommendations: [
    { id: 'rec-1', priority: 'HIGH', title: 'Publish 3 shorts this week', reason: 'Shorts drive growth.' },
  ],
  recentActivity: [{ id: 'act-1', at: '2h ago', message: 'Video "Top 5 AI Automations" scheduled.' }],
  quickActions: [
    { id: 'qa-1', label: 'New Video', icon: '🎬', description: 'Start drafting a video' },
  ],
  aiChat: { enabled: true, label: 'Ask AI', prompt: 'What should I publish next?' },
  revenueSeries: {
    points: [
      { date: '2026-07-11', value: 18.4 },
      { date: '2026-07-12', value: 19.7 },
    ],
  },
  channelHealth: {
    score: 84,
    label: 'Healthy',
    details: ['Upload consistency: 4.2/5', 'No copyright strikes'],
  },
};

describe('DashboardPage', () => {
  it('renders all dashboard sections from initial data without fetching', () => {
    const markup = renderToStaticMarkup(<DashboardPage initialData={summary} />);
    for (const expected of [
      'Creator Dashboard',
      'AI Status',
      '🟢',
      'Monetization Progress',
      'Channel Overview',
      'AIArbiTech Actions',
      'KPI Summary',
      '128,400',
      'Revenue (last 30 days)',
      'Channel Health',
      '84/100',
      'AI Recommendations',
      'Publish 3 shorts this week',
      'Recent Activity',
      'Top 5 AI Automations',
      'New Video',
      'Ask AI',
      'What should I publish next?',
    ]) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<DashboardPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading creator dashboard…');
  });
});
