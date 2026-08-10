import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { JwtService } from '../auth/jwt.service.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os', JWT_SECRET: 'test-jwt-secret-that-is-longer-than-thirty-two-characters' });
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));
it('protects and returns President Panel mock data', async () => {
  const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app);
  const token = new JwtService(config.JWT_SECRET!, '7d', '30d').sign({ id: 'president-01', email: 'president@example.com', role: 'President', permissions: ['president:access'] });
  expect((await app.inject({ method: 'GET', url: '/api/v1/president/dashboard' })).statusCode).toBe(401);
  const headers = { authorization: `Bearer ${token}` };
  const responses = await Promise.all(['/dashboard', '/health', '/revenue', '/channels', '/ai-status', '/risks'].map((path) => app.inject({ method: 'GET', url: `/api/v1/president${path}`, headers })));
  expect(responses[0]!.json().data).toMatchObject({ platformHealth: 'HEALTHY', activeChannels: 42 });
  expect(responses[1]!.json().data.length).toBeGreaterThanOrEqual(3); expect(responses[2]!.json().data.monthly).toBe(28450); expect(responses[3]!.json().data).toHaveLength(10); expect(responses[4]!.json().data).toHaveLength(5); expect(responses[5]!.json().data).toHaveLength(5);
});
