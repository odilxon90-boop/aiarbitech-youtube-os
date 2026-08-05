export interface PlatformManifest { platformId:'PLATFORM_YOUTUBE_OS'; platformName:string; platformVersion:string; architectureModel:'INDEPENDENT_PLATFORM_SERVICE'; integrationModel:'API_AND_EVENT_CONTRACTS'; deploymentModel:'INDEPENDENT'; dataOwnership:'PLATFORM_OWNED'; repositoryType:'INDEPENDENT'; globalDatabaseAccess:'PROHIBITED'; crossPlatformDatabaseAccess:'PROHIBITED'; status:'FOUNDATION_INITIALIZED'; globalEcosystemCompatibility:{ overall:'NOT_VERIFIED'; capabilities:readonly CapabilityCompatibility[] } }
export interface CapabilityCompatibility { name:string; compatibility:'NOT_VERIFIED' }
export interface HealthStatus { live:'ALIVE'|'UNKNOWN'; ready:'READY'|'UNKNOWN'; environment:'VALID'|'UNKNOWN' }
export type ConnectionCompatibility='NOT_CONFIGURED'|'NOT_VERIFIED'|'COMPATIBLE'|'INCOMPATIBLE';
export interface GlobalEcosystemConnectionStatus { integrationConfigured:boolean; networkRequestPerformed:boolean; status:ConnectionCompatibility; contractVersion:'v1'; capabilities:readonly CapabilityCompatibility[] }
export interface EvidenceMetadata { status:string; confidence:string; origin:readonly string[]; decisionClassification:string }
export interface GovernanceArtifact { artifactType:string; artifactVersion?:string; schemaVersion:string; evidence?:EvidenceMetadata; [key:string]:unknown }
export interface ContractCompatibility extends GovernanceArtifact { overallCompatibility:string; networkRequestPerformed:boolean; matrix:readonly Record<string,unknown>[]; missingContractsReport:{ status:string; items:readonly string[] }; versionReport:Record<string,string> }
export interface Gate0BGovernance { passport:GovernanceArtifact; features:GovernanceArtifact; capabilities:GovernanceArtifact; knowledge:GovernanceArtifact; aiPolicies:GovernanceArtifact; boundaries:GovernanceArtifact; healthManifest:GovernanceArtifact; registrationReadiness:GovernanceArtifact; contractCompatibility:ContractCompatibility; dependencies:GovernanceArtifact }
export type RegistrationStatus='NOT_REGISTERED'|'READY'|'BLOCKED'|'REGISTERED';
export interface RegistrationEvidence { status:'VERIFIED'|'NOT_VERIFIED'; confidence:'HIGH'|'MEDIUM'|'LOW'; origin:readonly string[] }
export interface RegistrationMetadata { platformId:string; platformName:string; platformVersion:string; currentGate:string; currentSprint:string; currentPhase:string; compatibilityStatus:'VERIFIED'|'NOT_VERIFIED'; registrationMode:'LOCAL_ONLY'; evidence:RegistrationEvidence }
export interface RegistrationReadiness { ready:boolean; status:RegistrationStatus; blockingItems:readonly string[]; evidence:RegistrationEvidence }
export interface RegistrationSummary { status:RegistrationStatus; readiness:RegistrationReadiness; metadata:RegistrationMetadata }
export interface PlatformFoundationStatus { manifest:PlatformManifest; health:HealthStatus; connection:GlobalEcosystemConnectionStatus; governance:Gate0BGovernance; registration:RegistrationSummary }
