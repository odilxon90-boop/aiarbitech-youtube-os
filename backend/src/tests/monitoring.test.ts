import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { MetricsCollector } from '../monitoring/metrics.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('Monitoring health checks', () => {
  it('reports root and health service status', async () => { const app = await createApp(); const root = await app.inject({ method: 'GET', url: '/' }); const health = await app.inject({ method: 'GET', url: '/health' }); const db = await app.inject({ method: 'GET', url: '/health/db' }); const gateway = await app.inject({ method: 'GET', url: '/health/gateway' }); expect(root.json().data).toMatchObject({ status: 'ok' }); expect(health.json()).toMatchObject({ status: 'ok' }); expect(db.json().data.connectivity).toBe('MOCK_CONNECTED'); expect(gateway.json().data.networkRequestPerformed).toBe(false); });
  it('aggregates dynamic request URLs and caps tracked endpoints', () => {
    const metrics = new MetricsCollector();
    for (let index = 0; index < 150; index += 1) metrics.record(`/dynamic/${index}`, 200, 1);

    expect(metrics.snapshot().endpoints).toHaveLength(100);
  });
});
