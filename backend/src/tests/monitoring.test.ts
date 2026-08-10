import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { MetricsCollector } from '../monitoring/metrics.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('Monitoring health checks', () => {
  it('reports service, database, gateway, and request metrics', async () => { const app = await createApp(); await app.inject({ method: 'GET', url: '/api/v1/health/live' }); const health = await app.inject({ method: 'GET', url: '/health' }); const db = await app.inject({ method: 'GET', url: '/health/db' }); const gateway = await app.inject({ method: 'GET', url: '/health/gateway' }); expect(health.json().data).toMatchObject({ status: 'UP', version: '0.1.0' }); expect(health.json().data.metrics.totalRequests).toBeGreaterThanOrEqual(1); expect(db.json().data.connectivity).toBe('MOCK_CONNECTED'); expect(gateway.json().data.networkRequestPerformed).toBe(false); });
  it('aggregates dynamic request URLs and caps tracked endpoints', () => {
    const metrics = new MetricsCollector();
    for (let index = 0; index < 150; index += 1) metrics.record(`/dynamic/${index}`, 200, 1);

    expect(metrics.snapshot().endpoints).toHaveLength(100);
  });
});
