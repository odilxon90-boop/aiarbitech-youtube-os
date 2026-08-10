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

  it('exposes every Gate 0B governance artifact through GET-only routes', async () => {
    const app = await createApp();
    const routes = [
      '/api/v1/platform/passport',
      '/api/v1/platform/boundaries',
      '/api/v1/platform/features',
      '/api/v1/platform/capabilities',
      '/api/v1/platform/knowledge',
      '/api/v1/platform/ai-policies',
      '/api/v1/platform/health-manifest',
      '/api/v1/platform/registration-readiness',
      '/api/v1/platform/contracts/compatibility',
      '/api/v1/platform/dependencies',
    ];

    for (const url of routes) {
      const getResponse = await app.inject({ method: 'GET', url });
      expect(getResponse.statusCode, url).toBe(200);
      expect(getResponse.json().data.schemaVersion, url).toBe('1.0.0');

      const postResponse = await app.inject({ method: 'POST', url, payload: {} });
      expect(postResponse.statusCode, url).toBe(404);
    }
  });

  it('exposes complete GET-only capability registry endpoints', async () => {
    const app = await createApp();
    const routes = ['/api/v1/platform/capabilities','/api/v1/platform/capabilities/summary','/api/v1/platform/capabilities/validation','/api/v1/platform/capabilities/CHANNEL_MANAGEMENT'];
    for (const url of routes) {
      expect((await app.inject({ method:'GET', url })).statusCode, url).toBe(200);
      for (const method of ['POST','PUT','PATCH','DELETE'] as const) expect((await app.inject({ method, url, payload:{} })).statusCode, `${method} ${url}`).toBe(404);
    }
    expect((await app.inject({ method:'GET', url:'/api/v1/platform/capabilities/UNKNOWN' })).statusCode).toBe(404);
    expect((await app.inject({ method:'GET', url:'/api/v1/platform/capabilities/UNKNOWN' })).json().error.code).toBe('CAPABILITY_NOT_FOUND');
  });
});
