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

describe('foundation routes', () => {
  it('exposes liveness with correlation metadata and security headers', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health/live',
      headers: { 'x-correlation-id': 'test-correlation' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers['x-correlation-id']).toBe('test-correlation');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.json().data.status).toBe('ALIVE');
  });

  it('exposes readiness without requiring unverified Global Ecosystem integration', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/health/ready' });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({
      status: 'READY',
      checks: { globalEcosystem: 'NOT_CONFIGURED' },
    });
  });

  it('returns the independent platform manifest', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/platform/manifest' });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({
      platformId: 'PLATFORM_YOUTUBE_OS',
      globalDatabaseAccess: 'PROHIBITED',
      status: 'FOUNDATION_INITIALIZED',
    });
  });

  it('reports compatibility without external network activity', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/platform/compatibility' });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({
      integrationConfigured: false,
      networkRequestPerformed: false,
      status: 'NOT_CONFIGURED',
    });
  });
});
