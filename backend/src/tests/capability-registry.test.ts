import { describe, expect, it } from 'vitest';
import { getCapabilityById, getCapabilitySummary, getCapabilityValidationResult } from '../platform/capability-service.js';
import { loadGovernanceArtifact } from '../platform/governance-loader.js';
import { capabilityLifecycleValues, capabilityRecordSchema } from '../platform/governance-schemas.js';

describe('platform capability registry', () => {
  it('upgrades the existing authoritative registry with complete unique records', async () => {
    const registry = await loadGovernanceArtifact('capabilities');
    expect(registry.artifactVersion).toBe('2.0.0');
    expect(registry.capabilities).toHaveLength(22);
    expect(new Set(registry.capabilities.map((capability) => capability.capabilityId)).size).toBe(registry.capabilities.length);
    expect(Object.keys(registry.capabilities[0] ?? {})).toEqual(expect.arrayContaining(['capabilityId','capabilityName','capabilityDescription','capabilityCategory','capabilityOwner','platformId','currentStatus','lifecycleStatus','version','evidenceStatus','confidenceLevel','origin','dependencies','requiredGlobalServices','requiredContracts','implementationStatus','certificationStatus','lastUpdated']));
  });

  it('restricts lifecycle values and evidence-backed implementation states', () => {
    expect(capabilityLifecycleValues).toEqual(['REGISTERED','PLANNED','AUTHORIZED','NOT_IMPLEMENTED','IMPLEMENTED','VERIFIED','DEPRECATED']);
    const foundation = { capabilityId:'TEST', capabilityName:'Test', capabilityDescription:'Test capability', capabilityCategory:'FOUNDATION_GOVERNANCE', capabilityOwner:'PLATFORM', platformId:'PLATFORM_YOUTUBE_OS', currentStatus:'AVAILABLE', lifecycleStatus:'IMPLEMENTED', version:'1.0.0', evidenceStatus:'NOT_VERIFIED', confidenceLevel:'LOW', origin:['test'], dependencies:[], requiredGlobalServices:[], requiredContracts:[], implementationStatus:'IMPLEMENTED', certificationStatus:'NOT_VERIFIED', lastUpdated:'2026-08-05' };
    expect(capabilityRecordSchema.safeParse(foundation).success).toBe(false);
    expect(capabilityRecordSchema.safeParse({ ...foundation, capabilityCategory:'YOUTUBE_BUSINESS', lifecycleStatus:'NOT_IMPLEMENTED', evidenceStatus:'VERIFIED' }).success).toBe(false);
  });

  it('preserves verified foundation evidence and keeps business capabilities not implemented', async () => {
    const registry = await loadGovernanceArtifact('capabilities');
    expect(registry.capabilities.find((capability) => capability.capabilityId === 'FOUNDATION_GOVERNANCE')).toMatchObject({ implementationStatus:'IMPLEMENTED', evidenceStatus:'VERIFIED', lifecycleStatus:'VERIFIED' });
    expect(registry.capabilities.filter((capability) => capability.capabilityCategory === 'YOUTUBE_BUSINESS').every((capability) => capability.implementationStatus === 'NOT_IMPLEMENTED')).toBe(true);
  });

  it('returns summary, details, unknown behavior, and local validation evidence', async () => {
    await expect(getCapabilityById('CHANNEL_MANAGEMENT')).resolves.toMatchObject({ capabilityName:'Channel Management', implementationStatus:'NOT_IMPLEMENTED' });
    await expect(getCapabilityById('UNKNOWN')).rejects.toMatchObject({ statusCode:404, code:'CAPABILITY_NOT_FOUND' });
    await expect(getCapabilitySummary()).resolves.toMatchObject({ total:22, implemented:1, notImplemented:21, businessCapabilities:7, businessCapabilitiesNotImplemented:7 });
    await expect(getCapabilityValidationResult()).resolves.toMatchObject({ valid:true, registryCount:1, duplicateCapabilityIds:[], implementedWithoutVerifiedEvidence:[], businessCapabilitiesNotImplemented:true, externalNetworkCommunication:false });
  });
});