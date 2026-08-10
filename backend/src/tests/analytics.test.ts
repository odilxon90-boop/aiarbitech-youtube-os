import { describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { requirePermission, resolvePrincipal } from '../shared/auth.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});

const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('analytics API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/analytics/summary' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
    await app.close();
  });

  it('forbids access when analytics:read is missing (403)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/analytics/trends',
      headers: { Authorization: 'Bearer mock-viewer-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
    await app.close();
  });

  it('returns a structured summary with the five core metrics', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/analytics/summary', headers: creatorAuth });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.meta.correlationId).toBeTruthy();
    const labels = body.data.metrics.map((metric: { label: string }) => metric.label);
    expect(labels).toEqual(expect.arrayContaining(['Subscribers', 'Views', 'Watch Time (h)', 'CTR (%)', 'Revenue ($)']));
    expect(body.data.metrics).toHaveLength(5);
    await app.close();
  });

  it('returns 30 days of trends across all metrics', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/analytics/trends', headers: creatorAuth });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.series).toHaveLength(5);
    for (const series of body.data.series) {
      expect(series.points).toHaveLength(30);
      const dates = series.points.map((p: { date: string }) => p.date);
      expect(dates).toEqual([...dates].sort());
    }
    await app.close();
  });

  it('returns performance data: top videos, geography and devices', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/analytics/performance', headers: creatorAuth });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.topVideos.length).toBeGreaterThanOrEqual(10);
    expect(body.data.topVideos[0]).toHaveProperty('title');
    expect(body.data.geography.length).toBeGreaterThanOrEqual(1);
    expect(body.data.devices.length).toBeGreaterThanOrEqual(1);
    const deviceShares = body.data.devices.reduce((total: number, d: { share: number }) => total + d.share, 0);
    expect(deviceShares).toBe(100);
    await app.close();
  });

  it('exposes analytics endpoints as GET only', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const urls = ['/api/v1/analytics/summary', '/api/v1/analytics/trends', '/api/v1/analytics/performance'];
    for (const url of urls) {
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
        const response = await app.inject({ method, url, headers: creatorAuth, payload: {} });
        expect(response.statusCode, `${method} ${url}`).toBe(404);
      }
    }
    await app.close();
  });

  it('admin tokens may read analytics (permission present)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/analytics/summary',
      headers: { Authorization: 'Bearer mock-admin-token' },
    });
    expect(response.statusCode).toBe(200);
    await app.close();
  });
});

describe('analytics permission checks', () => {
  it('resolves mock tokens to principals with analytics:read', () => {
    expect(resolvePrincipal('mock-creator-token')?.permissions).toContain('analytics:read');
    expect(resolvePrincipal('mock-viewer-token')?.permissions).not.toContain('analytics:read');
  });

  it('throws 401 when no token is supplied', () => {
    const request = { headers: {} } as never;
    expect(() => requirePermission(request, 'analytics:read')).toThrowError(/bearer token/i);
  });

  it('throws 403 when the token lacks the required permission', () => {
    const request = { headers: { authorization: 'Bearer mock-viewer-token' } } as never;
    expect(() => requirePermission(request, 'analytics:read')).toThrowError(/insufficient permissions/i);
  });
});