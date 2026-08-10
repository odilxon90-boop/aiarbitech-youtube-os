export type HealthValidationStatus = 'VALID' | 'INVALID';
export type ReadinessStatus = 'READY' | 'BLOCKED';

export interface HealthCheck {
  id: string;
  passed: boolean;
  origin: string;
}

export interface DerivedScore {
  value: number;
  passed: number;
  total: number;
  status: HealthValidationStatus;
  basis: string;
  checks: readonly HealthCheck[];
}

export interface ReadinessModel extends DerivedScore {
  readinessStatus: ReadinessStatus;
  blockingItems: readonly string[];
}

export interface PlatformHealthManifest {
  schemaVersion: string;
  artifactType: 'PLATFORM_HEALTH_MANIFEST';
  artifactVersion: string;
  architectureComplianceScore: DerivedScore;
  repositoryHealthScore: DerivedScore;
  foundationCompletion: DerivedScore;
  currentGate: 'GATE_0B';
  currentSprint: 'AAT-YTOS-SPRINT-0.0.3';
  currentPhase: string;
  overallReadiness: DerivedScore;
  readiness: ReadinessModel;
  validationStatus: HealthValidationStatus;
  lastValidationTimestamp: string;
  networkRequestPerformed: false;
  evidence: {
    status: 'VERIFIED';
    confidence: 'HIGH';
    origin: readonly string[];
    decisionClassification: 'REPOSITORY_DERIVED_HEALTH';
  };
}

export interface HealthSummary {
  architectureComplianceScore: number;
  repositoryHealthScore: number;
  foundationCompletion: number;
  currentGate: string;
  currentSprint: string;
  currentPhase: string;
  overallReadiness: number;
  validationStatus: HealthValidationStatus;
  lastValidationTimestamp: string;
}