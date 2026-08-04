import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export type CompatibilityStatus = 'NOT_VERIFIED';

export interface PlatformManifest {
  platformId: 'PLATFORM_YOUTUBE_OS';
  platformName: 'AIArbiTech YouTube OS';
  platformVersion: string;
  architectureModel: 'INDEPENDENT_PLATFORM_SERVICE';
  integrationModel: 'API_AND_EVENT_CONTRACTS';
  deploymentModel: 'INDEPENDENT';
  dataOwnership: 'PLATFORM_OWNED';
  repositoryType: 'INDEPENDENT';
  globalDatabaseAccess: 'PROHIBITED';
  crossPlatformDatabaseAccess: 'PROHIBITED';
  status: 'FOUNDATION_INITIALIZED';
  globalEcosystemCompatibility: {
    overall: CompatibilityStatus;
    capabilities: { name: string; compatibility: CompatibilityStatus }[];
  };
}

let cachedManifest: PlatformManifest | undefined;

export async function loadPlatformManifest(): Promise<PlatformManifest> {
  if (cachedManifest) return cachedManifest;

  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const manifestPath = resolve(currentDirectory, '../../../platform.manifest.json');
  const contents = await readFile(manifestPath, 'utf8');
  cachedManifest = JSON.parse(contents.replace(/^\uFEFF/, '')) as PlatformManifest;
  return cachedManifest;
}

export function setPlatformManifestForTests(manifest?: PlatformManifest): void {
  cachedManifest = manifest;
}
