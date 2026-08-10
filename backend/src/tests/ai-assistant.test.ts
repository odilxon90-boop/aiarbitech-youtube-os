import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { AssistantService } from '../ai-assistant/assistant-service.js';
import { requirePermission, resolvePrincipal } from '../shared/auth.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});

const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

async function createApp() {
  const app = await buildApp({ config, logger: new NoopLogger() });
  apps.push(app);
  return app;
}

const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('AI assistant API endpoints', () => {
  it('rejects chat send without a token (401)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      payload: { prompt: 'hello' },
    });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });

  it('forbids chat access when the permission is missing (403)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: { Authorization: 'Bearer mock-viewer-token' },
      payload: { prompt: 'hello' },
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
  });

  it('rejects an invalid chat payload (400)', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: {},
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('VALIDATION_ERROR');
  });

  it('sends a message and returns a new session with user + assistant messages', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'What should I publish next?' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json().data;
    expect(body.newSession).toBe(true);
    expect(body.session.id).toBeTruthy();
    expect(body.session.messages.length).toBe(2);
    expect(body.session.messages[0].role).toBe('user');
    expect(body.session.messages[1].role).toBe('assistant');
    expect(['text', 'recommendations', 'actions']).toContain(body.reply.type);
  });

  it('continues an existing session when a sessionId is supplied', async () => {
    const app = await createApp();
    const first = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'hello' },
    });
    const sessionId = first.json().data.session.id;
    const second = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'hello again', sessionId },
    });
    expect(second.statusCode).toBe(200);
    expect(second.json().data.newSession).toBe(false);
    expect(second.json().data.session.id).toBe(sessionId);
    expect(second.json().data.session.messages.length).toBe(4);
  });

  it('lists chat history for an authorized creator', async () => {
    const app = await createApp();
    await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'recommend something' },
    });
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai/chat/history',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.sessions.length).toBeGreaterThan(0);
    expect(response.json().data.sessions[0].messages.length).toBeGreaterThan(0);
  });
it('returns a single session by id', async () => {
    const app = await createApp();
    const created = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'do something' },
    });
    const sessionId = created.json().data.session.id;
    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/ai/chat/${sessionId}`,
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.session.id).toBe(sessionId);
  });

  it('returns 404 for an unknown or foreign session id', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai/chat/does-not-exist',
      headers: creatorAuth,
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('SESSION_NOT_FOUND');
  });

  it('simulates a 500 AI service error for prompts containing fail', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'please fail now' },
    });
    expect(response.statusCode).toBe(500);
    expect(response.json().error.code).toBe('AI_SERVICE_ERROR');
  });

  it('simulates a timeout error for prompts containing timeout', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/chat/send',
      headers: creatorAuth,
      payload: { prompt: 'timeout please' },
    });
    expect(response.statusCode).toBe(504);
    expect(response.json().error.code).toBe('AI_TIMEOUT');
  });
});

describe('AI assistant session management and permissions', () => {
  it('isolates sessions per user', async () => {
    const service = new AssistantService({ fixedDelayMs: 1 });
    const first = await service.sendMessage('creator-1', 'hello');
    const foreign = await service.sendMessage('creator-2', 'world');
    expect(service.listSessions('creator-1')).toHaveLength(1);
    expect(service.listSessions('creator-2')).toHaveLength(1);
    expect(() => service.getSession('creator-2', first.session.id)).toThrowError(
      /not found/i,
    );
    expect(service.getSession('creator-1', first.session.id).id).toBe(first.session.id);
    expect(service.getSession('creator-2', foreign.session.id).id).toBe(foreign.session.id);
  });

  it('requires the ai:chat permission on grant and denies without it', () => {
    expect(resolvePrincipal('mock-creator-token')?.permissions).toContain('ai:chat');
    expect(resolvePrincipal('mock-viewer-token')?.permissions).not.toContain('ai:chat');
    expect(() => {
      requirePermission(
        { headers: { authorization: 'Bearer mock-viewer-token' } } as never,
        'ai:chat',
      );
    }).toThrowError(/insufficient permissions/i);
  });
});