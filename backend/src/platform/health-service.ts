import { access, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { GovernanceArtifactName } from './governance-schemas.js';
import { loadGovernanceArtifact } from './governance-loader.js';
import type { DerivedScore, HealthCheck, HealthSummary, PlatformHealthManifest, ReadinessModel } from './health-model.js';

function repositoryRoot(): string {
  return process.cwd().endsWith('backend') ? resolve(process.cwd(), '..') : process.cwd();
}

function score(checks: readonly HealthCheck[], label: string): DerivedScore {
  const passed = checks.filter((check) => check.passed).length;
  const total = checks.length;
  return {
    value: total === 0 ? 0 : Math.round((passed / total) * 100),
    passed,
    total,
    status: passed === total ? 'VALID' : 'INVALID',
    basis: `${passed} of ${total} repository-derived ${label} checks passed`,
    checks,
  };
}

async function fileCheck(path: string): Promise<HealthCheck> {
  try {
    await access(resolve(repositoryRoot(), path));
    return { id: `FILE_${path}`, passed: true, origin: path };
  } catch {
    return { id: `FILE_${path}`, passed: false, origin: path };
  }
}

async function latestEvidenceTimestamp(paths: readonly string[]): Promise<string> {
  const timestamps = await Promise.all(paths.map(async (path) => {
    try { return (await stat(resolve(repositoryRoot(), path))).mtimeMs; } catch { return 0; }
  }));
  return new Date(Math.max(...timestamps)).toISOString();
}

export async function getArchitectureCompliance(): Promise<DerivedScore> {
  const [passport, boundaries] = await Promise.all([
    loadGovernanceArtifact('passport'),
    loadGovernanceArtifact('boundaries'),
  ]);
  return score([
    { id: 'INDEPENDENT_REPOSITORY', passed: passport.repository.type === 'INDEPENDENT', origin: 'governance/platform-passport.v1.json' },
    { id: 'INDEPENDENT_ARCHITECTURE', passed: passport.architectureModel === 'INDEPENDENT_PLATFORM_SERVICE', origin: 'governance/platform-passport.v1.json' },
    { id: 'INDEPENDENT_DEPLOYMENT', passed: passport.deploymentModel === 'INDEPENDENT', origin: 'governance/platform-passport.v1.json' },
    { id: 'PLATFORM_OWNED_DATA', passed: passport.dataOwnership === 'PLATFORM_OWNED', origin: 'governance/platform-passport.v1.json' },
    { id: 'GLOBAL_DATABASE_PROHIBITED', passed: passport.globalDatabaseAccess === 'PROHIBITED', origin: 'governance/platform-passport.v1.json' },
    { id: 'CROSS_PLATFORM_DATABASE_PROHIBITED', passed: passport.crossPlatformDatabaseAccess === 'PROHIBITED', origin: 'governance/platform-passport.v1.json' },
    { id: 'NO_PUBLIC_EVENTS', passed: boundaries.platformPublicEvents.length === 0, origin: 'governance/platform-boundary-registry.v1.json' },
    { id: 'NO_EXTERNAL_PROVIDERS', passed: boundaries.externalProviders.length === 0, origin: 'governance/platform-boundary-registry.v1.json' },
    { id: 'GLOBAL_SOURCE_IMPORT_FORBIDDEN', passed: boundaries.forbiddenDependencies.includes('GLOBAL_ECOSYSTEM_SOURCE_IMPORT'), origin: 'governance/platform-boundary-registry.v1.json' },
    { id: 'SHARED_PRISMA_FORBIDDEN', passed: boundaries.forbiddenDatabaseAccess.includes('SHARED_PRISMA_CLIENT'), origin: 'governance/platform-boundary-registry.v1.json' },
  ], 'architecture compliance');
}

export async function getRepositoryHealth(): Promise<DerivedScore> {
  const specification = await loadGovernanceArtifact('healthManifest');
  return score(await Promise.all(specification.requiredRepositoryFiles.map(fileCheck)), 'required file');
}

export async function getFoundationCompletion(): Promise<DerivedScore> {
  const specification = await loadGovernanceArtifact('healthManifest');
  const checks = await Promise.all(specification.requiredGovernanceArtifacts.map(async (name) => {
    try {
      await loadGovernanceArtifact(name as GovernanceArtifactName);
      return { id: `ARTIFACT_${name}`, passed: true, origin: `governance/${name}` };
    } catch {
      return { id: `ARTIFACT_${name}`, passed: false, origin: `governance/${name}` };
    }
  }));
  return score(checks, 'governance artifact');
}

export async function getReadiness(): Promise<ReadinessModel> {
  const [passport, dependencies, registration] = await Promise.all([
    loadGovernanceArtifact('passport'),
    loadGovernanceArtifact('dependencies'),
    loadGovernanceArtifact('registrationReadiness'),
  ]);
  const checks: HealthCheck[] = [
    { id: 'LOCAL_FOUNDATION_READY', passed: registration.localFoundationReady, origin: 'governance/registration-readiness.v1.json' },
    { id: 'AUTHORITATIVE_CONTRACTS_AVAILABLE', passed: dependencies.missingContracts.length === 0, origin: 'governance/platform-dependencies.v1.json' },
    { id: 'ENTERPRISE_REGISTRATION_ASSIGNED', passed: passport.enterpriseRegistrationId !== 'NOT_ASSIGNED', origin: 'governance/platform-passport.v1.json' },
    { id: 'SERVICE_REGISTRY_ASSIGNED', passed: passport.serviceRegistryId !== 'NOT_ASSIGNED', origin: 'governance/platform-passport.v1.json' },
    { id: 'COMPATIBILITY_VERIFIED', passed: passport.compatibility !== 'NOT_VERIFIED', origin: 'governance/platform-passport.v1.json' },
  ];
  const derived = score(checks, 'readiness');
  return {
    ...derived,
    readinessStatus: derived.status === 'VALID' ? 'READY' : 'BLOCKED',
    blockingItems: checks.filter((check) => !check.passed).map((check) => check.id),
  };
}

export async function getPlatformHealthManifest(): Promise<PlatformHealthManifest> {
  const specification = await loadGovernanceArtifact('healthManifest');
  const [architectureComplianceScore, repositoryHealthScore, foundationCompletion, readiness] = await Promise.all([
    getArchitectureCompliance(), getRepositoryHealth(), getFoundationCompletion(), getReadiness(),
  ]);
  const componentScores = [architectureComplianceScore, repositoryHealthScore, foundationCompletion, readiness];
  const overallValue = Math.round(componentScores.reduce((sum, item) => sum + item.value, 0) / componentScores.length);
  const overallReadiness: DerivedScore = {
    value: overallValue,
    passed: componentScores.filter((item) => item.status === 'VALID').length,
    total: componentScores.length,
    status: componentScores.every((item) => item.status === 'VALID') ? 'VALID' : 'INVALID',
    basis: 'Arithmetic mean of architecture, repository, foundation, and readiness scores',
    checks: componentScores.map((item, index) => ({ id: ['ARCHITECTURE', 'REPOSITORY', 'FOUNDATION', 'READINESS'][index]!, passed: item.status === 'VALID', origin: item.basis })),
  };
  const evidenceFiles = [...specification.requiredRepositoryFiles, 'governance/platform-health-manifest.v1.json'];
  return {
    schemaVersion: specification.schemaVersion,
    artifactType: specification.artifactType,
    artifactVersion: specification.artifactVersion,
    architectureComplianceScore,
    repositoryHealthScore,
    foundationCompletion,
    currentGate: specification.currentGate,
    currentSprint: specification.currentSprint,
    currentPhase: specification.currentPhase,
    overallReadiness,
    readiness,
    validationStatus: architectureComplianceScore.status === 'VALID' && repositoryHealthScore.status === 'VALID' && foundationCompletion.status === 'VALID' ? 'VALID' : 'INVALID',
    lastValidationTimestamp: await latestEvidenceTimestamp(evidenceFiles),
    networkRequestPerformed: false,
    evidence: { status: 'VERIFIED', confidence: 'HIGH', origin: evidenceFiles, decisionClassification: 'REPOSITORY_DERIVED_HEALTH' },
  };
}

export async function getHealthSummary(): Promise<HealthSummary> {
  const manifest = await getPlatformHealthManifest();
  return {
    architectureComplianceScore: manifest.architectureComplianceScore.value,
    repositoryHealthScore: manifest.repositoryHealthScore.value,
    foundationCompletion: manifest.foundationCompletion.value,
    currentGate: manifest.currentGate,
    currentSprint: manifest.currentSprint,
    currentPhase: manifest.currentPhase,
    overallReadiness: manifest.overallReadiness.value,
    validationStatus: manifest.validationStatus,
    lastValidationTimestamp: manifest.lastValidationTimestamp,
  };
}