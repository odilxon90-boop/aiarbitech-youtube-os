import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

<<<<<<< HEAD
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

const aiSyncAuth = { Authorization: 'Bearer mock-ai-sync-token' };

describe('ai-sync API endpoints', () => {
  it('rejects access without a bearer token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/ai-sync/status' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids access when ai-sync:access is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai-sync/status',
      headers: { Authorization: 'Bearer mock-creator-token' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('returns sync status', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai-sync/status',
      headers: aiSyncAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.status).toBe('ACTIVE');
    expect(body.data.localVersion).toBeTruthy();
    expect(body.data.globalVersion).toBeTruthy();
    expect(body.meta.correlationId).toBeTruthy();
  });

  it('returns sync history', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai-sync/history',
      headers: aiSyncAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.history.length).toBeGreaterThanOrEqual(20);
  });

  it('returns force sync result', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai-sync/force-sync',
      headers: aiSyncAuth,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data).toMatchObject({ success: expect.any(Boolean), changesApplied: expect.any(Number), message: expect.any(String) });
  });

  it('returns conflicts', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai-sync/conflicts',
      headers: aiSyncAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.conflicts.length).toBeGreaterThanOrEqual(5);
  });

  it('resolves a conflict', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai-sync/resolve/c-1',
      headers: aiSyncAuth,
      payload: { resolution: 'GLOBAL' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.resolution).toBe('GLOBAL');
  });

  it('returns model versions', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai-sync/models',
      headers: aiSyncAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.models.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects invalid resolution body (400)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai-sync/resolve/c-1',
      headers: aiSyncAuth,
      payload: { resolution: 'INVALID' },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('BAD_REQUEST');
=======
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'ai-sync:access' };
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));
async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }

describe('AI Sync API', () => {
  it('requires authentication and ai-sync:access', async () => {
    const app = await createApp();
    expect((await app.inject({ method: 'GET', url: '/api/v1/ai-sync/status' })).statusCode).toBe(401);
    expect((await app.inject({ method: 'GET', url: '/api/v1/ai-sync/status', headers: { authorization: 'Bearer mock' } })).statusCode).toBe(403);
  });
  it('returns mock status, history, conflicts, and models', async () => {
    const app = await createApp();
    const [status, history, conflicts, models] = await Promise.all([
      app.inject({ method: 'GET', url: '/api/v1/ai-sync/status', headers }),
      app.inject({ method: 'GET', url: '/api/v1/ai-sync/history', headers }),
      app.inject({ method: 'GET', url: '/api/v1/ai-sync/conflicts', headers }),
      app.inject({ method: 'GET', url: '/api/v1/ai-sync/models', headers }),
    ]);
    expect(status.json().data.status).toBe('ACTIVE');
    expect(history.json().data).toHaveLength(20);
    expect(conflicts.json().data).toHaveLength(5);
    expect(models.json().data).toHaveLength(3);
  });
  it('performs mock force sync and resolves a conflict', async () => {
    const app = await createApp();
    const sync = await app.inject({ method: 'POST', url: '/api/v1/ai-sync/force-sync', headers });
    const conflict = await app.inject({ method: 'POST', url: '/api/v1/ai-sync/resolve/conflict-01', headers, payload: { resolution: 'ACCEPT_GLOBAL' } });
    expect(sync.json().data).toMatchObject({ status: 'SUCCESS' });
    expect(conflict.json().data.resolution).toBe('ACCEPT_GLOBAL');
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
  });
});
