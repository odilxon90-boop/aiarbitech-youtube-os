import { describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { getBoundaryRegistry, validateBoundaryRegistry } from '../platform/boundary-service.js';

describe('platform boundary registry', () => {
  it('validates dependency, ownership, API, event, and documentation evidence', async () => {
    const registry = await getBoundaryRegistry(); const validation = await validateBoundaryRegistry();
    expect(registry.platformOwnedDatabaseObjects).toEqual([expect.objectContaining({ name: 'platform_runtime_metadata', classification: 'PLATFORM_OWNED' })]);
    expect(registry.platformPublicApis.every((api) => api.method === 'GET')).toBe(true);
    expect(registry.platformPublicEvents).toEqual([]); expect(registry.externalProviders).toEqual([]); expect(registry.allowedNetworkDestinations).toEqual([]);
    expect(validation.valid).toBe(true); expect(validation.errors).toEqual([]); expect(validation.networkRequestPerformed).toBe(false);
  });
  it('exposes registry, summary, and validation as GET-only resources', async () => {
    const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os' });
    const app = await buildApp({ config, logger: new NoopLogger() });
    for (const path of ['/api/v1/platform/boundaries', '/api/v1/platform/boundaries/summary', '/api/v1/platform/boundaries/validation']) {
      expect((await app.inject({ method: 'GET', url: path })).statusCode).toBe(200);
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) expect((await app.inject({ method, url: path })).statusCode).toBe(404);
    }
    await app.close();
  });
});