import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
const headers = { authorization: 'Bearer mock-admin', 'x-permissions': 'admin:access' };
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));
async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }

describe('Admin API', () => {
  it('requires authentication and admin:access permission', async () => {
    const app = await createApp();
    expect((await app.inject({ method: 'GET', url: '/api/v1/admin/users' })).statusCode).toBe(401);
    expect((await app.inject({ method: 'GET', url: '/api/v1/admin/users', headers: { authorization: 'Bearer token' } })).statusCode).toBe(403);
  });

  it('returns mock users, channels, audit logs, and health metrics', async () => {
    const app = await createApp();
    const [users, channels, auditLogs, health] = await Promise.all([
      app.inject({ method: 'GET', url: '/api/v1/admin/users', headers }),
      app.inject({ method: 'GET', url: '/api/v1/admin/channels', headers }),
      app.inject({ method: 'GET', url: '/api/v1/admin/audit-logs', headers }),
      app.inject({ method: 'GET', url: '/api/v1/admin/health', headers }),
    ]);
    expect(users.json().data).toHaveLength(10);
    expect(channels.json().data).toHaveLength(10);
    expect(auditLogs.json().data).toHaveLength(15);
    expect(health.json().data).toHaveLength(4);
  });

  it('updates mock user, channel, and AI configuration', async () => {
    const app = await createApp();
    const user = await app.inject({ method: 'PUT', url: '/api/v1/admin/users/user-01/status', headers, payload: { status: 'SUSPENDED' } });
    const channel = await app.inject({ method: 'PUT', url: '/api/v1/admin/channels/channel-02/moderate', headers, payload: { status: 'APPROVED' } });
    const aiConfig = await app.inject({
      method: 'PUT', url: '/api/v1/admin/ai-config', headers,
      payload: { model: 'mock-v2', temperature: 0.4, maxTokens: 1024, dailyVideoLimit: 5 },
    });
    expect(user.json().data.status).toBe('SUSPENDED');
    expect(channel.json().data.status).toBe('APPROVED');
    expect(aiConfig.json().data).toMatchObject({ model: 'mock-v2', maxTokens: 1024 });
  });
});
