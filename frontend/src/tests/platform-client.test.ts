import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlatformFoundationClient, HttpPlatformFoundationClient } from '../platform/platform-client';

describe('platform foundation client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers the global api base url when configured', () => {
    vi.stubEnv('VITE_GLOBAL_API_BASE_URL', 'https://aiarbitech-global-ecosystem.up.railway.app');
    vi.stubEnv('VITE_PLATFORM_API_BASE_URL', '/should-not-be-used');

    const client = createPlatformFoundationClient() as HttpPlatformFoundationClient;

    expect(client).toBeInstanceOf(HttpPlatformFoundationClient);
    expect((client as unknown as { baseUrl: string }).baseUrl).toBe(
      'https://aiarbitech-global-ecosystem.up.railway.app',
    );
  });
});
