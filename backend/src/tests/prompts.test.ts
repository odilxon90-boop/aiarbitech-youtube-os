import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'prompts:access' }; const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
const payload = { name: 'Mock prompt', content: 'Write a mock outline.', model: 'gpt-4', temperature: 0.5, maxTokens: 512 };
describe('Prompt Registry API', () => {
  it('requires authentication and prompts:access', async () => { const app = await createApp(); expect((await app.inject({ method: 'GET', url: '/api/v1/prompts' })).statusCode).toBe(401); expect((await app.inject({ method: 'GET', url: '/api/v1/prompts', headers: { authorization: 'Bearer token' } })).statusCode).toBe(403); });
  it('lists prompt versions and performance', async () => { const app = await createApp(); const [list, performance] = await Promise.all([app.inject({ method: 'GET', url: '/api/v1/prompts', headers }), app.inject({ method: 'GET', url: '/api/v1/prompts/performance', headers })]); expect(list.json().data.length).toBeGreaterThanOrEqual(10); expect(list.json().data[0].versions).toHaveLength(3); expect(performance.json().data[0].performance).toHaveProperty('successRatePercent'); });
  it('supports mock prompt CRUD', async () => { const app = await createApp(); const created = await app.inject({ method: 'POST', url: '/api/v1/prompts', headers, payload }); const id = created.json().data.id; const updated = await app.inject({ method: 'PUT', url: `/api/v1/prompts/${id}`, headers, payload: { ...payload, name: 'Updated mock prompt' } }); const fetched = await app.inject({ method: 'GET', url: `/api/v1/prompts/${id}`, headers }); const deleted = await app.inject({ method: 'DELETE', url: `/api/v1/prompts/${id}`, headers }); expect(updated.json().data.versions).toHaveLength(2); expect(fetched.json().data.name).toBe('Updated mock prompt'); expect(deleted.json().data.deleted).toBe(true); });
});
