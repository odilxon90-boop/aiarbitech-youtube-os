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
const boundaryInventoryItem = z.object({ id: z.string().min(1), classification: z.string().min(1), status: z.string().min(1), origin: z.string().min(1) }).strict();
const databaseBoundaryItem = z.object({ name: z.string().min(1), prismaModel: z.string().min(1), classification: z.literal('PLATFORM_OWNED'), status: z.literal('DECLARED'), origin: z.string().min(1) }).strict();
const publicApiBoundary = z.object({ method: z.literal('GET'), path: z.string().startsWith('/api/v1/'), origin: z.string().min(1) }).strict();
const globalContractBoundary = z.object({ id: z.string().min(1), direction: z.enum(['CONSUMED_API', 'CONSUMED_EVENT']), status: z.literal('AUTHORITATIVE_CONTRACT_NOT_AVAILABLE'), origin: z.string().min(1) }).strict();
export const boundaryRegistrySchema = z.object({ ...header, artifactType: z.literal('PLATFORM_BOUNDARY_REGISTRY'), platformId: z.literal('PLATFORM_YOUTUBE_OS'), currentSprint: z.literal('AAT-YTOS-SPRINT-0.0.4'), platformInternalModules: z.array(boundaryInventoryItem).min(1), platformOwnedDatabaseObjects: z.array(databaseBoundaryItem), platformPublicApis: z.array(publicApiBoundary).min(1), platformPublicEvents: z.array(z.string().min(1)), consumedGlobalApis: z.array(globalContractBoundary), consumedGlobalEvents: z.array(globalContractBoundary), forbiddenDependencies: z.array(z.string().min(1)).min(1), forbiddenDatabaseAccess: z.array(z.string().min(1)).min(1), externalProviders: z.array(boundaryInventoryItem).max(0), allowedNetworkDestinations: z.array(boundaryInventoryItem).max(0), documentation: z.literal('docs/PLATFORM_BOUNDARIES.md'), evidence }).strict();
export const featureRegistrySchema = z.object({ ...header, artifactType: z.literal('FEATURE_REGISTRY'), features: z.array(registryItem), evidence }).strict();
export const capabilityLifecycleValues = ['REGISTERED', 'PLANNED', 'AUTHORIZED', 'NOT_IMPLEMENTED', 'IMPLEMENTED', 'VERIFIED', 'DEPRECATED'] as const;
export const capabilityRecordSchema = z.object({
  capabilityId: z.string().regex(/^[A-Z][A-Z0-9_]*$/), capabilityName: z.string().min(1), capabilityDescription: z.string().min(1),
  capabilityCategory: z.enum(['FOUNDATION_GOVERNANCE', 'GLOBAL_DEPENDENCY', 'YOUTUBE_BUSINESS']), capabilityOwner: z.enum(['PLATFORM', 'GLOBAL_ECOSYSTEM']),
  platformId: z.literal('PLATFORM_YOUTUBE_OS'), currentStatus: z.enum(['AVAILABLE', 'NOT_VERIFIED']), lifecycleStatus: z.enum(capabilityLifecycleValues), version,
  evidenceStatus: z.enum(['VERIFIED', 'NOT_VERIFIED']), confidenceLevel: z.enum(['HIGH', 'MEDIUM', 'LOW']), origin: z.array(z.string().min(1)).min(1),
  dependencies: z.array(z.string().min(1)), requiredGlobalServices: z.array(z.string().min(1)), requiredContracts: z.array(z.string().min(1)),
  implementationStatus: z.enum(['IMPLEMENTED', 'NOT_IMPLEMENTED']), certificationStatus: z.enum(['CERTIFIED', 'NOT_VERIFIED']), lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).strict().superRefine((capability, context) => {
  if (capability.implementationStatus === 'IMPLEMENTED' && capability.evidenceStatus !== 'VERIFIED') context.addIssue({ code: z.ZodIssueCode.custom, path: ['evidenceStatus'], message: 'IMPLEMENTED capabilities require VERIFIED repository evidence.' });
  if (capability.lifecycleStatus === 'VERIFIED' && capability.evidenceStatus !== 'VERIFIED') context.addIssue({ code: z.ZodIssueCode.custom, path: ['evidenceStatus'], message: 'VERIFIED lifecycle status requires VERIFIED repository evidence.' });
  if (capability.capabilityCategory === 'YOUTUBE_BUSINESS' && capability.implementationStatus !== 'NOT_IMPLEMENTED') context.addIssue({ code: z.ZodIssueCode.custom, path: ['implementationStatus'], message: 'YouTube business capabilities must remain NOT_IMPLEMENTED.' });
});
export const capabilityRegistrySchema = z.object({ ...header, artifactType: z.literal('CAPABILITY_REGISTRY'), platformId: z.literal('PLATFORM_YOUTUBE_OS'), capabilities: z.array(capabilityRecordSchema).min(1), evidence }).strict().superRefine((registry, context) => {
  const ids = new Set<string>(); registry.capabilities.forEach((capability, index) => { if (ids.has(capability.capabilityId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['capabilities', index, 'capabilityId'], message: `Duplicate capability ID: ${capability.capabilityId}` }); ids.add(capability.capabilityId); });
});
export const knowledgeRegistrySchema = z.object({ ...header, artifactType: z.literal('KNOWLEDGE_REGISTRY'), knowledge: z.array(registryItem), evidence }).strict();
export const aiPolicyRegistrySchema = z.object({ ...header, artifactType: z.literal('AI_POLICY_REGISTRY'), policies: z.array(registryItem), evidence }).strict();
const governanceArtifactName = z.enum(['passport', 'boundaries', 'features', 'capabilities', 'knowledge', 'aiPolicies', 'dependencies', 'registrationReadiness']);
export const healthManifestSchema = z.object({ ...header, artifactType: z.literal('PLATFORM_HEALTH_MANIFEST'), currentGate: z.literal('GATE_0B'), currentSprint: z.literal('AAT-YTOS-SPRINT-0.0.3'), currentPhase: z.string().min(1), requiredGovernanceArtifacts: z.array(governanceArtifactName).min(1), requiredRepositoryFiles: z.array(z.string().min(1)).min(1), evidence }).strict();
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
export type CapabilityRecord = z.infer<typeof capabilityRecordSchema>;
export type CapabilityRegistry = z.infer<typeof capabilityRegistrySchema>;
export type BoundaryRegistry = z.infer<typeof boundaryRegistrySchema>;
