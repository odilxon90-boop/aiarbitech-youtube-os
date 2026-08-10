import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AdminPanelPage } from '../../pages/AdminPanelPage';
import type { AdminSummary } from '../../admin/types';

const summary: AdminSummary = {
  users: [
    { id: 'usr-1', name: 'Alex Creator', email: 'alex@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2025-01-15T09:00:00Z', lastActiveAt: '2026-08-09T09:00:00Z', channelCount: 2 },
    { id: 'usr-2', name: 'Sam Admin', email: 'sam@aiarbitech.io', role: 'ADMIN', status: 'ACTIVE', joinedAt: '2024-12-01T08:00:00Z', lastActiveAt: '2026-08-09T09:00:00Z', channelCount: 0 },
    { id: 'usr-3', name: 'Casey Content', email: 'casey@aiarbitech.io', role: 'CREATOR', status: 'SUSPENDED', joinedAt: '2025-06-01T09:00:00Z', lastActiveAt: '2026-06-15T09:00:00Z', channelCount: 3 },
  ],
  channels: [
    { id: 'chn-1', title: 'AIArbiTech Actions', ownerId: 'usr-1', ownerName: 'Alex Creator', subscriberCount: '18,240', videoCount: 42, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-01-20T09:00:00Z' },
    { id: 'chn-2', title: 'Casey Viral Zone', ownerId: 'usr-3', ownerName: 'Casey Content', subscriberCount: '62,000', videoCount: 110, moderationStatus: 'SUSPENDED', flags: ['spam'], createdAt: '2025-07-15T08:00:00Z' },
  ],
  aiConfig: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2048,
    topicWeighting: 'engagement',
    recommendationsPerDay: 5,
    enabled: true,
    updatedAt: '2026-08-01T08:00:00Z',
  },
  auditLogs: [
    { id: 'log-01', at: '2026-08-09T07:55:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'UPDATE_USER_STATUS', resource: 'user', resourceId: 'usr-3', outcome: 'SUCCESS', ip: '10.0.0.1' },
    { id: 'log-02', at: '2026-08-09T07:50:00Z', actor: 'Casey Content', actorRole: 'CREATOR', action: 'LOGIN', resource: 'auth', resourceId: 'usr-3', outcome: 'FAILURE', ip: '203.0.113.5' },
  ],
  health: {
    overall: 'DEGRADED',
    metrics: [
      { service: 'API Gateway', status: 'OK', latencyMs: 12, detail: 'All routes responding normally.', checkedAt: '2026-08-09T09:00:00Z' },
      { service: 'YouTube API', status: 'DEGRADED', latencyMs: 820, detail: 'Quota at 78%.', checkedAt: '2026-08-09T09:00:00Z' },
    ],
  },
};

describe('AdminPanelPage', () => {
  it('renders all admin sections from initial data without fetching', () => {
    const markup = renderToStaticMarkup(<AdminPanelPage initialData={summary} />);
    for (const expected of [
      'Admin Panel',
      'User Management',
      'Alex Creator',
      'Sam Admin',
      'Casey Content',
      'SUSPENDED',
      'Channel Moderation',
      'AIArbiTech Actions',
      'Casey Viral Zone',
      'AI Director Configuration',
      'gpt-4o-mini',
      'Audit Logs',
      'UPDATE_USER_STATUS',
      'System Health',
      'API Gateway',
      'YouTube API',
    ]) {
      expect(markup, `expected to contain: "${expected}"`).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<AdminPanelPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading admin panel');
  });
});
