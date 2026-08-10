import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { z } from 'zod';
import { governanceSchemas, type GovernanceArtifactName } from './governance-schemas.js';

const files: Record<GovernanceArtifactName, string> = {
  passport: 'platform-passport.v1.json', boundaries: 'platform-boundary-registry.v1.json',
  features: 'feature-registry.v1.json', capabilities: 'capability-registry.v1.json',
  knowledge: 'knowledge-registry.v1.json', aiPolicies: 'ai-policy-registry.v1.json',
  healthManifest: 'platform-health-manifest.v1.json', dependencies: 'platform-dependencies.v1.json',
  registrationReadiness: 'registration-readiness.v1.json',
};

function repositoryRoot(): string {
  return process.cwd().endsWith('backend') ? resolve(process.cwd(), '..') : process.cwd();
}
function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    Object.values(value).forEach((child) => deepFreeze(child));
  }
  return value;
}
export async function loadGovernanceArtifact<N extends GovernanceArtifactName>(name: N): Promise<Readonly<z.infer<(typeof governanceSchemas)[N]>>> {
  const raw = await readFile(resolve(repositoryRoot(), 'governance', files[name]), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  return deepFreeze(governanceSchemas[name].parse(parsed)) as Readonly<z.infer<(typeof governanceSchemas)[N]>>;
}
export async function loadGovernanceBundle() {
  const names = Object.keys(governanceSchemas) as GovernanceArtifactName[];
  const entries = await Promise.all(names.map(async (name) => [name, await loadGovernanceArtifact(name)] as const));
  return Object.fromEntries(entries) as { [N in GovernanceArtifactName]: Readonly<z.infer<(typeof governanceSchemas)[N]>> };
}
