import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AuditLogList } from '../../components/admin/AuditLogList';
import { HealthCard } from '../../components/admin/HealthCard';
import type { AuditLogEntry, AdminHealthResponse } from '../../admin/types';

const entries: AuditLogEntry[] = [
  { id: 'log-01', at: '2026-08-09T07:55:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'UPDATE_USER_STATUS', resource: 'user', resourceId: 'usr-5', outcome: 'SUCCESS', ip: '10.0.0.1' },
  { id: 'log-02', at: '2026-08-09T05:00:00Z', actor: 'Casey Content', actorRole: 'CREATOR', action: 'LOGIN', resource: 'auth', resourceId: 'usr-5', outcome: 'FAILURE', ip: '203.0.113.5' },
];

const health: AdminHealthResponse = {
  overall: 'DEGRADED',
  metrics: [
    { service: 'API Gateway', status: 'OK', latencyMs: 12, detail: 'All routes responding normally.', checkedAt: '2026-08-09T09:00:00Z' },
    { service: 'Database', status: 'OK', latencyMs: 8, detail: 'Connection pool healthy.', checkedAt: '2026-08-09T09:00:00Z' },
    { service: 'YouTube API', status: 'DEGRADED', latencyMs: 820, detail: 'Quota at 78%.', checkedAt: '2026-08-09T09:00:00Z' },
    { service: 'AI Core', status: 'OK', latencyMs: 142, detail: 'Responding within SLA.', checkedAt: '2026-08-09T09:00:00Z' },
  ],
};

describe('AuditLogList', () => {
  it('renders audit log entries with actions and outcomes', () => {
    const markup = renderToStaticMarkup(<AuditLogList entries={entries} />);
    expect(markup).toContain('Audit Logs');
    expect(markup).toContain('UPDATE_USER_STATUS');
    expect(markup).toContain('Sam Admin');
    expect(markup).toContain('SUCCESS');
    expect(markup).toContain('LOGIN');
    expect(markup).toContain('Casey Content');
    expect(markup).toContain('FAILURE');
    expect(markup).toContain('10.0.0.1');
  });

  it('shows entry count', () => {
    const markup = renderToStaticMarkup(<AuditLogList entries={entries} />);
    expect(markup).toContain('2 recent events');
  });

  it('shows empty state when no entries', () => {
    const markup = renderToStaticMarkup(<AuditLogList entries={[]} />);
    expect(markup).toContain('No audit log entries found.');
  });
});

describe('HealthCard', () => {
  it('renders health metrics with statuses and latencies', () => {
    const markup = renderToStaticMarkup(<HealthCard health={health} />);
    expect(markup).toContain('System Health');
    expect(markup).toContain('DEGRADED');
    expect(markup).toContain('API Gateway');
    expect(markup).toContain('12 ms');
    expect(markup).toContain('YouTube API');
    expect(markup).toContain('820 ms');
    expect(markup).toContain('All routes responding normally.');
  });

  it('renders status icons for OK, DEGRADED, DOWN', () => {
    const downHealth: AdminHealthResponse = {
      overall: 'DOWN',
      metrics: [
        { service: 'Database', status: 'DOWN', latencyMs: 0, detail: 'Connection failed.', checkedAt: '2026-08-09T09:00:00Z' },
        { service: 'API Gateway', status: 'OK', latencyMs: 12, detail: 'Healthy.', checkedAt: '2026-08-09T09:00:00Z' },
      ],
    };
    const markup = renderToStaticMarkup(<HealthCard health={downHealth} />);
    expect(markup).toContain('🔴');
    expect(markup).toContain('🟢');
    expect(markup).toContain('Connection failed.');
  });
});
