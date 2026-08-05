import { discoverContractCompatibility } from '../platform/contract-discovery.js';
import { loadGovernanceArtifact } from '../platform/governance-loader.js';
import { loadPlatformManifest } from '../platform/manifest.js';
import type {
  RegistrationEvidence,
  RegistrationMetadata,
  RegistrationReadiness,
  RegistrationStatus,
  RegistrationSummary,
} from './model.js';

const SPRINT_ID = 'AAT-YTOS-SPRINT0.0.1';
const PHASE_NAME = 'Sprint 0.0.1';

const metadataEvidence: RegistrationEvidence = {
  status: 'VERIFIED',
  confidence: 'HIGH',
  origin: [
    'platform.manifest.json',
    'governance/platform-passport.v1.json',
    SPRINT_ID,
  ],
};

export function evaluateRegistrationReadiness(
  metadata: RegistrationMetadata,
  enterpriseRegistrationId: string,
  serviceRegistryId: string,
): RegistrationReadiness {
  const blockingItems: string[] = [];

  if (metadata.compatibilityStatus === 'NOT_VERIFIED') {
    blockingItems.push('GLOBAL_ECOSYSTEM_COMPATIBILITY_NOT_VERIFIED');
  }
  if (enterpriseRegistrationId === 'NOT_ASSIGNED') {
    blockingItems.push('ENTERPRISE_REGISTRATION_ID_NOT_VERIFIED');
  }
  if (serviceRegistryId === 'NOT_ASSIGNED') {
    blockingItems.push('SERVICE_REGISTRY_ID_NOT_VERIFIED');
  }

  const status: RegistrationStatus = blockingItems.length === 0 ? 'READY' : 'BLOCKED';
  return {
    ready: status === 'READY',
    status,
    blockingItems,
    evidence: {
      status: 'VERIFIED',
      confidence: 'HIGH',
      origin: [
        'governance/platform-passport.v1.json',
        'governance/platform-dependencies.v1.json',
        'contracts/api/global-ecosystem-api.v1.json',
        'contracts/events/global-ecosystem-events.v1.json',
      ],
    },
  };
}

export async function getRegistrationSummary(): Promise<RegistrationSummary> {
  const [manifest, passport, compatibility] = await Promise.all([
    loadPlatformManifest(),
    loadGovernanceArtifact('passport'),
    discoverContractCompatibility(),
  ]);

  const metadata: RegistrationMetadata = {
    platformId: manifest.platformId,
    platformName: manifest.platformName,
    platformVersion: manifest.platformVersion,
    currentGate: passport.currentGate,
    currentSprint: SPRINT_ID,
    currentPhase: PHASE_NAME,
    compatibilityStatus: compatibility.overallCompatibility,
    registrationMode: 'LOCAL_ONLY',
    evidence: metadataEvidence,
  };
  const readiness = evaluateRegistrationReadiness(
    metadata,
    passport.enterpriseRegistrationId,
    passport.serviceRegistryId,
  );

  return { status: readiness.status, readiness, metadata };
}