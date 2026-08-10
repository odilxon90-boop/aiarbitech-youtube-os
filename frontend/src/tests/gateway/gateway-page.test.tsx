import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GatewayPage } from '../../pages/GatewayPage';
import type { GatewaySummary } from '../../gateway/types';

const summary: GatewaySummary = {
  status: {
    status: 'ACTIVE',
    version: '1.4.2',
    uptime: '14d 6h 22m',
    activeConnections: 7,
    circuitBreaker: 'CLOSED',
    rateLimitRemaining: 4872,
    checkedAt: '2026-08-09T09:00:00.000Z',
  },
  endpoints: [
    { id: 'ep-identity', name: 'Identity Service', domain: 'global-ecosystem', path: '/identity/v1/verify', method: 'POST', status: 'AVAILABLE', latencyMs: 38, description: 'Verifies creator identity tokens.', requiresAuth: true, version: 'v1' },
    { id: 'ep-payment', name: 'Payment Processor', domain: 'global-ecosystem', path: '/payments/v1/initiate', method: 'POST', status: 'DEGRADED', latencyMs: 680, description: 'Initiates a payment transaction.', requiresAuth: true, version: 'v1' },
  ],
  logs: [
    { id: 'log-001', requestId: 'req-000001', endpointId: 'ep-identity', endpointName: 'Identity Service', method: 'POST', path: '/identity/v1/verify', outcome: 'SUCCESS', statusCode: 200, latencyMs: 38, actor: 'admin-1', calledAt: '2026-08-09T08:57:00.000Z' },
    { id: 'log-002', requestId: 'req-000002', endpointId: 'ep-payment', endpointName: 'Payment Processor', method: 'POST', path: '/payments/v1/initiate', outcome: 'TIMEOUT', statusCode: 504, latencyMs: 700, actor: 'creator-1', calledAt: '2026-08-09T08:54:00.000Z' },
  ],
  health: {
    overall: 'DEGRADED',
    metrics: [
      { service: 'Identity Service', status: 'OK', latencyMs: 38, errorRate: 0.2, availability: 99.97, checkedAt: '2026-08-09T09:00:00.000Z' },
      { service: 'Payment Processor', status: 'DEGRADED', latencyMs: 680, errorRate: 3.4, availability: 97.80, checkedAt: '2026-08-09T09:00:00.000Z' },
    ],
  },
};

describe('GatewayPage', () => {
  it('renders all gateway sections from initial data without fetching', () => {
    const markup = renderToStaticMarkup(<GatewayPage initialData={summary} />);
    for (const expected of [
      'Integration Gateway',
      'Gateway Status',
      'ACTIVE',
      '1.4.2',
      'CLOSED',
      'Endpoint Registry',
      'Identity Service',
      'Payment Processor',
      'Gateway Request Logs',
      'Gateway Health',
      'DEGRADED',
      '99.97%',
    ]) {
      expect(markup, `expected to contain: "${expected}"`).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<GatewayPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading gateway data');
  });
});
