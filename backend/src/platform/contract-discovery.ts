import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { loadGovernanceArtifact } from './governance-loader.js';

const localContractSchema = z.object({ contractVersion: z.string().min(1), status: z.string().min(1), title: z.string().min(1) }).passthrough();
function root(): string { return process.cwd().endsWith('backend') ? resolve(process.cwd(), '..') : process.cwd(); }
async function inspect(kind: 'api' | 'events', file: string) {
  const path = resolve(root(), 'contracts', kind, file);
  const contract = localContractSchema.parse(JSON.parse(await readFile(path, 'utf8')) as unknown);
  const authoritative = contract.status === 'VERIFIED';
  return {
    kind: kind === 'api' ? 'GLOBAL_API' : 'GLOBAL_EVENT',
    localContract: `contracts/${kind}/${file}`,
    discoveredVersion: contract.contractVersion,
    localStatus: contract.status,
    authoritativeContractStatus: authoritative ? 'AVAILABLE' : 'AUTHORITATIVE CONTRACT NOT AVAILABLE',
    compatibility: authoritative ? 'NOT_VERIFIED' : 'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT',
    evidenceStatus: 'VERIFIED', confidence: 'HIGH', origin: `contracts/${kind}/${file}`,
    decisionClassification: 'LOCAL_CONTRACT_DISCOVERY',
  } as const;
}
export async function discoverContractCompatibility() {
  const [api, events, dependencies] = await Promise.all([
    inspect('api', 'global-ecosystem-api.v1.json'), inspect('events', 'global-ecosystem-events.v1.json'), loadGovernanceArtifact('dependencies'),
  ]);
  return {
    artifactType: 'COMPATIBILITY_MATRIX', schemaVersion: '1.0.0', generatedFromLocalEvidenceOnly: true,
    networkRequestPerformed: false, overallCompatibility: 'NOT_VERIFIED', matrix: [api, events],
    missingContractsReport: { status: 'INCOMPLETE', items: dependencies.missingContracts },
    versionReport: { requiredApiVersion: dependencies.globalApis[0]?.requiredVersion ?? 'NOT_VERIFIED', discoveredApiVersion: api.discoveredVersion, requiredEventVersion: dependencies.globalEvents[0]?.requiredVersion ?? 'NOT_VERIFIED', discoveredEventVersion: events.discoveredVersion },
    evidence: { status: 'VERIFIED', confidence: 'HIGH', origin: ['contracts/api/global-ecosystem-api.v1.json', 'contracts/events/global-ecosystem-events.v1.json', 'governance/platform-dependencies.v1.json'], decisionClassification: 'COMPATIBILITY_BLOCKED_BY_MISSING_AUTHORITY' },
  } as const;
}
