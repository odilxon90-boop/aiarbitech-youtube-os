import type { GlobalEcosystemConnectionStatus } from '../../platform/types';

export interface GlobalEcosystemConnectionReader {
  getConnectionStatus(signal?: AbortSignal): Promise<GlobalEcosystemConnectionStatus>;
}

/**
 * Safe foundation adapter. It does not contact the Global Ecosystem. The frontend
 * receives compatibility through the YouTube OS backend boundary only.
 */
export class MockGlobalEcosystemConnectionReader implements GlobalEcosystemConnectionReader {
  readonly performsDirectGlobalEcosystemRequests = false;

  async getConnectionStatus(): Promise<GlobalEcosystemConnectionStatus> {
    return {
      integrationConfigured: false,
      networkRequestPerformed: false,
      status: 'NOT_CONFIGURED',
      contractVersion: 'v1',
      capabilities: [],
    };
  }
}
