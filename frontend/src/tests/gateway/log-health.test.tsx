import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LogList } from '../../components/gateway/LogList';
import { HealthChart } from '../../components/gateway/HealthChart';
import type { GatewayLogEntry, GatewayHealthResponse } from '../../gateway/types';

const logs: GatewayLogEntry[] = [
  { id: 'log-001', requestId: 'req-000001', endpointId: 'ep-identity', endpointName: 'Identity Service', method: 'POST', path: '/identity/v1/verify', outcome: 'SUCCESS', statusCode: 200, latencyMs: 38, actor: 'admin-1', calledAt: '2026-08-09T08:57:00.000Z' },
  { id: 'log-002', requestId: 'req-000002', endpointId: 'ep-payment', endpointName: 'Payment Processor', method: 'POST', path: '/payments/v1/initiate', outcome: 'TIMEOUT', statusCode: 504, latencyMs: 700, actor: 'creator-1', calledAt: '2026-08-09T08:54:00.000Z' },
  { id: 'log-003', requestId: 'req-000003', endpointId: 'ep-ai-core', endpointName: 'AI Core', method: 'POST', path: '/ai/v2/inference', outcome: 'ERROR', statusCode: 500, latencyMs: 250, actor: 'creator-1', calledAt: '2026-08-09T08:51:00.000Z' },
];

const health: GatewayHealthResponse = {
  overall: 'DEGRADED',
  metrics: [
    { service: 'Identity Service', status: 'OK', latencyMs: 38, errorRate: 0.2, availability: 99.97, checkedAt: '2026-08-09T09:00:00.000Z' },
    { service: 'AI Core', status: 'OK', latencyMs: 210, errorRate: 0.8, availability: 99.91, checkedAt: '2026-08-09T09:00:00.000Z' },
    { service: 'Payment Processor', status: 'DEGRADED', latencyMs: 680, errorRate: 3.4, availability: 97.80, checkedAt: '2026-08-09T09:00:00.000Z' },
  ],
};

describe('LogList', () => {
  it('renders log entries with outcomes and status codes', () => {
    const markup = renderToStaticMarkup(<LogList entries={logs} />);
    expect(markup).toContain('Gateway Request Logs');
    expect(markup).toContain('Identity Service');
    expect(markup).toContain('SUCCESS');
    expect(markup).toContain('Payment Processor');
    expect(markup).toContain('TIMEOUT');
    expect(markup).toContain('AI Core');
    expect(markup).toContain('ERROR');
    expect(markup).toContain('38 ms');
  });

  it('shows entry count', () => {
    const markup = renderToStaticMarkup(<LogList entries={logs} />);
    expect(markup).toContain('3 recent requests');
  });

  it('shows empty state when no logs', () => {
    const markup = renderToStaticMarkup(<LogList entries={[]} />);
    expect(markup).toContain('No log entries found.');
  });
});

describe('HealthChart', () => {
  it('renders health metrics with latency bars and availability', () => {
    const markup = renderToStaticMarkup(<HealthChart health={health} />);
    expect(markup).toContain('Gateway Health');
    expect(markup).toContain('DEGRADED');
    expect(markup).toContain('Identity Service');
    expect(markup).toContain('99.97%');
    expect(markup).toContain('Payment Processor');
    expect(markup).toContain('97.80%');
    expect(markup).toContain('0.2%');
    expect(markup).toContain('3.4%');
  });

  it('renders status icons for OK and DEGRADED', () => {
    const markup = renderToStaticMarkup(<HealthChart health={health} />);
    expect(markup).toContain('🟢');
    expect(markup).toContain('🟡');
  });
});
