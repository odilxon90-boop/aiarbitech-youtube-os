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

describe('video API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/video/ideas' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when permission is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/video/ideas',
      headers: { Authorization: 'Bearer mock-viewer-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns video ideas', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/video/ideas',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.ideas.length).toBeGreaterThanOrEqual(10);
    expect(body.data.ideas[0]).toMatchObject({ title: expect.any(String), confidence: expect.any(Number) });
  });

  it('returns a generated script by id', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/video/script/script-1',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.topic).toBe('Top 10 AI Tools for Creators');
  });

  it('returns 404 for missing script', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/video/script/missing',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });

  it('generates a new video script', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/video/generate',
      headers: creatorAuth,
      payload: { topic: 'AI in 2026', style: 'Tutorial', length: '10 min' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.script.topic).toBe('AI in 2026');
    expect(body.data.script.style).toBe('Tutorial');
    expect(body.data.script.outline.length).toBeGreaterThan(0);
  });

  it('returns projects and project detail', async () => {
    const app = await createApp();
    const projectsRes = await app.inject({
      method: 'GET',
      url: '/api/v1/video/projects',
      headers: creatorAuth,
    });
    expect(projectsRes.statusCode).toBe(200);
    expect(projectsRes.json().data.projects.length).toBeGreaterThanOrEqual(5);

    const first = projectsRes.json().data.projects[0];
    const detailRes = await app.inject({
      method: 'GET',
      url: `/api/v1/video/projects/${first.id}`,
      headers: creatorAuth,
    });
    expect(detailRes.statusCode).toBe(200);
    expect(detailRes.json().data.title).toBe(first.title);
  });

  it('returns 404 for missing project', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/video/projects/missing',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });
});
