import { randomUUID } from 'node:crypto';
import type { EnvironmentConfig } from '../../config/environment.js';
import type {
  AICoreRequest,
  AICoreResult,
  AuditEventSubmission,
  AuditSubmissionResult,
  BillingSubscriptionQuery,
  BillingSubscriptionResult,
  CompatibilityResult,
  EcosystemHealthResult,
  EntitlementVerificationRequest,
  EntitlementVerificationResult,
  GlobalEcosystemApiClient,
  IdentityVerificationRequest,
  IdentityVerificationResult,
  IntegrationResult,
  NotificationRequest,
  NotificationResult,
  RequestMetadata,
  ServiceCredential,
  ServiceToServiceAuthenticator,
  WorkflowRequest,
  WorkflowResult,
} from './contracts.js';

function unavailable<T>(metadata: RequestMetadata, configured: boolean): IntegrationResult<T> {
  return {
    ok: false,
    error: {
      code: configured ? 'NOT_VERIFIED' : 'NOT_CONFIGURED',
      message: configured
        ? 'Global Ecosystem contracts have not been verified; no external request was performed.'
        : 'Global Ecosystem integration is not configured; no external request was performed.',
      retryable: false,
      correlationId: metadata.correlationId,
    },
  };
}

export class MockServiceToServiceAuthenticator implements ServiceToServiceAuthenticator {
  constructor(private readonly configured: boolean) {}

  async getCredential(metadata: RequestMetadata): Promise<IntegrationResult<ServiceCredential>> {
    return unavailable(metadata, this.configured);
  }
}

export class MockGlobalEcosystemApiClient implements GlobalEcosystemApiClient {
  readonly performsNetworkRequests = false;

  constructor(
    private readonly configured: boolean,
    readonly authenticator: ServiceToServiceAuthenticator = new MockServiceToServiceAuthenticator(configured),
  ) {}

  async verifyIdentity(request: IdentityVerificationRequest): Promise<IntegrationResult<IdentityVerificationResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async verifyEntitlement(request: EntitlementVerificationRequest): Promise<IntegrationResult<EntitlementVerificationResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async requestAICore(request: AICoreRequest): Promise<IntegrationResult<AICoreResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async requestWorkflow(request: WorkflowRequest): Promise<IntegrationResult<WorkflowResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async submitAuditEvent(request: AuditEventSubmission): Promise<IntegrationResult<AuditSubmissionResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async requestNotification(request: NotificationRequest): Promise<IntegrationResult<NotificationResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async queryBillingSubscription(request: BillingSubscriptionQuery): Promise<IntegrationResult<BillingSubscriptionResult>> {
    return unavailable(request.metadata, this.configured);
  }

  async checkHealth(metadata: RequestMetadata): Promise<IntegrationResult<EcosystemHealthResult>> {
    return {
      ok: true,
      value: {
        status: this.configured ? 'UNAVAILABLE' : 'NOT_CONFIGURED',
        checkedAt: new Date().toISOString(),
      },
    };
  }

  async checkCompatibility(_metadata: RequestMetadata): Promise<IntegrationResult<CompatibilityResult>> {
    const status = this.configured ? 'NOT_VERIFIED' : 'NOT_CONFIGURED';
    return {
      ok: true,
      value: {
        status,
        contractVersion: 'v1',
        checkedAt: new Date().toISOString(),
        capabilities: [],
      },
    };
  }
}

export function createRequestMetadata(
  config: EnvironmentConfig,
  correlationId: string,
  idempotencyKey?: string,
): RequestMetadata {
  return {
    contractVersion: 'v1',
    correlationId,
    requestId: randomUUID(),
    timeoutMs: config.GLOBAL_ECOSYSTEM_TIMEOUT_MS,
    retry: {
      attempt: 0,
      maxAttempts: config.GLOBAL_ECOSYSTEM_MAX_RETRIES + 1,
    },
    ...(idempotencyKey ? { idempotencyKey } : {}),
  };
}
