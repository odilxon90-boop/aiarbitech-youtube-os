export interface RequestMetadata {
  contractVersion: 'v1';
  correlationId: string;
  requestId: string;
  timeoutMs: number;
  retry: RetryMetadata;
  idempotencyKey?: string;
}

export interface RetryMetadata {
  attempt: number;
  maxAttempts: number;
}

export type IntegrationErrorCode =
  | 'NOT_CONFIGURED'
  | 'NOT_VERIFIED'
  | 'AUTHENTICATION_FAILED'
  | 'AUTHORIZATION_DENIED'
  | 'TIMEOUT'
  | 'UNAVAILABLE'
  | 'CONTRACT_MISMATCH'
  | 'INVALID_RESPONSE';

export interface IntegrationError {
  code: IntegrationErrorCode;
  message: string;
  retryable: boolean;
  correlationId: string;
  details?: Record<string, unknown>;
}

export type IntegrationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: IntegrationError };

export interface ServiceCredential {
  scheme: 'Bearer';
  token: string;
  expiresAt: string;
}

export interface ServiceToServiceAuthenticator {
  getCredential(metadata: RequestMetadata): Promise<IntegrationResult<ServiceCredential>>;
}

export interface IdentityVerificationRequest {
  subjectId: string;
  metadata: RequestMetadata;
}

export interface IdentityVerificationResult {
  verified: boolean;
  subjectId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN';
}

export interface EntitlementVerificationRequest {
  subjectId: string;
  capability: string;
  resource?: string;
  metadata: RequestMetadata;
}

export interface EntitlementVerificationResult {
  allowed: boolean;
  decisionId: string;
  reason?: string;
}

export interface AICoreRequest {
  operation: string;
  input: Readonly<Record<string, unknown>>;
  metadata: RequestMetadata;
}

export interface AICoreResult {
  requestId: string;
  output: Readonly<Record<string, unknown>>;
}

export interface WorkflowRequest {
  workflowKey: string;
  input: Readonly<Record<string, unknown>>;
  metadata: RequestMetadata;
}

export interface WorkflowResult {
  executionId: string;
  status: 'ACCEPTED' | 'REJECTED';
}

export interface AuditEventSubmission {
  eventType: string;
  occurredAt: string;
  actorId?: string;
  payload: Readonly<Record<string, unknown>>;
  metadata: RequestMetadata & { idempotencyKey: string };
}

export interface AuditSubmissionResult {
  accepted: boolean;
  eventId: string;
}

export interface NotificationRequest {
  recipientId: string;
  templateKey: string;
  variables: Readonly<Record<string, string | number | boolean>>;
  metadata: RequestMetadata & { idempotencyKey: string };
}

export interface NotificationResult {
  accepted: boolean;
  notificationId: string;
}

export interface BillingSubscriptionQuery {
  subjectId: string;
  metadata: RequestMetadata;
}

export interface BillingSubscriptionResult {
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN';
  entitlements: readonly string[];
}

export interface EcosystemHealthResult {
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'NOT_CONFIGURED';
  checkedAt: string;
}

export type CompatibilityStatus = 'COMPATIBLE' | 'INCOMPATIBLE' | 'NOT_VERIFIED' | 'NOT_CONFIGURED';

export interface CompatibilityResult {
  status: CompatibilityStatus;
  contractVersion: 'v1';
  checkedAt: string;
  capabilities: readonly {
    name: string;
    status: CompatibilityStatus;
  }[];
}

export interface GlobalEcosystemApiClient {
  verifyIdentity(request: IdentityVerificationRequest): Promise<IntegrationResult<IdentityVerificationResult>>;
  verifyEntitlement(request: EntitlementVerificationRequest): Promise<IntegrationResult<EntitlementVerificationResult>>;
  requestAICore(request: AICoreRequest): Promise<IntegrationResult<AICoreResult>>;
  requestWorkflow(request: WorkflowRequest): Promise<IntegrationResult<WorkflowResult>>;
  submitAuditEvent(request: AuditEventSubmission): Promise<IntegrationResult<AuditSubmissionResult>>;
  requestNotification(request: NotificationRequest): Promise<IntegrationResult<NotificationResult>>;
  queryBillingSubscription(request: BillingSubscriptionQuery): Promise<IntegrationResult<BillingSubscriptionResult>>;
  checkHealth(metadata: RequestMetadata): Promise<IntegrationResult<EcosystemHealthResult>>;
  checkCompatibility(metadata: RequestMetadata): Promise<IntegrationResult<CompatibilityResult>>;
}
