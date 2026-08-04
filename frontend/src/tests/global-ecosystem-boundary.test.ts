import { describe, expect, it } from 'vitest';
import { MockGlobalEcosystemConnectionReader } from '../integrations/global-ecosystem/connection';

describe('Global Ecosystem frontend boundary', () => {
  it('uses a no-network mock and remains not configured', async () => {
    const reader = new MockGlobalEcosystemConnectionReader();
    const status = await reader.getConnectionStatus();
    expect(reader.performsDirectGlobalEcosystemRequests).toBe(false);
    expect(status).toMatchObject({
      integrationConfigured: false,
      networkRequestPerformed: false,
      status: 'NOT_CONFIGURED',
    });
  });
});
