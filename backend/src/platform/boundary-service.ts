import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadGovernanceArtifact } from './governance-loader.js';
import type { BoundaryRegistry } from './governance-schemas.js';

export interface BoundaryValidationCheck { id: string; valid: boolean; evidence: string }
export interface BoundaryValidationResult { valid: boolean; checks: readonly BoundaryValidationCheck[]; errors: readonly string[]; networkRequestPerformed: false }
export interface BoundarySummary { internalModules: number; databaseObjects: number; publicApis: number; publicEvents: number; consumedGlobalApis: number; consumedGlobalEvents: number; forbiddenDependencies: number; forbiddenDatabaseAccess: number; externalProviders: number; allowedNetworkDestinations: number; validationStatus: 'VALID' | 'INVALID' }

function root(): string { return process.cwd().endsWith('backend') ? resolve(process.cwd(), '..') : process.cwd(); }
async function exists(path: string): Promise<boolean> { try { await access(resolve(root(), path)); return true; } catch { return false; } }
async function text(path: string): Promise<string> { return readFile(resolve(root(), path), 'utf8'); }
export async function getBoundaryRegistry(): Promise<BoundaryRegistry> { return loadGovernanceArtifact('boundaries'); }

export async function validateBoundaryRegistry(): Promise<BoundaryValidationResult> {
  const registry = await getBoundaryRegistry();
  const [platformRoutes, healthRoutes, registrationRoutes, prisma, backendPackage, frontendPackage, docs] = await Promise.all([text('backend/src/platform/routes.ts'), text('backend/src/health/routes.ts'), text('backend/src/registration/routes.ts'), text('backend/prisma/schema.prisma'), text('backend/package.json'), text('frontend/package.json'), text(registry.documentation)]);
  const routeSources: Record<string, string> = { 'backend/src/platform/routes.ts': platformRoutes, 'backend/src/health/routes.ts': healthRoutes, 'backend/src/registration/routes.ts': registrationRoutes };
  const moduleChecks = await Promise.all(registry.platformInternalModules.map(async (item) => ({ id: `MODULE_${item.id}`, valid: await exists(item.origin), evidence: item.origin })));
  const apiChecks = registry.platformPublicApis.map((api) => ({ id: `API_${api.path}`, valid: routeSources[api.origin]?.includes(`'${api.path}'`) ?? false, evidence: api.origin }));
  const ownershipChecks = registry.platformOwnedDatabaseObjects.map((item) => ({ id: `DATABASE_${item.name}`, valid: prisma.includes(`model ${item.prismaModel}`) && prisma.includes(`@@map("${item.name}")`), evidence: item.origin }));
  const packageNames = [backendPackage, frontendPackage].flatMap((value) => {
    const manifest = JSON.parse(value) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    return [...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.devDependencies ?? {})];
  });
  const checks = [...moduleChecks, ...apiChecks, ...ownershipChecks,
    { id: 'NO_GOOGLE_OR_YOUTUBE_SDK', valid: packageNames.every((name) => !/(^|[/_-])(googleapis|youtube|google-auth-library)([/_-]|$)/i.test(name)), evidence: 'backend/package.json + frontend/package.json dependencies' },
    { id: 'NO_GLOBAL_SOURCE_PACKAGE', valid: packageNames.every((name) => !/@aiarbitech\/global/i.test(name)), evidence: 'backend/package.json + frontend/package.json dependencies' },
    { id: 'PUBLIC_EVENTS_EMPTY', valid: registry.platformPublicEvents.length === 0 && !/\.(publish|emit)\(/.test(`${platformRoutes}\n${healthRoutes}\n${registrationRoutes}`), evidence: 'backend/src/**/*routes.ts' },
    { id: 'EXTERNAL_PROVIDERS_EMPTY', valid: registry.externalProviders.length === 0, evidence: 'governance/platform-boundary-registry.v1.json' },
    { id: 'NETWORK_DESTINATIONS_EMPTY', valid: registry.allowedNetworkDestinations.length === 0, evidence: 'governance/platform-boundary-registry.v1.json' },
    ...['Platform Internal Modules', 'Platform-Owned Database Objects', 'Platform Public APIs', 'Platform Public Events', 'Consumed Global APIs', 'Consumed Global Events', 'Forbidden Dependencies', 'Forbidden Database Access', 'External Providers', 'Allowed Network Destinations'].map((heading) => ({ id: `DOC_${heading.toUpperCase().replace(/[^A-Z]+/g, '_')}`, valid: docs.includes(`## ${heading}`), evidence: registry.documentation })),
  ];
  return { valid: checks.every((check) => check.valid), checks, errors: checks.filter((check) => !check.valid).map((check) => check.id), networkRequestPerformed: false };
}

export async function getBoundarySummary(): Promise<BoundarySummary> {
  const [registry, validation] = await Promise.all([getBoundaryRegistry(), validateBoundaryRegistry()]);
  return { internalModules: registry.platformInternalModules.length, databaseObjects: registry.platformOwnedDatabaseObjects.length, publicApis: registry.platformPublicApis.length, publicEvents: registry.platformPublicEvents.length, consumedGlobalApis: registry.consumedGlobalApis.length, consumedGlobalEvents: registry.consumedGlobalEvents.length, forbiddenDependencies: registry.forbiddenDependencies.length, forbiddenDatabaseAccess: registry.forbiddenDatabaseAccess.length, externalProviders: registry.externalProviders.length, allowedNetworkDestinations: registry.allowedNetworkDestinations.length, validationStatus: validation.valid ? 'VALID' : 'INVALID' };
}