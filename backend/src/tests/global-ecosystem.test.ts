import { describe, expect, it } from 'vitest';
import { loadEnvironment } from '../config/environment.js';
import { MockGlobalEcosystemApiClient, createRequestMetadata } from '../integrations/global-ecosystem/mock-adapter.js';

const config = loadEnvironment({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
});

describe('Global Ecosystem mock adapter', () => {
  it('never performs a network request', () => {
    const client = new MockGlobalEcosystemApiClient(false);
    expect(client.performsNetworkRequests).toBe(false);
  });

  it('returns NOT_CONFIGURED for business capability calls', async () => {
    const client = new MockGlobalEcosystemApiClient(false);
    const metadata = createRequestMetadata(config, 'correlation-1');
    const result = await client.verifyIdentity({ subjectId: 'subject-1', metadata });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('NOT_CONFIGURED');
  });

  it('includes timeout, retry, correlation, and idempotency metadata', () => {
    const metadata = createRequestMetadata(config, 'correlation-2', 'idempotency-1');
    expect(metadata).toMatchObject({
      contractVersion: 'v1',
      correlationId: 'correlation-2',
      timeoutMs: 5000,
      idempotencyKey: 'idempotency-1',
      retry: { attempt: 0, maxAttempts: 3 },
    });
  });
});
