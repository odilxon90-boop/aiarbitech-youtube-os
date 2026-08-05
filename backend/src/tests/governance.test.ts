import { describe, expect, it } from 'vitest';
import { loadGovernanceArtifact, loadGovernanceBundle } from '../platform/governance-loader.js';
import { discoverContractCompatibility } from '../platform/contract-discovery.js';

describe('Gate 0B governance', () => {
  it('schema-validates every versioned repository-owned artifact', async () => {
    const bundle = await loadGovernanceBundle();
    expect(Object.keys(bundle)).toHaveLength(9);
    expect(bundle.passport.currentGate).toBe('GATE_0B');
    expect(bundle.registrationReadiness.sprint0Authorized).toBe(false);
  });
  it('loads artifacts as immutable read-only evidence', async () => {
    const passport = await loadGovernanceArtifact('passport');
    expect(Object.isFrozen(passport)).toBe(true);
    expect(Object.isFrozen(passport.evidence)).toBe(true);
  });
  it('discovers only local placeholders and does not invent authority', async () => {
    const report = await discoverContractCompatibility();
    expect(report.networkRequestPerformed).toBe(false);
    expect(report.overallCompatibility).toBe('NOT_VERIFIED');
    expect(report.matrix.every((item) => item.authoritativeContractStatus === 'AUTHORITATIVE CONTRACT NOT AVAILABLE')).toBe(true);
  });
});
