import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { getArchitectureCompliance, getFoundationCompletion, getPlatformHealthManifest, getReadiness, getRepositoryHealth } from '../platform/health-service.js';

describe('platform capability health and readiness', () => {
  it('derives every health model from local repository evidence', async () => {
    const [manifest, compliance, repository, foundation, readiness] = await Promise.all([
      getPlatformHealthManifest(), getArchitectureCompliance(), getRepositoryHealth(), getFoundationCompletion(), getReadiness(),
    ]);
    expect(compliance).toMatchObject({ value: 100, status: 'VALID', passed: 10, total: 10 });
    expect(repository.status).toBe('VALID');
    expect(foundation.status).toBe('VALID');
    expect(readiness.readinessStatus).toBe('BLOCKED');
    expect(readiness.blockingItems).toContain('AUTHORITATIVE_CONTRACTS_AVAILABLE');
    expect(manifest).toMatchObject({ currentSprint: 'AAT-YTOS-SPRINT-0.0.3', validationStatus: 'VALID', networkRequestPerformed: false });
    expect(Date.parse(manifest.lastValidationTimestamp)).not.toBeNaN();
  });
});

describe('platform health API', () => {
  const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os' });
  const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
  afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

  it('exposes all health resources through GET only', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    apps.push(app);
    const routes = ['/api/v1/platform/health-manifest', '/api/v1/platform/health/summary', '/api/v1/platform/health/readiness', '/api/v1/platform/health/architecture-compliance'];
    for (const url of routes) {
      expect((await app.inject({ method: 'GET', url })).statusCode, url).toBe(200);
      for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
        expect((await app.inject({ method, url, payload: {} })).statusCode, `${method} ${url}`).toBe(404);
      }
    }
  });
});