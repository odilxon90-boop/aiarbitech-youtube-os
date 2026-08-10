export const REGISTRATION_STATUSES = [
  'NOT_REGISTERED',
  'READY',
  'BLOCKED',
  'REGISTERED',
] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];
export type VerificationStatus = 'VERIFIED' | 'NOT_VERIFIED';

export interface RegistrationEvidence {
  status: VerificationStatus;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  origin: readonly string[];
}

export interface RegistrationMetadata {
  platformId: string;
  platformName: string;
  platformVersion: string;
  currentGate: string;
  currentSprint: string;
  currentPhase: string;
  compatibilityStatus: VerificationStatus;
  registrationMode: 'LOCAL_ONLY';
  evidence: RegistrationEvidence;
}

export interface RegistrationReadiness {
  ready: boolean;
  status: RegistrationStatus;
  blockingItems: readonly string[];
  evidence: RegistrationEvidence;
}

export interface RegistrationSummary {
  status: RegistrationStatus;
  readiness: RegistrationReadiness;
  metadata: RegistrationMetadata;
}