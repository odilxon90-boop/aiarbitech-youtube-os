import { beforeEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { resetGoalsStore } from '../goals/goals-service.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});

const creatorAuth = { Authorization: 'Bearer mock-creator-token' };
const adminAuth = { Authorization: 'Bearer mock-admin-token' };
const viewerAuth = { Authorization: 'Bearer mock-viewer-token' };

describe('goals API endpoints', () => {
  beforeEach(() => resetGoalsStore());

  it('rejects access without a bearer token (401)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/goals/list' });
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
    await app.close();
  });

  it('forbids access when goals:read is missing (403)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/goals/list', headers: viewerAuth });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('FORBIDDEN');
    await app.close();
  });

  it('returns the four seeded goals with the full goal model', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/goals/list', headers: creatorAuth });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.meta.correlationId).toBeTruthy();
    expect(body.data).toHaveLength(4);
    for (const goal of body.data) {
      expect(goal).toHaveProperty('id');
      expect(goal).toHaveProperty('title');
      expect(goal).toHaveProperty('target');
      expect(goal).toHaveProperty('current');
      expect(goal).toHaveProperty('deadline');
      expect(['ON_TRACK', 'AT_RISK', 'BEHIND', 'ACHIEVED', 'PAUSED']).toContain(goal.status);
      expect(goal.createdAt).toBeTruthy();
      expect(goal.updatedAt).toBeTruthy();
    }
    await app.close();
  });

  it('creates a new goal via POST', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/goals/create',
      headers: creatorAuth,
      payload: { type: 'subscribers', title: 'Reach 2,500 subscribers', target: 2500, deadline: '2026-12-31' },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.title).toBe('Reach 2,500 subscribers');
    expect(body.data.target).toBe(2500);
    expect(body.data.current).toBe(0);
    expect(body.data.type).toBe('subscribers');
    expect(body.data.id).toBeTruthy();
    const listed = await app.inject({ method: 'GET', url: '/api/v1/goals/list', headers: creatorAuth });
    expect(listed.json().data).toHaveLength(5);
    await app.close();
  });
  it('rejects a create request missing required fields (400)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/goals/create',
      headers: adminAuth,
      payload: { title: 'No target' },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('BAD_REQUEST');
    await app.close();
  });

  it('updates progress and transitions a goal to ACHIEVED', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const list = await app.inject({ method: 'GET', url: '/api/v1/goals/list', headers: creatorAuth });
    const goalId = list.json().data[0].id;
    const response = await app.inject({
      method: 'PUT',
      url: `/api/v1/goals/${goalId}/progress`,
      headers: creatorAuth,
      payload: { current: 999999 },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.status).toBe('ACHIEVED');
    await app.close();
  });

  it('returns 404 when updating progress on a missing goal', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/goals/goal-missing/progress',
      headers: creatorAuth,
      payload: { current: 5 },
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
    await app.close();
  });

  it('deletes a goal', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const list = await app.inject({ method: 'GET', url: '/api/v1/goals/list', headers: creatorAuth });
    const goalId = list.json().data[0].id;
    const response = await app.inject({ method: 'DELETE', url: `/api/v1/goals/${goalId}`, headers: creatorAuth });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.deleted).toBe(true);
    const after = await app.inject({ method: 'GET', url: '/api/v1/goals/list', headers: creatorAuth });
    expect(after.json().data).toHaveLength(3);
    await app.close();
  });

  it('returns recommendations covering all four AI categories', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({ method: 'GET', url: '/api/v1/goals/recommendations', headers: creatorAuth });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.goals.length).toBe(4);
    expect(body.data.recommendations.length).toBeGreaterThanOrEqual(12);
    const categories = new Set(body.data.recommendations.map((r: { category: string }) => r.category));
    expect(categories.has('STEPS')).toBe(true);
    expect(categories.has('CONTENT_STRATEGY')).toBe(true);
    expect(categories.has('PUBLISHING_FREQUENCY')).toBe(true);
    expect(categories.has('SEO')).toBe(true);
    await app.close();
  });

  it('writes are forbidden for tokens with only goals:read (403)', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/goals/create',
      headers: viewerAuth,
      payload: { type: 'subscribers', title: 'x', target: 1, deadline: '2026-12-31' },
    });
    expect(response.statusCode).toBe(403);
    await app.close();
  });
});

