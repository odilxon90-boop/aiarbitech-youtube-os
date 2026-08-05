import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlatformHealthDashboard } from '../platform/PlatformHealthDashboard';
import type { PlatformHealthManifest } from '../platform/types';

const score = { value: 100, passed: 4, total: 4, status: 'VALID' as const, basis: '4 of 4 repository checks passed', checks: [] };
const manifest: PlatformHealthManifest = {
  schemaVersion: '1.0.0', artifactType: 'PLATFORM_HEALTH_MANIFEST', artifactVersion: '2.0.0',
  architectureComplianceScore: score, repositoryHealthScore: score, foundationCompletion: score,
  currentGate: 'GATE_0B', currentSprint: 'AAT-YTOS-SPRINT-0.0.3', currentPhase: 'Platform Capability Health & Readiness Manifest',
  overallReadiness: { ...score, value: 80 },
  readiness: { ...score, value: 20, status: 'INVALID', readinessStatus: 'BLOCKED', blockingItems: ['AUTHORITATIVE_CONTRACTS_AVAILABLE'] },
  validationStatus: 'VALID', lastValidationTimestamp: '2026-08-06T00:00:00.000Z', networkRequestPerformed: false,
};

describe('PlatformHealthDashboard', () => {
  it('renders every required read-only health field', () => {
    const markup = renderToStaticMarkup(<PlatformHealthDashboard manifest={manifest} />);
    for (const expected of ['Architecture Compliance Score', 'Repository Health Score', 'Foundation Completion', 'Overall Readiness', 'GATE_0B', 'AAT-YTOS-SPRINT-0.0.3', 'Platform Capability Health &amp; Readiness Manifest', 'Validation Status', '2026-08-06T00:00:00.000Z', 'AUTHORITATIVE_CONTRACTS_AVAILABLE']) expect(markup).toContain(expected);
    expect(markup).not.toContain('<button');
    expect(markup).not.toContain('<form');
  });
});