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

const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('genre API — auth guards', () => {
  const endpoints = [
    '/api/v1/genre/trends',
    '/api/v1/genre/recommendations',
    '/api/v1/genre/popularity',
    '/api/v1/genre/genre-lofi/details',
  ];

  for (const url of endpoints) {
    it(`rejects unauthenticated request to ${url} (401)`, async () => {
      const app = await createApp();
      const response = await app.inject({ method: 'GET', url });
      expect(response.statusCode).toBe(401);
      expect(response.json().error.code).toBe('UNAUTHORIZED');
    });

    it(`rejects viewer token on ${url} (403)`, async () => {
      const app = await createApp();
      const response = await app.inject({
        method: 'GET',
        url,
        headers: { Authorization: 'Bearer mock-viewer-token' },
      });
      expect(response.statusCode).toBe(403);
      expect(response.json().error.code).toBe('FORBIDDEN');
    });
  }
});

describe('genre API — trends', () => {
  it('returns 10+ genre trends with 30-day point series', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/genre/trends',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.genres.length).toBeGreaterThanOrEqual(10);
    for (const genre of data.genres) {
      expect(genre.id).toBeTruthy();
      expect(genre.name).toBeTruthy();
      expect(genre.currentScore).toBeGreaterThan(0);
      expect(genre.points.length).toBeGreaterThanOrEqual(30);
    }
    expect(response.json().meta.correlationId).toBeTruthy();
  });
});

describe('genre API — recommendations', () => {
  it('returns 5+ AI recommendations with confidence scores', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/genre/recommendations',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.count).toBeGreaterThanOrEqual(5);
    expect(data.items.length).toBe(data.count);
    for (const rec of data.items) {
      expect(rec.id).toBeTruthy();
      expect(rec.name).toBeTruthy();
      expect(rec.confidence).toBeGreaterThan(0);
      expect(rec.confidence).toBeLessThanOrEqual(100);
      expect(rec.reason).toBeTruthy();
      expect(rec.tags.length).toBeGreaterThan(0);
    }
  });
});

describe('genre API — popularity', () => {
  it('returns genres ranked by popularity score', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/genre/popularity',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.genres.length).toBeGreaterThanOrEqual(10);
    for (const genre of data.genres) {
      expect(genre.id).toBeTruthy();
      expect(genre.name).toBeTruthy();
      expect(genre.score).toBeGreaterThan(0);
      expect(genre.rank).toBeGreaterThan(0);
      expect(['UP', 'DOWN', 'STABLE']).toContain(genre.change);
    }
    const scores = data.genres.map((g: { score: number }) => g.score);
    const sorted = [...scores].sort((a: number, b: number) => b - a);
    expect(scores).toEqual(sorted);
  });
});

describe('genre API — details', () => {
  it('returns genre details for a known genre id', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/genre/genre-lofi/details',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.genre.id).toBe('genre-lofi');
    expect(data.genre.name).toBeTruthy();
    expect(data.genre.styleKeywords.length).toBeGreaterThan(0);
    expect(data.genre.trendingArtists.length).toBeGreaterThan(0);
    expect(['RISING', 'STABLE', 'DECLINING']).toContain(data.genre.trendDirection);
  });

  it('returns 404 for an unknown genre id', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/genre/genre-nonexistent/details',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });
});

describe('genre API — GET only', () => {
  it('rejects non-GET methods on genre endpoints', async () => {
    const app = await createApp();
    const urls = ['/api/v1/genre/trends', '/api/v1/genre/recommendations', '/api/v1/genre/popularity'];
    for (const url of urls) {
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
        const response = await app.inject({ method, url, headers: creatorAuth, payload: {} });
        expect(response.statusCode, `${method} ${url}`).toBe(404);
      }
    }
  });
});
