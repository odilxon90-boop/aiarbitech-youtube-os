import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
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

const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('intelligence API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/intelligence/profile' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when permission is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/intelligence/profile',
      headers: { Authorization: 'Bearer mock-viewer-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns creator profile', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/intelligence/profile',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.profile.name).toBe('Alex Creator');
    expect(body.data.profile.level).toBe('Intermediate');
    expect(body.data.profile.niche).toBeTruthy();
    expect(body.meta.correlationId).toBeTruthy();
  });

  it('returns skills with scores', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/intelligence/skills',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.skills.length).toBeGreaterThanOrEqual(5);
    expect(body.data.skills[0]).toMatchObject({ name: expect.any(String), score: expect.any(Number) });
  });

  it('returns strengths, weaknesses, and recommendations', async () => {
    const app = await createApp();
    const strengthsRes = await app.inject({
      method: 'GET',
      url: '/api/v1/intelligence/strengths',
      headers: creatorAuth,
    });
    const weaknessesRes = await app.inject({
      method: 'GET',
      url: '/api/v1/intelligence/weaknesses',
      headers: creatorAuth,
    });
    const recommendationsRes = await app.inject({
      method: 'GET',
      url: '/api/v1/intelligence/recommendations',
      headers: creatorAuth,
    });
    expect(strengthsRes.statusCode).toBe(200);
    expect(weaknessesRes.statusCode).toBe(200);
    expect(recommendationsRes.statusCode).toBe(200);
    expect(strengthsRes.json().data.strengths.length).toBeGreaterThanOrEqual(3);
    expect(weaknessesRes.json().data.weaknesses.length).toBeGreaterThanOrEqual(3);
    expect(recommendationsRes.json().data.recommendations.length).toBeGreaterThanOrEqual(5);
  });

  it('exposes intelligence endpoints as GET only', async () => {
    const app = await createApp();
    const urls = [
      '/api/v1/intelligence/profile',
      '/api/v1/intelligence/skills',
      '/api/v1/intelligence/strengths',
      '/api/v1/intelligence/weaknesses',
      '/api/v1/intelligence/recommendations',
    ];
    for (const url of urls) {
      const response = await app.inject({ method: 'POST', url, headers: creatorAuth });
      expect(response.statusCode, `POST ${url}`).toBe(404);
    }
  });
});
