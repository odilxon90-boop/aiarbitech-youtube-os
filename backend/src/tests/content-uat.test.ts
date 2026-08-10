import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const headers = {
  authorization: 'Bearer test-token',
  'x-permissions': 'goals:manage,videos:read,music:read,music:license,genres:read',
};
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

async function createApp() {
  const app = await buildApp({ config, logger: new NoopLogger() });
  apps.push(app);
  return app;
}

describe('UAT content APIs', () => {
  it('requires authentication and the feature permission', async () => {
    const app = await createApp();

    expect((await app.inject({ method: 'GET', url: '/api/v1/goals' })).statusCode).toBe(401);
    const denied = await app.inject({
      method: 'GET',
      url: '/api/v1/music',
      headers: { authorization: 'Bearer test-token' },
    });
    expect(denied.statusCode).toBe(403);
    expect(denied.json().error.code).toBe('PERMISSION_DENIED');
  });

  it('supports the goals CRUD workflow', async () => {
    const app = await createApp();
    const created = await app.inject({
      method: 'POST',
      url: '/api/v1/goals',
      headers,
      payload: { userId: 'user-01', title: 'Publish 12 videos', target: 12, deadline: '2026-12-31' },
    });
    expect(created.statusCode).toBe(200);
    const goal = created.json().data;

    const updated = await app.inject({
      method: 'PATCH',
      url: `/api/v1/goals/${goal.id}`,
      headers,
      payload: { current: 3 },
    });
    const listed = await app.inject({ method: 'GET', url: '/api/v1/goals?userId=user-01', headers });
    const deleted = await app.inject({ method: 'DELETE', url: `/api/v1/goals/${goal.id}`, headers });

    expect(updated.json().data).toMatchObject({ id: goal.id, current: 3, target: 12, status: 'ACTIVE' });
    expect(listed.json().data).toHaveLength(1);
    expect(deleted.json().data).toEqual({ id: goal.id, deleted: true });
  });

  it('lists video ideas, searches music, handles licensing restrictions, and caches genre recommendations', async () => {
    const app = await createApp();
    const [ideas, music, freeLicense, restrictedLicense] = await Promise.all([
      app.inject({ method: 'GET', url: '/api/v1/videos/ideas?genre=Technology', headers }),
      app.inject({ method: 'GET', url: '/api/v1/music/search?q=creator', headers }),
      app.inject({ method: 'POST', url: '/api/v1/music/track-sunrise/license', headers, payload: { commercialUse: true } }),
      app.inject({ method: 'POST', url: '/api/v1/music/track-cinematic/license', headers, payload: { commercialUse: true } }),
    ]);
    const firstGenres = await app.inject({
      method: 'GET',
      url: '/api/v1/genres/recommendations?channelId=channel-01',
      headers,
    });
    const secondGenres = await app.inject({
      method: 'GET',
      url: '/api/v1/genres/recommendations?channelId=channel-01',
      headers,
    });

    expect(ideas.json().data).toHaveLength(1);
    expect(music.json().data[0]).toMatchObject({ id: 'track-beat', title: 'Creator Beat' });
    expect(freeLicense.json().data).toMatchObject({ trackId: 'track-sunrise', licensed: true, license: 'ROYALTY_FREE' });
    expect(restrictedLicense.statusCode).toBe(403);
    expect(restrictedLicense.json().error.code).toBe('MUSIC_LICENSE_RESTRICTED');
    expect(firstGenres.json().data).toMatchObject({ channelId: 'channel-01', cacheHit: false });
    expect(secondGenres.json().data).toMatchObject({ channelId: 'channel-01', cacheHit: true });
    expect(secondGenres.json().data.generatedAt).toBe(firstGenres.json().data.generatedAt);
  });
});
