import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

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
  });
});
