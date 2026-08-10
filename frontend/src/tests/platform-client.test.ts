import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlatformFoundationClient, HttpPlatformFoundationClient } from '../platform/platform-client';

describe('platform foundation client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers the platform api base url when configured', () => {
    vi.stubEnv('VITE_PLATFORM_API_BASE_URL', 'https://aiarbitech-youtube-os-production.up.railway.app/api/v1');
    vi.stubEnv('VITE_GLOBAL_API_BASE_URL', 'https://aiarbitech-global-ecosystem-production.up.railway.app');

    const client = createPlatformFoundationClient() as HttpPlatformFoundationClient;

    expect(client).toBeInstanceOf(HttpPlatformFoundationClient);
    expect((client as unknown as { baseUrl: string }).baseUrl).toBe(
      'https://aiarbitech-youtube-os-production.up.railway.app/api/v1',
    );
  });
});
