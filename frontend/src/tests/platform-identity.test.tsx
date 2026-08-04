import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlatformIdentityPage } from '../platform/PlatformIdentityPage';
import type { PlatformManifest } from '../platform/types';

const manifest: PlatformManifest = {
  platformId: 'PLATFORM_YOUTUBE_OS',
  platformName: 'AIArbiTech YouTube OS',
  platformVersion: '0.1.0',
  architectureModel: 'INDEPENDENT_PLATFORM_SERVICE',
  integrationModel: 'API_AND_EVENT_CONTRACTS',
  deploymentModel: 'INDEPENDENT',
  dataOwnership: 'PLATFORM_OWNED',
  repositoryType: 'INDEPENDENT',
  globalDatabaseAccess: 'PROHIBITED',
  crossPlatformDatabaseAccess: 'PROHIBITED',
  status: 'FOUNDATION_INITIALIZED',
  globalEcosystemCompatibility: { overall: 'NOT_VERIFIED', capabilities: [] },
};

describe('PlatformIdentityPage', () => {
  it('renders independent identity and prohibited database access', () => {
    const markup = renderToStaticMarkup(<PlatformIdentityPage manifest={manifest} />);
    expect(markup).toContain('PLATFORM_YOUTUBE_OS');
    expect(markup).toContain('INDEPENDENT_PLATFORM_SERVICE');
    expect(markup).toContain('PROHIBITED');
  });
});
