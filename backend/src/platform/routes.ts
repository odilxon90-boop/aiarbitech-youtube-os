import type { FastifyInstance } from 'fastify';
import type { EnvironmentConfig } from '../config/environment.js';
import { isGlobalEcosystemConfigured } from '../config/environment.js';
import { successResponse } from '../contracts/api.js';
import type { GlobalEcosystemApiClient } from '../integrations/global-ecosystem/contracts.js';
import { createRequestMetadata } from '../integrations/global-ecosystem/mock-adapter.js';
import { loadPlatformManifest } from './manifest.js';

export function registerPlatformRoutes(
  app: FastifyInstance,
  config: EnvironmentConfig,
  globalEcosystemClient: GlobalEcosystemApiClient,
): void {
  app.get('/api/v1/platform/manifest', async (request) => {
    const manifest = await loadPlatformManifest();
    return successResponse(manifest, request.correlationId);
  });

  app.get('/api/v1/platform/compatibility', async (request) => {
    const manifest = await loadPlatformManifest();
    const metadata = createRequestMetadata(config, request.correlationId);
    const compatibility = await globalEcosystemClient.checkCompatibility(metadata);
    const configured = isGlobalEcosystemConfigured(config);

    return successResponse(
      {
        platformId: manifest.platformId,
        contractVersion: 'v1',
        integrationConfigured: configured,
        networkRequestPerformed: false,
        status: compatibility.ok
          ? compatibility.value.status
          : compatibility.error.code,
        capabilities: manifest.globalEcosystemCompatibility.capabilities,
        checkedAt: new Date().toISOString(),
      },
      request.correlationId,
    );
  });
}
