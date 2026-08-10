import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContractRegistryDashboard, VersionMatrixDashboard } from '../platform/ContractRegistryDashboard';
import type { ContractRegistry, VersionMatrix } from '../platform/types';

describe('ContractRegistryDashboard', () => {
  it('renders API and event registries with read-only evidence and related files', () => {
    const apiRegistry: ContractRegistry = {
      registryType: 'API_CONTRACT_REGISTRY', platformId: 'PLATFORM_YOUTUBE_OS', currentSprint: 'AAT-YTOS-SPRINT-0.0.5',
      contracts: [
        { contractId: 'API_GET_HEALTH_LIVE', kind: 'API', ownership: 'OWNED', direction: 'PROVIDED', version: 'v1', lifecycle: 'ACTIVE', compatibility: 'VERIFIED', repositoryEvidence: 'VERIFIED', origin: 'backend/src/health/routes.ts', relatedFiles: ['backend/src/health/routes.ts', 'governance/platform-boundary-registry.v1.json'], method: 'GET', path: '/api/v1/health/live' },
        { contractId: 'GLOBAL_ECOSYSTEM_API_V1', kind: 'API', ownership: 'CONSUMED', direction: 'CONSUMED', version: 'v1', lifecycle: 'PLACEHOLDER', compatibility: 'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT', repositoryEvidence: 'VERIFIED', origin: 'contracts/api/global-ecosystem-api.v1.json', relatedFiles: ['contracts/api/global-ecosystem-api.v1.json', 'governance/platform-dependencies.v1.json'] },
      ],
      networkRequestPerformed: false,
    };
    const eventRegistry: ContractRegistry = {
      registryType: 'EVENT_CONTRACT_REGISTRY', platformId: 'PLATFORM_YOUTUBE_OS', currentSprint: 'AAT-YTOS-SPRINT-0.0.5',
      contracts: [
        { contractId: 'GLOBAL_ECOSYSTEM_EVENTS_V1', kind: 'EVENT', ownership: 'CONSUMED', direction: 'CONSUMED', version: 'v1', lifecycle: 'PLACEHOLDER', compatibility: 'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT', repositoryEvidence: 'VERIFIED', origin: 'contracts/events/global-ecosystem-events.v1.json', relatedFiles: ['contracts/events/global-ecosystem-events.v1.json', 'governance/platform-dependencies.v1.json'] },
      ],
      networkRequestPerformed: false,
    };
    const apiHtml = renderToStaticMarkup(<ContractRegistryDashboard registry={apiRegistry} />);
    const eventHtml = renderToStaticMarkup(<ContractRegistryDashboard registry={eventRegistry} />);
    expect(apiHtml).toContain('API Contract Registry');
    expect(eventHtml).toContain('Event Contract Registry');
    for (const heading of ['Contracts', 'Repository Evidence', 'Related Files']) expect(apiHtml).toContain(heading);
    expect(apiHtml).toContain('API_GET_HEALTH_LIVE');
    expect(apiHtml).toContain('GLOBAL_ECOSYSTEM_API_V1');
    expect(eventHtml).toContain('GLOBAL_ECOSYSTEM_EVENTS_V1');
    expect(apiHtml).not.toContain('<button'); expect(apiHtml).not.toContain('<form');
  });

  it('renders the version matrix with read-only rows', () => {
    const matrix: VersionMatrix = {
      matrix: [
        { contractId: 'API_GET_HEALTH_LIVE', kind: 'API', ownership: 'OWNED', version: 'v1', requiredVersion: 'v1', lifecycle: 'ACTIVE', compatibility: 'VERIFIED', origin: 'backend/src/health/routes.ts' },
        { contractId: 'GLOBAL_ECOSYSTEM_API_V1', kind: 'API', ownership: 'CONSUMED', version: 'v1', requiredVersion: 'v1', lifecycle: 'PLACEHOLDER', compatibility: 'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT', origin: 'contracts/api/global-ecosystem-api.v1.json' },
      ],
      overallCompatibility: 'PARTIAL',
      networkRequestPerformed: false,
    };
    const html = renderToStaticMarkup(<VersionMatrixDashboard matrix={matrix.matrix} />);
    expect(html).toContain('API Version Matrix');
    expect(html).toContain('API_GET_HEALTH_LIVE');
    expect(html).toContain('GLOBAL_ECOSYSTEM_API_V1');
    expect(html).not.toContain('<button'); expect(html).not.toContain('<form');
  });
});
