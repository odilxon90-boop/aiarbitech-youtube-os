import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { clearRateLimitStore } from '../middleware/rate-limit.middleware.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});

const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
  clearRateLimitStore();
});

async function createApp(enableThrottle = false) {
  const app = await buildApp({ config, logger: new NoopLogger(), enableThrottle });
  apps.push(app);
  return app;
}

const authHeaders = { Authorization: 'Bearer mock-creator-token' };

describe('Rate Limiting', () => {
  it('returns 429 when public endpoint rate limit is exceeded', async () => {
    const app = await createApp();
    
    // Public endpoints have 100 requests/min limit
    for (let i = 0; i < 100; i++) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/platform/manifest',
      });
      if (i < 100) {
        expect(response.statusCode).toBe(200);
      }
    }
    
    // 101st request should be rate limited
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/platform/manifest',
    });
    expect(response.statusCode).toBe(429);
    expect(response.json().error.code).toBe('RATE_LIMITED');
    expect(response.headers['retry-after']).toBeTruthy();
    expect(response.headers['x-ratelimit-limit']).toBeTruthy();
    expect(response.headers['x-ratelimit-remaining']).toBe('0');
  });

  it('returns 429 when AI endpoint rate limit is exceeded', async () => {
    const app = await createApp();
    
    // AI endpoints have 20 requests/min limit
    for (let i = 0; i < 20; i++) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/assistant/chat',
        headers: authHeaders,
        payload: { message: 'test' },
      });
      if (i < 20) {
        expect(response.statusCode).not.toBe(429);
      }
    }
    
    // 21st request should be rate limited
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/assistant/chat',
      headers: authHeaders,
      payload: { message: 'test' },
    });
    expect(response.statusCode).toBe(429);
    expect(response.json().error.code).toBe('RATE_LIMITED');
  });

  it('returns 429 when authenticated endpoint rate limit is exceeded', async () => {
    const app = await createApp();
    
    // Authenticated endpoints have 50 requests/min limit
    for (let i = 0; i < 50; i++) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/dashboard/summary',
        headers: authHeaders,
      });
      if (i < 50) {
        expect(response.statusCode).toBe(200);
      }
    }
    
    // 51st request should be rate limited
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/summary',
      headers: authHeaders,
    });
    expect(response.statusCode).toBe(429);
    expect(response.json().error.code).toBe('RATE_LIMITED');
  });

  it('returns different rate limit headers for different endpoint types', async () => {
    const app = await createApp();
    
    // Check public endpoint headers
    const publicResponse = await app.inject({
      method: 'GET',
      url: '/api/v1/platform/manifest',
    });
    expect(publicResponse.headers['x-ratelimit-limit']).toBe('100');
    
    // Check authenticated endpoint headers
    const authResponse = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/summary',
      headers: authHeaders,
    });
    expect(authResponse.headers['x-ratelimit-limit']).toBe('50');
    
    // Check AI endpoint headers
    const aiResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/assistant/chat',
      headers: authHeaders,
      payload: { message: 'test' },
    });
    expect(aiResponse.headers['x-ratelimit-limit']).toBe('20');
  });

  it('includes rate limit headers in successful responses', async () => {
    const app = await createApp();
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/platform/manifest',
    });
    
    expect(response.statusCode).toBe(200);
    expect(response.headers['x-ratelimit-limit']).toBeTruthy();
    expect(response.headers['x-ratelimit-remaining']).toBeTruthy();
    expect(response.headers['x-ratelimit-reset']).toBeTruthy();
  });

  it('applies admin endpoint rate limit', async () => {
    const app = await createApp();
    
    const adminHeaders = { Authorization: 'Bearer mock-admin-token' };
    
    // Admin endpoints have 100 requests/min limit
    for (let i = 0; i < 100; i++) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/admin/dashboard',
        headers: adminHeaders,
      });
      if (i < 100) {
        expect(response.statusCode).not.toBe(429);
      }
    }
    
    // 101st request should be rate limited
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/dashboard',
      headers: adminHeaders,
    });
    expect(response.statusCode).toBe(429);
  });
});

describe('Throttling', () => {
  it('applies throttle limits with token bucket algorithm', async () => {
    const app = await createApp(true);
    
    // Send rapid requests to trigger throttle
    const responses = [];
    for (let i = 0; i < 25; i++) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/platform/manifest',
      });
      responses.push(response);
    }
    
    // Some requests should be throttled
    const throttledCount = responses.filter(r => r.statusCode === 429).length;
    expect(throttledCount).toBeGreaterThan(0);
    
    // Check throttle headers
    const throttledResponse = responses.find(r => r.statusCode === 429);
    if (throttledResponse) {
      expect(throttledResponse.headers['retry-after']).toBeTruthy();
      expect(throttledResponse.headers['x-throttle-limit']).toBeTruthy();
    }
  });

  it('applies stricter throttle for sensitive endpoints', async () => {
    const app = await createApp(true);
    
    const adminHeaders = { Authorization: 'Bearer mock-admin-token' };
    
    // Admin endpoints have stricter throttle (5 burst, 0.5/sec refill)
    const responses = [];
    for (let i = 0; i < 10; i++) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/admin/dashboard',
        headers: adminHeaders,
      });
      responses.push(response);
    }
    
    // Should hit throttle sooner due to stricter limits
    const throttledCount = responses.filter(r => r.statusCode === 429).length;
    expect(throttledCount).toBeGreaterThan(0);
  });
});

