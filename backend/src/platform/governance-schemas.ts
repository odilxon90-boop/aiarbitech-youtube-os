import { z } from 'zod';

const version = z.string().regex(/^\d+\.\d+\.\d+$/);
const evidence = z.object({
  status: z.enum(['VERIFIED', 'NOT_VERIFIED']),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  origin: z.array(z.string().min(1)).min(1),
  decisionClassification: z.string().min(1),
}).strict();
const header = {
  schemaVersion: version,
  artifactType: z.string().min(1),
  artifactVersion: version,
};
const evidenceRecord = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export const platformPassportSchema = z.object({
  ...header,
  artifactType: z.literal('PLATFORM_PASSPORT'),
  platformId: z.literal('PLATFORM_YOUTUBE_OS'),
  platformName: z.string().min(1),
  platformVersion: version,
  repository: z.object({ name: z.literal('aiarbitech-youtube-os'), type: z.literal('INDEPENDENT'), defaultBranch: z.literal('main'), remote: z.string().url() }).strict(),
  architectureModel: z.literal('INDEPENDENT_PLATFORM_SERVICE'),
  integrationModel: z.literal('API_AND_EVENT_CONTRACTS'),
  deploymentModel: z.literal('INDEPENDENT'),
  dataOwnership: z.literal('PLATFORM_OWNED'),
  globalDatabaseAccess: z.literal('PROHIBITED'),
  crossPlatformDatabaseAccess: z.literal('PROHIBITED'),
  enterpriseRegistrationId: z.string(), serviceRegistryId: z.string(), compatibility: z.string(),
  currentGate: z.literal('GATE_0B'), currentSprint: z.string(), currentPhase: z.string(), evidence,
}).strict();

const registryItem = evidenceRecord;
export const boundaryRegistrySchema = z.object({ ...header, artifactType: z.literal('PLATFORM_BOUNDARY_REGISTRY'), platformInternalModules: z.array(registryItem), platformOwnedDatabaseObjects: z.array(registryItem), platformPublicApis: z.array(z.string()), platformPublicEvents: z.array(z.string()), platformPublicEventsStatus: z.string(), consumedGlobalApis: z.array(registryItem), consumedGlobalEvents: z.array(registryItem), forbiddenDependencies: z.array(z.string()), forbiddenDatabaseAccess: z.array(z.string()), externalProviders: z.array(z.string()), externalProvidersStatus: z.string(), allowedNetworkDestinations: z.array(registryItem), evidence }).strict();
export const featureRegistrySchema = z.object({ ...header, artifactType: z.literal('FEATURE_REGISTRY'), features: z.array(registryItem), evidence }).strict();
export const capabilityRegistrySchema = z.object({ ...header, artifactType: z.literal('CAPABILITY_REGISTRY'), capabilities: z.array(registryItem), evidence }).strict();
export const knowledgeRegistrySchema = z.object({ ...header, artifactType: z.literal('KNOWLEDGE_REGISTRY'), knowledge: z.array(registryItem), evidence }).strict();
export const aiPolicyRegistrySchema = z.object({ ...header, artifactType: z.literal('AI_POLICY_REGISTRY'), policies: z.array(registryItem), evidence }).strict();
const score = z.object({ value: z.number().min(0).max(100), basis: z.string().min(1), status: z.literal('VERIFIED') }).strict();
export const healthManifestSchema = z.object({ ...header, artifactType: z.literal('PLATFORM_HEALTH_MANIFEST'), architectureComplianceScore: score, repositoryHealthScore: score, foundationCompletion: score, currentGate: z.literal('GATE_0B'), currentSprint: z.string(), currentPhase: z.string(), overallReadiness: score, evidence }).strict();
export const dependencyDeclarationSchema = z.object({ ...header, artifactType: z.literal('PLATFORM_DEPENDENCY_DECLARATION'), globalApis: z.array(registryItem), globalEvents: z.array(registryItem), missingContracts: z.array(z.string()), networkContactPerformed: z.literal(false), evidence }).strict();
export const registrationReadinessSchema = z.object({ ...header, artifactType: z.literal('REGISTRATION_READINESS'), status: z.string(), readinessPercent: z.number().min(0).max(100), localFoundationReady: z.boolean(), enterpriseRegistrationComplete: z.boolean(), sprint0Authorized: z.literal(false), blockingItems: z.array(z.string()), requiredActions: z.array(z.string()), evidence }).strict();

export const governanceSchemas = {
  passport: platformPassportSchema,
  boundaries: boundaryRegistrySchema,
  features: featureRegistrySchema,
  capabilities: capabilityRegistrySchema,
  knowledge: knowledgeRegistrySchema,
  aiPolicies: aiPolicyRegistrySchema,
  healthManifest: healthManifestSchema,
  dependencies: dependencyDeclarationSchema,
  registrationReadiness: registrationReadinessSchema,
} as const;

export type GovernanceArtifactName = keyof typeof governanceSchemas;
export type PlatformPassport = z.infer<typeof platformPassportSchema>;
