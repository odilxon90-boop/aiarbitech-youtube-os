import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { JwtService } from '../auth/jwt.service.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://localhost:5432/youtube_os',
  JWT_SECRET: 'test-jwt-secret-that-is-longer-than-thirty-two-characters',
});
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

async function createApp() {
  const app = await buildApp({ config, logger: new NoopLogger() });
  apps.push(app);
  return app;
}

describe('JWT authentication', () => {
  it('logs in, verifies an HS256 token, refreshes it, and revokes it on logout', async () => {
    const app = await createApp();
    const login = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'admin@youtubeos.local', password: 'ChangeMeAdminPassword!' },
    });
    const { token, refreshToken, user } = login.json().data;

    expect(login.statusCode).toBe(200);
    expect(new JwtService(config.JWT_SECRET!, config.JWT_EXPIRES_IN, config.JWT_REFRESH_EXPIRES_IN).verify(token)).toMatchObject({
      sub: user.id,
      tokenUse: 'access',
    });
    expect((await app.inject({
      method: 'GET',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${token}` },
    })).statusCode).toBe(200);
    expect((await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    })).statusCode).toBe(200);
    expect((await app.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
      headers: { authorization: `Bearer ${token}` },
    })).statusCode).toBe(200);
    expect((await app.inject({
      method: 'GET',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${token}` },
    })).statusCode).toBe(401);
  });

  it('rejects invalid tokens and denies permissions not present in JWT claims', async () => {
    const app = await createApp();
    const jwt = new JwtService(config.JWT_SECRET!, config.JWT_EXPIRES_IN, config.JWT_REFRESH_EXPIRES_IN);
    const creatorToken = jwt.sign({
      id: 'user-creator-01',
      email: 'creator@youtubeos.local',
      role: 'Creator',
      permissions: ['quality:read'],
    });

    expect((await app.inject({
      method: 'GET',
      url: '/api/v1/quality/score/video-aurora',
      headers: { authorization: `Bearer ${creatorToken}` },
    })).statusCode).toBe(200);
    expect((await app.inject({
      method: 'GET',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${creatorToken}` },
    })).statusCode).toBe(403);
    expect((await app.inject({
      method: 'GET',
      url: '/api/v1/admin/users',
      headers: { authorization: 'Bearer not-a-jwt' },
    })).statusCode).toBe(401);
  });
});
