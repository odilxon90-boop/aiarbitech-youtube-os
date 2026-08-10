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

describe('memory API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/memory/summary' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when the required permission is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/memory/summary',
      headers: { Authorization: 'Bearer mock-viewer-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns a structured summary for an authorized creator', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/memory/summary',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.stylePreferences.length).toBeGreaterThanOrEqual(3);
    expect(body.data.contentPreferences.length).toBeGreaterThanOrEqual(3);
    expect(body.data.recentDecisions.length).toBeGreaterThanOrEqual(5);
    expect(body.data.learningHistory.length).toBeGreaterThanOrEqual(5);
    expect(body.meta.correlationId).toBeTruthy();
  });

  it('returns preferences', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/memory/preferences',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.stylePreferences.length).toBeGreaterThanOrEqual(3);
    expect(body.data.contentPreferences.length).toBeGreaterThanOrEqual(3);
  });

  it('updates preferences', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/memory/preferences',
      headers: creatorAuth,
      payload: {
        stylePreferences: [{ id: 'sp-new', category: 'Tone', value: 'Energetic', confidence: 0.9 }],
        contentPreferences: [{ id: 'cp-new', topic: 'AI', format: 'Short', priority: 'HIGH', note: 'Viral potential' }],
      },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.stylePreferences[0].value).toBe('Energetic');
  });

  it('returns decision history', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/memory/decisions',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(5);
    expect(body.data.items[0]).toMatchObject({ title: expect.any(String), outcome: expect.any(String) });
  });

  it('adds a learning entry', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/memory/learn',
      headers: creatorAuth,
      payload: { event: 'AI recommended daily shorts', result: 'Adopted; views increased 12%.' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items[0].event).toBe('AI recommended daily shorts');
    expect(body.data.items[0].result).toBe('Adopted; views increased 12%.');
  });

  it('exposes memory endpoints with correct methods only', async () => {
    const app = await createApp();
    const urls = [
      '/api/v1/memory/summary',
      '/api/v1/memory/preferences',
      '/api/v1/memory/decisions',
      '/api/v1/memory/learn',
    ];
    for (const url of urls) {
      const response = await app.inject({ method: 'DELETE', url, headers: creatorAuth });
      expect(response.statusCode, `DELETE ${url}`).toBe(404);
    }
  });
});
