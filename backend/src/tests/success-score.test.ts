import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'success:access' }; const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('Success Score API', () => {
  it('requires authentication and success:access', async () => { const app = await createApp(); expect((await app.inject({ method: 'GET', url: '/api/v1/success-score/current' })).statusCode).toBe(401); expect((await app.inject({ method: 'GET', url: '/api/v1/success-score/current', headers: { authorization: 'Bearer token' } })).statusCode).toBe(403); });
  it('returns current score, categories, history, and improvements', async () => { const app = await createApp(); const current = await app.inject({ method: 'GET', url: '/api/v1/success-score/current', headers }); const breakdown = await app.inject({ method: 'GET', url: '/api/v1/success-score/breakdown', headers }); const history = await app.inject({ method: 'GET', url: '/api/v1/success-score/history', headers }); const improvements = await app.inject({ method: 'GET', url: '/api/v1/success-score/improvements', headers }); expect(current.json().data.overallScore).toBe(72); expect(breakdown.json().data).toHaveLength(7); expect(history.json().data).toHaveLength(30); expect(improvements.json().data.length).toBeGreaterThanOrEqual(5); });
});
