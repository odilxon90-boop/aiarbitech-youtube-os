import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'workflow:access' };
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));
async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
describe('Workflow API', () => {
  it('requires authentication and workflow:access', async () => { const app = await createApp(); expect((await app.inject({ method: 'GET', url: '/api/v1/workflow/history' })).statusCode).toBe(401); expect((await app.inject({ method: 'GET', url: '/api/v1/workflow/history', headers: { authorization: 'Bearer mock' } })).statusCode).toBe(403); });
  it('starts and tracks mock workflows', async () => { const app = await createApp(); const start = await app.inject({ method: 'POST', url: '/api/v1/workflow/start', headers, payload: { userId: 'user-01', title: 'Mock launch' } }); const workflow = start.json().data; const status = await app.inject({ method: 'GET', url: `/api/v1/workflow/status/${workflow.id}`, headers }); expect(workflow).toMatchObject({ status: 'RUNNING', progress: 0 }); expect(status.json().data.stages).toHaveLength(7); });
  it('pauses, resumes, cancels, and returns history', async () => { const app = await createApp(); const pause = await app.inject({ method: 'POST', url: '/api/v1/workflow/pause/workflow-01', headers }); const resume = await app.inject({ method: 'POST', url: '/api/v1/workflow/resume/workflow-01', headers }); const cancel = await app.inject({ method: 'POST', url: '/api/v1/workflow/cancel/workflow-01', headers }); const history = await app.inject({ method: 'GET', url: '/api/v1/workflow/history', headers }); expect(pause.json().data.status).toBe('PAUSED'); expect(resume.json().data.status).toBe('RUNNING'); expect(cancel.json().data.status).toBe('CANCELLED'); expect(history.json().data.length).toBeGreaterThanOrEqual(10); });
  it('rejects invalid workflow input and terminal-state transitions', async () => {
    const app = await createApp();
    const invalidStart = await app.inject({ method: 'POST', url: '/api/v1/workflow/start', headers, payload: { userId: '', title: '' } });
    const invalidTransition = await app.inject({ method: 'POST', url: '/api/v1/workflow/resume/workflow-03', headers });

    expect(invalidStart.statusCode).toBe(400);
    expect(invalidTransition.statusCode).toBe(409);
    expect(invalidTransition.json().error.code).toBe('INVALID_WORKFLOW_TRANSITION');
  });
});
