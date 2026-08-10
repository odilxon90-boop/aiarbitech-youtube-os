import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
<<<<<<< HEAD
import { requirePermission } from '../shared/auth.js';

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

const presidentAuth = { Authorization: 'Bearer mock-president-token' };

describe('president API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/president/dashboard' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when president:access is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/president/dashboard',
      headers: { Authorization: 'Bearer mock-creator-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns president dashboard', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/president/dashboard',
      headers: presidentAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.health.length).toBeGreaterThanOrEqual(3);
    expect(body.data.channels.length).toBeGreaterThanOrEqual(10);
    expect(body.data.aiStatus.length).toBeGreaterThanOrEqual(5);
    expect(body.data.risks.length).toBeGreaterThanOrEqual(5);
    expect(body.data.revenue.currency).toBe('USD');
    expect(body.meta.correlationId).toBeTruthy();
  });

  it('returns health metrics', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/president/health',
      headers: presidentAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.health[0]).toMatchObject({ name: expect.any(String), status: expect.any(String) });
  });

  it('returns revenue overview', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/president/revenue',
      headers: presidentAuth,
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
      url: '/api/v1/president/channels',
      headers: presidentAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.channels.length).toBeGreaterThanOrEqual(10);
  });

  it('returns AI status', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/president/ai-status',
      headers: presidentAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.aiStatus.length).toBeGreaterThanOrEqual(5);
  });

  it('returns risks', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/president/risks',
      headers: presidentAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.risks.length).toBeGreaterThanOrEqual(5);
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(body.data.risks[0].severity);
  });

  it('exposes president endpoints as GET only', async () => {
    const app = await createApp();
    const urls = [
      '/api/v1/president/dashboard',
      '/api/v1/president/health',
      '/api/v1/president/revenue',
      '/api/v1/president/channels',
      '/api/v1/president/ai-status',
      '/api/v1/president/risks',
    ];
    for (const url of urls) {
      const response = await app.inject({ method: 'POST', url, headers: presidentAuth });
      expect(response.statusCode, `POST ${url}`).toBe(404);
    }
  });
=======
import { JwtService } from '../auth/jwt.service.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os', JWT_SECRET: 'test-jwt-secret-that-is-longer-than-thirty-two-characters' });
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));
it('protects and returns President Panel mock data', async () => {
  const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app);
  const token = new JwtService(config.JWT_SECRET!, '7d', '30d').sign({ id: 'president-01', email: 'president@example.com', role: 'President', permissions: ['president:access'] });
  expect((await app.inject({ method: 'GET', url: '/api/v1/president/dashboard' })).statusCode).toBe(401);
  const headers = { authorization: `Bearer ${token}` };
  const responses = await Promise.all(['/dashboard', '/health', '/revenue', '/channels', '/ai-status', '/risks'].map((path) => app.inject({ method: 'GET', url: `/api/v1/president${path}`, headers })));
  expect(responses[0]!.json().data).toMatchObject({ platformHealth: 'HEALTHY', activeChannels: 42 });
  expect(responses[1]!.json().data.length).toBeGreaterThanOrEqual(3); expect(responses[2]!.json().data.monthly).toBe(28450); expect(responses[3]!.json().data).toHaveLength(10); expect(responses[4]!.json().data).toHaveLength(5); expect(responses[5]!.json().data).toHaveLength(5);
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
});
