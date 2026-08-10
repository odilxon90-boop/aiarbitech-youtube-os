import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});

const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

async function createApp() {
  const app = await buildApp({ config, logger: new NoopLogger() });
  apps.push(app);
  return app;
}

const adminAuth = { Authorization: 'Bearer mock-admin-token' };
const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('gateway API — auth guards', () => {
  const getEndpoints = [
    '/api/v1/gateway/status',
    '/api/v1/gateway/endpoints',
    '/api/v1/gateway/logs',
    '/api/v1/gateway/health',
  ];

  for (const url of getEndpoints) {
    it(`rejects unauthenticated request to ${url} (401)`, async () => {
      const app = await createApp();
      const res = await app.inject({ method: 'GET', url });
      expect(res.statusCode).toBe(401);
      expect(res.json().error.code).toBe('UNAUTHORIZED');
    });

    it(`rejects creator token on ${url} (403)`, async () => {
      const app = await createApp();
      const res = await app.inject({ method: 'GET', url, headers: creatorAuth });
      expect(res.statusCode).toBe(403);
      expect(res.json().error.code).toBe('FORBIDDEN');
    });
  }
});

describe('gateway API — status', () => {
  it('returns ACTIVE status with circuit breaker info', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/gateway/status', headers: adminAuth });
    expect(res.statusCode).toBe(200);
    const { data } = res.json();
    expect(data.status).toBe('ACTIVE');
    expect(data.version).toBeTruthy();
    expect(data.uptime).toBeTruthy();
    expect(['CLOSED', 'OPEN', 'HALF_OPEN']).toContain(data.circuitBreaker);
    expect(typeof data.rateLimitRemaining).toBe('number');
    expect(res.json().meta.correlationId).toBeTruthy();
  });
});

describe('gateway API — endpoints', () => {
  it('returns 5+ ecosystem endpoints', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/gateway/endpoints', headers: adminAuth });
    expect(res.statusCode).toBe(200);
    const { data } = res.json();
    expect(data.count).toBeGreaterThanOrEqual(5);
    expect(data.endpoints.length).toBe(data.count);
    for (const ep of data.endpoints) {
      expect(ep.id).toBeTruthy();
      expect(ep.name).toBeTruthy();
      expect(ep.path).toBeTruthy();
      expect(['AVAILABLE', 'DEGRADED', 'UNAVAILABLE']).toContain(ep.status);
    }
  });

  it('includes Identity, Security, AI Core, Wallet, Payment endpoints', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/gateway/endpoints', headers: adminAuth });
    const names: string[] = res.json().data.endpoints.map((e: { name: string }) => e.name);
    expect(names).toContain('Identity Service');
    expect(names).toContain('Security Gateway');
    expect(names).toContain('AI Core');
    expect(names).toContain('Wallet Service');
    expect(names).toContain('Payment Processor');
  });
});

describe('gateway API — call endpoint', () => {
  it('executes a mock call to a known endpoint', async () => {
    const app = await createApp();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/gateway/call/ep-identity',
      headers: adminAuth,
      payload: { payload: { token: 'mock-token-123' } },
    });
    expect(res.statusCode).toBe(200);
    const { data } = res.json();
    expect(data.endpointId).toBe('ep-identity');
    expect(['SUCCESS', 'ERROR', 'TIMEOUT', 'CIRCUIT_OPEN']).toContain(data.outcome);
    expect(data.requestId).toBeTruthy();
    expect(data.latencyMs).toBeGreaterThan(0);
    expect(data.response).toBeTruthy();
  });

  it('returns 404 for an unknown endpoint', async () => {
    const app = await createApp();
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/gateway/call/ep-nonexistent',
      headers: adminAuth,
      payload: {},
    });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe('NOT_FOUND');
  });

  it('rejects unauthenticated call (401)', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'POST', url: '/api/v1/gateway/call/ep-identity', payload: {} });
    expect(res.statusCode).toBe(401);
  });
});

describe('gateway API — logs', () => {
  it('returns up to 50 log entries', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/gateway/logs', headers: adminAuth });
    expect(res.statusCode).toBe(200);
    const { data } = res.json();
    expect(data.count).toBeGreaterThanOrEqual(50);
    expect(data.entries.length).toBe(data.count);
    for (const entry of data.entries) {
      expect(entry.id).toBeTruthy();
      expect(entry.endpointName).toBeTruthy();
      expect(['SUCCESS', 'ERROR', 'TIMEOUT', 'CIRCUIT_OPEN']).toContain(entry.outcome);
    }
  });
});

describe('gateway API — health', () => {
  it('returns health metrics for 5+ services', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/gateway/health', headers: adminAuth });
    expect(res.statusCode).toBe(200);
    const { data } = res.json();
    expect(['OK', 'DEGRADED', 'DOWN']).toContain(data.overall);
    expect(data.metrics.length).toBeGreaterThanOrEqual(5);
    for (const metric of data.metrics) {
      expect(metric.service).toBeTruthy();
      expect(['OK', 'DEGRADED', 'DOWN']).toContain(metric.status);
      expect(typeof metric.latencyMs).toBe('number');
      expect(typeof metric.errorRate).toBe('number');
      expect(typeof metric.availability).toBe('number');
    }
  });
});

describe('gateway middleware — response headers', () => {
  it('attaches X-Gateway-Version header on gateway routes', async () => {
    const app = await createApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/gateway/status', headers: adminAuth });
    expect(res.headers['x-gateway-version']).toBeTruthy();
    expect(res.headers['x-gateway-circuit-breaker']).toBe('CLOSED');
  });
});
