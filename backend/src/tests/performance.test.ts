import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('performance middleware', () => {
  it('applies a short cache policy to cacheable static responses', async () => { const app = await createApp(); const response = await app.inject({ method: 'GET', url: '/api/v1/quality/score/video-aurora', headers: { authorization: 'Bearer mock', 'x-permissions': 'quality:read' } }); expect(response.headers['cache-control']).toContain('max-age=60'); });
});
