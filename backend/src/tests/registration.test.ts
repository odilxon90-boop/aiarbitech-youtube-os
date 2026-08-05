import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import type { RegistrationMetadata } from '../registration/model.js';
import { evaluateRegistrationReadiness } from '../registration/registration-service.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

const metadata: RegistrationMetadata = {
  platformId: 'PLATFORM_YOUTUBE_OS',
  platformName: 'AIArbiTech YouTube OS',
  platformVersion: '0.1.0',
  currentGate: 'GATE_0B',
  currentSprint: 'AAT-YTOS-SPRINT0.0.1',
  currentPhase: 'Sprint 0.0.1',
  compatibilityStatus: 'NOT_VERIFIED',
  registrationMode: 'LOCAL_ONLY',
  evidence: { status: 'VERIFIED', confidence: 'HIGH', origin: ['local-test-evidence'] },
};

describe('platform registration model', () => {
  it('blocks readiness when verified local evidence contains unknown dependencies', () => {
    expect(evaluateRegistrationReadiness(metadata, 'NOT_ASSIGNED', 'NOT_ASSIGNED')).toMatchObject({
      ready: false,
      status: 'BLOCKED',
      blockingItems: [
        'GLOBAL_ECOSYSTEM_COMPATIBILITY_NOT_VERIFIED',
        'ENTERPRISE_REGISTRATION_ID_NOT_VERIFIED',
        'SERVICE_REGISTRY_ID_NOT_VERIFIED',
      ],
    });
  });
});

describe('platform registration API', () => {
  it('exposes a local-only, evidence-backed registration summary', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    apps.push(app);
    const response = await app.inject({ method: 'GET', url: '/api/v1/platform/registration' });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({
      status: 'BLOCKED',
      readiness: { ready: false, status: 'BLOCKED' },
      metadata: {
        platformId: 'PLATFORM_YOUTUBE_OS',
        platformName: 'AIArbiTech YouTube OS',
        platformVersion: '0.1.0',
        currentGate: 'GATE_0B',
        currentSprint: 'AAT-YTOS-SPRINT0.0.1',
        currentPhase: 'Sprint 0.0.1',
        compatibilityStatus: 'NOT_VERIFIED',
        registrationMode: 'LOCAL_ONLY',
      },
    });
  });

  it('provides GET-only status, readiness, and metadata endpoints', async () => {
    const app = await buildApp({ config, logger: new NoopLogger() });
    apps.push(app);
    const paths = [
      '/api/v1/platform/registration/status',
      '/api/v1/platform/registration/readiness',
      '/api/v1/platform/registration/metadata',
    ];

    for (const url of paths) {
      expect((await app.inject({ method: 'GET', url })).statusCode, url).toBe(200);
      expect((await app.inject({ method: 'POST', url, payload: {} })).statusCode, url).toBe(404);
      expect((await app.inject({ method: 'PUT', url, payload: {} })).statusCode, url).toBe(404);
      expect((await app.inject({ method: 'PATCH', url, payload: {} })).statusCode, url).toBe(404);
      expect((await app.inject({ method: 'DELETE', url })).statusCode, url).toBe(404);
    }
  });
});