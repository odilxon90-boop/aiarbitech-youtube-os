import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { EnvironmentConfig } from '../config/environment.js';
import { isGlobalEcosystemConfigured } from '../config/environment.js';
import { successResponse } from '../contracts/api.js';
import type { GlobalEcosystemApiClient } from '../integrations/global-ecosystem/contracts.js';
import { createRequestMetadata } from '../integrations/global-ecosystem/mock-adapter.js';
import { getCapabilityById, getCapabilityRegistry, getCapabilitySummary, getCapabilityValidationResult } from './capability-service.js';
import { getBoundaryRegistry, getBoundarySummary, validateBoundaryRegistry } from './boundary-service.js';
import { discoverContractCompatibility } from './contract-discovery.js';
import { getApiContractRegistry, getApiVersionMatrix, getContractRegistrySummary, getEventContractRegistry, validateContractRegistries } from './contract-registry-service.js';
import { loadGovernanceArtifact } from './governance-loader.js';
import { getArchitectureCompliance, getHealthSummary, getPlatformHealthManifest, getReadiness } from './health-service.js';
import { loadPlatformManifest } from './manifest.js';

function expose(app: FastifyInstance, path: string, name: Parameters<typeof loadGovernanceArtifact>[0]): void {
  app.get(path, async (request: FastifyRequest) => successResponse(await loadGovernanceArtifact(name), request.correlationId));
}
export function registerPlatformRoutes(app: FastifyInstance, config: EnvironmentConfig, globalEcosystemClient: GlobalEcosystemApiClient): void {
  app.get('/api/v1/platform/manifest', async (request) => successResponse(await loadPlatformManifest(), request.correlationId));
  app.get('/api/v1/platform/compatibility', async (request) => {
    const manifest = await loadPlatformManifest(); const metadata = createRequestMetadata(config, request.correlationId);
    const compatibility = await globalEcosystemClient.checkCompatibility(metadata);
    return successResponse({ platformId: manifest.platformId, contractVersion: 'v1', integrationConfigured: isGlobalEcosystemConfigured(config), networkRequestPerformed: false, status: compatibility.ok ? compatibility.value.status : compatibility.error.code, capabilities: manifest.globalEcosystemCompatibility.capabilities, checkedAt: new Date().toISOString() }, request.correlationId);
  });
  expose(app, '/api/v1/platform/passport', 'passport');
  app.get('/api/v1/platform/boundaries', async (request) => successResponse(await getBoundaryRegistry(), request.correlationId));
  app.get('/api/v1/platform/boundaries/summary', async (request) => successResponse(await getBoundarySummary(), request.correlationId));
  app.get('/api/v1/platform/boundaries/validation', async (request) => successResponse(await validateBoundaryRegistry(), request.correlationId));
  expose(app, '/api/v1/platform/features', 'features');
  app.get('/api/v1/platform/capabilities', async (request) => successResponse(await getCapabilityRegistry(), request.correlationId));
  app.get('/api/v1/platform/capabilities/summary', async (request) => successResponse(await getCapabilitySummary(), request.correlationId));
  app.get('/api/v1/platform/capabilities/validation', async (request) => successResponse(await getCapabilityValidationResult(), request.correlationId));
  app.get<{ Params: { capabilityId: string } }>('/api/v1/platform/capabilities/:capabilityId', async (request) => successResponse(await getCapabilityById(request.params.capabilityId), request.correlationId));
  expose(app, '/api/v1/platform/knowledge', 'knowledge');
  expose(app, '/api/v1/platform/ai-policies', 'aiPolicies');
  app.get('/api/v1/platform/health-manifest', async (request) => successResponse(await getPlatformHealthManifest(), request.correlationId));
  app.get('/api/v1/platform/health/summary', async (request) => successResponse(await getHealthSummary(), request.correlationId));
  app.get('/api/v1/platform/health/readiness', async (request) => successResponse(await getReadiness(), request.correlationId));
  app.get('/api/v1/platform/health/architecture-compliance', async (request) => successResponse(await getArchitectureCompliance(), request.correlationId));
  expose(app, '/api/v1/platform/registration-readiness', 'registrationReadiness');
  expose(app, '/api/v1/platform/dependencies', 'dependencies');
  app.get('/api/v1/platform/contracts/compatibility', async (request) => successResponse(await discoverContractCompatibility(), request.correlationId));
  app.get('/api/v1/platform/contracts/apis', async (request) => successResponse(await getApiContractRegistry(), request.correlationId));
  app.get('/api/v1/platform/contracts/events', async (request) => successResponse(await getEventContractRegistry(), request.correlationId));
  app.get('/api/v1/platform/contracts/versions', async (request) => successResponse(await getApiVersionMatrix(), request.correlationId));
  app.get('/api/v1/platform/contracts/validation', async (request) => successResponse(await validateContractRegistries(), request.correlationId));
  app.get('/api/v1/platform/contracts/summary', async (request) => successResponse(await getContractRegistrySummary(), request.correlationId));
}
