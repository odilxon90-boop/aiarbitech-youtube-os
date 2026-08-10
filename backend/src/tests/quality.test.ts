import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'quality:read' };

afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

async function createApp() {
  const app = await buildApp({ config, logger: new NoopLogger() });
  apps.push(app);
  return app;
}

describe('Quality Gate API', () => {
  it('protects quality endpoints with authentication and permission checks', async () => {
    const app = await createApp();
    expect((await app.inject({ method: 'GET', url: '/api/v1/quality/score/video-aurora' })).statusCode).toBe(401);
    expect(
      (await app.inject({
        method: 'GET',
        url: '/api/v1/quality/score/video-aurora',
        headers: { authorization: 'Bearer mock-token' },
      })).statusCode,
    ).toBe(403);
  });

  it('returns mock score, retention, readiness, and checklist data', async () => {
    const app = await createApp();
    const [score, retention, readiness, checklist] = await Promise.all([
      app.inject({ method: 'GET', url: '/api/v1/quality/score/video-aurora', headers }),
      app.inject({ method: 'GET', url: '/api/v1/quality/retention/video-aurora', headers }),
      app.inject({ method: 'GET', url: '/api/v1/quality/readiness/video-horizon', headers }),
      app.inject({ method: 'GET', url: '/api/v1/quality/checklist/video-draft', headers }),
    ]);

    expect(score.json().data).toMatchObject({ score: 91, videoId: 'video-aurora' });
    expect(retention.json().data).toMatchObject({ estimatedRetentionPercent: 68, confidencePercent: 89 });
    expect(retention.json().data.curve).toHaveLength(4);
    expect(readiness.json().data).toMatchObject({ status: 'REVIEW' });
    expect(checklist.json().data).toHaveLength(11);
    expect(checklist.json().data.filter((item: { status: string }) => item.status === 'FAIL')).toHaveLength(3);
  });

  it('returns 404 instead of unrelated quality data for an unknown video', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/quality/score/unknown-video', headers });

    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('VIDEO_NOT_FOUND');
  });
});
