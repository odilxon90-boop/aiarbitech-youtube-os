import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'gateway:access' }; const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('Integration Gateway API', () => {
  it('requires authentication and gateway:access', async () => { const app = await createApp(); expect((await app.inject({ method: 'GET', url: '/api/v1/gateway/status' })).statusCode).toBe(401); expect((await app.inject({ method: 'GET', url: '/api/v1/gateway/status', headers: { authorization: 'Bearer token' } })).statusCode).toBe(403); });
  it('returns mock status, registry, logs, and health', async () => { const app = await createApp(); const status = await app.inject({ method: 'GET', url: '/api/v1/gateway/status', headers }); const endpoints = await app.inject({ method: 'GET', url: '/api/v1/gateway/endpoints', headers }); const logs = await app.inject({ method: 'GET', url: '/api/v1/gateway/logs', headers }); const health = await app.inject({ method: 'GET', url: '/api/v1/gateway/health', headers }); expect(status.json().data).toMatchObject({ status: 'ACTIVE', externalRequestPerformed: false }); expect(endpoints.json().data).toHaveLength(5); expect(logs.json().data).toHaveLength(50); expect(health.json().data).toHaveLength(5); });
  it('executes a mock call without network activity', async () => { const app = await createApp(); const call = await app.inject({ method: 'POST', url: '/api/v1/gateway/call/ai-core', headers }); expect(call.json().data).toMatchObject({ endpoint: 'ai-core', status: 'SUCCESS', circuitState: 'CLOSED' }); });
  it('retains only the latest 50 gateway logs', async () => {
    const app = await createApp();
    for (let index = 0; index < 10; index += 1) {
      expect((await app.inject({ method: 'POST', url: '/api/v1/gateway/call/ai-core', headers })).statusCode).toBe(200);
    }

    const logs = await app.inject({ method: 'GET', url: '/api/v1/gateway/logs', headers });
    expect(logs.json().data).toHaveLength(50);
  });
});
