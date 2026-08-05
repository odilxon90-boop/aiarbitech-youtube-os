import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformBoundaryRegistryDashboard } from '../platform/PlatformBoundaryRegistryDashboard';
import type { PlatformBoundaryRegistry } from '../platform/types';

describe('PlatformBoundaryRegistryDashboard', () => {
  it('renders every read-only boundary section and empty provider/network states', () => {
    const registry = { schemaVersion: '1.0.0', artifactType: 'PLATFORM_BOUNDARY_REGISTRY', artifactVersion: '2.0.0', platformId: 'PLATFORM_YOUTUBE_OS', currentSprint: 'AAT-YTOS-SPRINT-0.0.4', platformInternalModules: [{ id: 'PLATFORM_API', classification: 'BACKEND_FOUNDATION', status: 'IMPLEMENTED', origin: 'backend/src/platform/routes.ts' }], platformOwnedDatabaseObjects: [{ name: 'platform_runtime_metadata', prismaModel: 'PlatformRuntimeMetadata', classification: 'PLATFORM_OWNED', status: 'DECLARED', origin: 'backend/prisma/schema.prisma' }], platformPublicApis: [{ method: 'GET', path: '/api/v1/platform/boundaries', origin: 'backend/src/platform/routes.ts' }], platformPublicEvents: [], consumedGlobalApis: [{ id: 'GLOBAL_ECOSYSTEM_API_V1', direction: 'CONSUMED_API', status: 'AUTHORITATIVE_CONTRACT_NOT_AVAILABLE', origin: 'contracts/api/global-ecosystem-api.v1.json' }], consumedGlobalEvents: [{ id: 'GLOBAL_ECOSYSTEM_EVENTS_V1', direction: 'CONSUMED_EVENT', status: 'AUTHORITATIVE_CONTRACT_NOT_AVAILABLE', origin: 'contracts/events/global-ecosystem-events.v1.json' }], forbiddenDependencies: ['GLOBAL_ECOSYSTEM_SOURCE_IMPORT'], forbiddenDatabaseAccess: ['CROSS_PLATFORM_DATABASE'], externalProviders: [], allowedNetworkDestinations: [] } satisfies PlatformBoundaryRegistry;
    const html = renderToStaticMarkup(<PlatformBoundaryRegistryDashboard registry={registry} />);
    for (const heading of ['Internal Modules', 'Database Ownership', 'Public APIs', 'Public Events', 'Consumed Global APIs', 'Consumed Global Events', 'Forbidden Dependencies', 'Forbidden Database Access', 'External Providers', 'Allowed Network Destinations']) expect(html).toContain(heading);
    expect(html.match(/No repository evidence registered\./g)).toHaveLength(3); expect(html).not.toContain('<button'); expect(html).not.toContain('<form');
  });
});