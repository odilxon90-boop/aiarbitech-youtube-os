import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { requirePermission, resolvePrincipal } from '../shared/auth.js';

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

const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('dashboard API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/dashboard/summary' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('rejects access with an unrecognized token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/summary',
      headers: { Authorization: 'Bearer not-a-known-token' },
    });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when the required permission is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/summary',
      headers: { Authorization: 'Bearer mock-viewer-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns a structured summary for an authorized creator', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/summary',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(['HEALTHY', 'DEGRADED', 'CRITICAL']).toContain(body.data.aiStatus.level);
    expect(body.data.monetization.goal).toBeGreaterThan(0);
    expect(body.data.channels.length).toBeGreaterThan(0);
    expect(body.data.kpis.length).toBeGreaterThan(0);
    expect(body.data.recommendations.length).toBeGreaterThan(0);
    expect(body.data.recentActivity.length).toBeGreaterThan(0);
    expect(body.data.quickActions.length).toBeGreaterThan(0);
    expect(body.data.aiChat.enabled).toBe(true);
    expect(body.data.revenueSeries.points.length).toBeGreaterThan(0);
    expect(body.data.channelHealth.score).toBeGreaterThanOrEqual(0);
    expect(body.data.channelHealth.details.length).toBeGreaterThan(0);
    expect(body.meta.correlationId).toBeTruthy();
  });

  it('returns KPI metrics for an authorized creator', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/kpi',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const labels = response.json().data.metrics.map((metric: { label: string }) => metric.label);
    expect(labels).toEqual(expect.arrayContaining(['Views', 'Subscribers', 'Revenue', 'CTR']));
  });

  it('returns AI recommendations for an authorized creator', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/recommendations',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.count).toBeGreaterThan(0);
    expect(response.json().data.items.length).toBe(response.json().data.count);
  });

  it('exposes dashboard endpoints as GET only', async () => {
    const app = await createApp();
    const urls = [
      '/api/v1/dashboard/summary',
      '/api/v1/dashboard/kpi',
      '/api/v1/dashboard/recommendations',
    ];
    for (const url of urls) {
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
        const response = await app.inject({
          method,
          url,
          headers: creatorAuth,
          payload: {},
        });
        expect(response.statusCode, `${method} ${url}`).toBe(404);
      }
    }
  });
});

describe('dashboard permission checks', () => {
  it('resolves mock tokens to principals with permissions', () => {
    expect(resolvePrincipal('mock-creator-token')?.role).toBe('CREATOR');
    expect(resolvePrincipal('mock-creator-token')?.permissions).toContain('dashboard:read');
    expect(resolvePrincipal('mock-viewer-token')?.permissions).not.toContain('dashboard:read');
  });

  it('throws 401 when no token is supplied', () => {
    const request = { headers: {} } as never;
    expect(() => requirePermission(request, 'dashboard:read')).toThrowError(/bearer token/i);
  });

  it('throws 403 when the token lacks the required permission', () => {
    const request = { headers: { authorization: 'Bearer mock-viewer-token' } } as never;
    expect(() => requirePermission(request, 'dashboard:read')).toThrowError(
      /insufficient permissions/i,
    );
  });
});