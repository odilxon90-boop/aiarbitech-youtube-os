import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../../app/server.js';
import { loadEnvironment } from '../../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
const fullHeaders = { authorization: 'Bearer integration-token', 'x-permissions': 'dashboard:access,ai:access,analytics:access' };
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('mock application integration journey', () => {
  it('returns health, dashboard, analytics, and an AI response', async () => { const app = await createApp(); const health = await app.inject({ method: 'GET', url: '/api/v1/health' }); const dashboard = await app.inject({ method: 'GET', url: '/api/v1/dashboard/summary', headers: fullHeaders }); const analytics = await app.inject({ method: 'GET', url: '/api/v1/analytics/overview', headers: fullHeaders }); const ai = await app.inject({ method: 'POST', url: '/api/v1/ai/chat/send', headers: fullHeaders, payload: { message: 'Plan a video' } }); expect(health.statusCode).toBe(200); expect(dashboard.json().data.creatorScore).toBe(72); expect(analytics.json().data.retentionPercent).toBe(68); expect(ai.json().data.message).toContain('Plan a video'); });
  it('validates AI messages and applies analytics filters', async () => {
    const app = await createApp();
    const emptyAiMessage = await app.inject({ method: 'POST', url: '/api/v1/ai/chat/send', headers: fullHeaders, payload: { message: '   ' } });
    const filteredAnalytics = await app.inject({ method: 'GET', url: '/api/v1/analytics/overview?range=week&channel=channel-2', headers: fullHeaders });
    expect(emptyAiMessage.statusCode).toBe(400);
    expect(filteredAnalytics.json().data).toMatchObject({ channel: 'channel-2', retentionPercent: 61, revenue: 280 });
  });
  it('rejects invalid authentication and missing permissions', async () => { const app = await createApp(); expect((await app.inject({ method: 'GET', url: '/api/v1/dashboard/summary', headers: { authorization: 'Token invalid' } })).statusCode).toBe(401); expect((await app.inject({ method: 'POST', url: '/api/v1/ai/chat/send', headers: { authorization: 'Bearer valid' }, payload: { message: 'hello' } })).statusCode).toBe(403); });
});
