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

const heirAuth = { Authorization: 'Bearer mock-heir-token' };

describe('heir API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/heir/dashboard' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when heir:access is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/dashboard',
      headers: { Authorization: 'Bearer mock-creator-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns heir dashboard with training data', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/dashboard',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.health.length).toBeGreaterThanOrEqual(3);
    expect(body.data.channels.length).toBeGreaterThanOrEqual(8);
    expect(body.data.aiStatus.length).toBeGreaterThanOrEqual(4);
    expect(body.data.risks.length).toBeGreaterThanOrEqual(4);
    expect(body.data.training.totalModules).toBe(4);
    expect(body.data.training.overallScore).toBeGreaterThanOrEqual(0);
    expect(body.meta.correlationId).toBeTruthy();
  });

  it('returns health metrics', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/health',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.health[0]).toMatchObject({ name: expect.any(String), status: expect.any(String) });
  });

  it('returns revenue overview', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/revenue',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.total).toBeGreaterThan(0);
    expect(body.data.monthly).toBeGreaterThan(0);
  });

  it('returns channels', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/channels',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.channels.length).toBeGreaterThanOrEqual(8);
  });

  it('returns AI status', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/ai-status',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.aiStatus.length).toBeGreaterThanOrEqual(4);
  });

  it('returns risks', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/risks',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.risks.length).toBeGreaterThanOrEqual(4);
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(body.data.risks[0].severity);
  });

  it('returns training progress', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/heir/training',
      headers: heirAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.totalModules).toBeGreaterThanOrEqual(3);
    expect(body.data.overallScore).toBeGreaterThanOrEqual(0);
    expect(body.data.nextSteps.length).toBeGreaterThanOrEqual(2);
  });

  it('exposes heir endpoints as GET only', async () => {
    const app = await createApp();
    const urls = [
      '/api/v1/heir/dashboard',
      '/api/v1/heir/health',
      '/api/v1/heir/revenue',
      '/api/v1/heir/channels',
      '/api/v1/heir/ai-status',
      '/api/v1/heir/risks',
      '/api/v1/heir/training',
    ];
    for (const url of urls) {
      const response = await app.inject({ method: 'POST', url, headers: heirAuth });
      expect(response.statusCode, `POST ${url}`).toBe(404);
    }
  });
});
