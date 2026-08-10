import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';

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

const adminAuth = { Authorization: 'Bearer mock-admin-token' };
const creatorAuth = { Authorization: 'Bearer mock-creator-token' };

describe('admin API — auth guards', () => {
  const getEndpoints = [
    '/api/v1/admin/users',
    '/api/v1/admin/channels',
    '/api/v1/admin/ai-config',
    '/api/v1/admin/audit-logs',
    '/api/v1/admin/health',
  ];

  for (const url of getEndpoints) {
    it(`rejects unauthenticated request to ${url} (401)`, async () => {
      const app = await createApp();
      const response = await app.inject({ method: 'GET', url });
      expect(response.statusCode).toBe(401);
      expect(response.json().error.code).toBe('UNAUTHORIZED');
    });

    it(`rejects creator token on ${url} (403)`, async () => {
      const app = await createApp();
      const response = await app.inject({ method: 'GET', url, headers: creatorAuth });
      expect(response.statusCode).toBe(403);
      expect(response.json().error.code).toBe('FORBIDDEN');
    });
  }
});

describe('admin API — users', () => {
  it('lists 10+ users for admin', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/admin/users', headers: adminAuth });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.count).toBeGreaterThanOrEqual(10);
    expect(data.users.length).toBe(data.count);
    for (const user of data.users) {
      expect(user.id).toBeTruthy();
      expect(user.name).toBeTruthy();
      expect(user.email).toBeTruthy();
      expect(['CREATOR', 'ADMIN', 'VIEWER']).toContain(user.role);
      expect(['ACTIVE', 'SUSPENDED', 'PENDING']).toContain(user.status);
    }
    expect(response.json().meta.correlationId).toBeTruthy();
  });

  it('updates user status and returns updated record', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/users/usr-1/status',
      headers: adminAuth,
      payload: { status: 'SUSPENDED' },
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.id).toBe('usr-1');
    expect(data.status).toBe('SUSPENDED');
    expect(data.updatedAt).toBeTruthy();
  });

  it('returns 404 for unknown user id', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/users/usr-unknown/status',
      headers: adminAuth,
      payload: { status: 'ACTIVE' },
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });
});

describe('admin API — channels', () => {
  it('lists 10+ channels for admin', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/admin/channels', headers: adminAuth });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.count).toBeGreaterThanOrEqual(10);
    for (const channel of data.channels) {
      expect(channel.id).toBeTruthy();
      expect(channel.title).toBeTruthy();
      expect(['APPROVED', 'UNDER_REVIEW', 'SUSPENDED', 'FLAGGED']).toContain(channel.moderationStatus);
    }
  });

  it('moderates a channel and returns result', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/channels/chn-4/moderate',
      headers: adminAuth,
      payload: { status: 'APPROVED', note: 'Issue resolved after review.' },
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.id).toBe('chn-4');
    expect(data.moderationStatus).toBe('APPROVED');
    expect(data.note).toBeTruthy();
  });

  it('returns 404 for unknown channel id', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/channels/chn-unknown/moderate',
      headers: adminAuth,
      payload: { status: 'SUSPENDED', note: 'Test.' },
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
  });
});

describe('admin API — AI config', () => {
  it('returns AI config', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/admin/ai-config', headers: adminAuth });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.model).toBeTruthy();
    expect(typeof data.temperature).toBe('number');
    expect(typeof data.maxTokens).toBe('number');
    expect(typeof data.enabled).toBe('boolean');
  });

  it('updates AI config and returns updated config', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/admin/ai-config',
      headers: adminAuth,
      payload: { temperature: 0.5, maxTokens: 1024 },
    });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.temperature).toBe(0.5);
    expect(data.maxTokens).toBe(1024);
    expect(data.updatedAt).toBeTruthy();
  });
});

describe('admin API — audit logs', () => {
  it('returns 15+ audit log entries', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/admin/audit-logs', headers: adminAuth });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(data.count).toBeGreaterThanOrEqual(15);
    expect(data.entries.length).toBe(data.count);
    for (const entry of data.entries) {
      expect(entry.id).toBeTruthy();
      expect(entry.actor).toBeTruthy();
      expect(entry.action).toBeTruthy();
      expect(['SUCCESS', 'FAILURE']).toContain(entry.outcome);
    }
  });
});

describe('admin API — health', () => {
  it('returns health metrics for 4+ services', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/admin/health', headers: adminAuth });
    expect(response.statusCode).toBe(200);
    const { data } = response.json();
    expect(['OK', 'DEGRADED', 'DOWN']).toContain(data.overall);
    expect(data.metrics.length).toBeGreaterThanOrEqual(4);
    for (const metric of data.metrics) {
      expect(metric.service).toBeTruthy();
      expect(['OK', 'DEGRADED', 'DOWN']).toContain(metric.status);
      expect(typeof metric.latencyMs).toBe('number');
    }
  });
});
