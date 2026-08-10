import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatusCard } from '../../components/gateway/StatusCard';
import { EndpointList } from '../../components/gateway/EndpointList';
import type { GatewayStatusResponse, EcosystemEndpoint } from '../../gateway/types';

const status: GatewayStatusResponse = {
  status: 'ACTIVE',
  version: '1.4.2',
  uptime: '14d 6h 22m',
  activeConnections: 7,
  circuitBreaker: 'CLOSED',
  rateLimitRemaining: 4872,
  checkedAt: '2026-08-09T09:00:00.000Z',
};

const endpoints: EcosystemEndpoint[] = [
  { id: 'ep-identity', name: 'Identity Service', domain: 'global-ecosystem', path: '/identity/v1/verify', method: 'POST', status: 'AVAILABLE', latencyMs: 38, description: 'Verifies creator identity tokens.', requiresAuth: true, version: 'v1' },
  { id: 'ep-ai-core', name: 'AI Core', domain: 'global-ecosystem', path: '/ai/v2/inference', method: 'POST', status: 'AVAILABLE', latencyMs: 210, description: 'Runs AI inference.', requiresAuth: true, version: 'v2' },
  { id: 'ep-payment', name: 'Payment Processor', domain: 'global-ecosystem', path: '/payments/v1/initiate', method: 'POST', status: 'DEGRADED', latencyMs: 680, description: 'Initiates payments.', requiresAuth: true, version: 'v1' },
];

describe('StatusCard', () => {
  it('renders gateway status with version, uptime, and circuit breaker', () => {
    const markup = renderToStaticMarkup(<StatusCard status={status} />);
    expect(markup).toContain('Gateway Status');
    expect(markup).toContain('ACTIVE');
    expect(markup).toContain('1.4.2');
    expect(markup).toContain('14d 6h 22m');
    expect(markup).toContain('CLOSED');
    expect(markup).toContain('4');
  });

  it('renders 🟢 icon for ACTIVE status', () => {
    const markup = renderToStaticMarkup(<StatusCard status={status} />);
    expect(markup).toContain('🟢');
  });

  it('renders 🔴 icon for DOWN status', () => {
    const downStatus: GatewayStatusResponse = { ...status, status: 'DOWN', circuitBreaker: 'OPEN' };
    const markup = renderToStaticMarkup(<StatusCard status={downStatus} />);
    expect(markup).toContain('🔴');
    expect(markup).toContain('OPEN');
  });
});

describe('EndpointList', () => {
  it('renders all endpoints with names, methods, and status icons', () => {
    const markup = renderToStaticMarkup(<EndpointList endpoints={endpoints} />);
    expect(markup).toContain('Endpoint Registry');
    expect(markup).toContain('Identity Service');
    expect(markup).toContain('AI Core');
    expect(markup).toContain('Payment Processor');
    expect(markup).toContain('/identity/v1/verify');
    expect(markup).toContain('38 ms avg');
  });

  it('shows endpoint count', () => {
    const markup = renderToStaticMarkup(<EndpointList endpoints={endpoints} />);
    expect(markup).toContain('3 registered Global Ecosystem endpoints');
  });

  it('shows empty state when no endpoints', () => {
    const markup = renderToStaticMarkup(<EndpointList endpoints={[]} />);
    expect(markup).toContain('No endpoints registered.');
  });
});
