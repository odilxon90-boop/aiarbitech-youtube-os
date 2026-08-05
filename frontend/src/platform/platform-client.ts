import type { CapabilityRegistry, ContractCompatibility, Gate0BGovernance, GlobalEcosystemConnectionStatus, GovernanceArtifact, HealthStatus, PlatformBoundaryRegistry, PlatformFoundationStatus, PlatformHealthManifest, PlatformManifest, RegistrationSummary } from './types';
interface ApiEnvelope<T>{data:T;meta:{correlationId:string;timestamp:string}}
interface ReadyResponse{status:'READY';checks:{environment:'VALID';platformManifest:'AVAILABLE';globalEcosystem:'NOT_CONFIGURED'|'NOT_VERIFIED'}}
interface LiveResponse{status:'ALIVE'}
export interface PlatformFoundationClient{loadFoundationStatus(signal?:AbortSignal):Promise<PlatformFoundationStatus>}
export class HttpPlatformFoundationClient implements PlatformFoundationClient{
 constructor(private readonly baseUrl:string){}
 private async get<T>(path:string,signal?:AbortSignal):Promise<T>{const response=await fetch(`${this.baseUrl}${path}`,{method:'GET',headers:{Accept:'application/json'},...(signal?{signal}:{})});if(!response.ok)throw new Error(`Platform API returned ${response.status}`);return ((await response.json()) as ApiEnvelope<T>).data}
 async loadFoundationStatus(signal?:AbortSignal):Promise<PlatformFoundationStatus>{
  const paths={passport:'/platform/passport',features:'/platform/features',capabilities:'/platform/capabilities',knowledge:'/platform/knowledge',aiPolicies:'/platform/ai-policies',boundaries:'/platform/boundaries',healthManifest:'/platform/health-manifest',registrationReadiness:'/platform/registration-readiness',contractCompatibility:'/platform/contracts/compatibility',dependencies:'/platform/dependencies'} as const;
  const [manifest,live,ready,connection,registration,...governanceValues]=await Promise.all([this.get<PlatformManifest>('/platform/manifest',signal),this.get<LiveResponse>('/health/live',signal),this.get<ReadyResponse>('/health/ready',signal),this.get<GlobalEcosystemConnectionStatus>('/platform/compatibility',signal),this.get<RegistrationSummary>('/platform/registration',signal),...Object.values(paths).map((path)=>this.get<GovernanceArtifact>(path,signal))]);
  const keys=Object.keys(paths) as (keyof Gate0BGovernance)[];const governance=Object.fromEntries(keys.map((key,index)=>[key,governanceValues[index]])) as unknown as Gate0BGovernance;governance.capabilities=governance.capabilities as CapabilityRegistry;governance.boundaries=governance.boundaries as PlatformBoundaryRegistry;governance.healthManifest=governance.healthManifest as PlatformHealthManifest;
  const health:HealthStatus={live:live.status,ready:ready.status,environment:ready.checks.environment};return{manifest,health,connection,registration,governance:{...governance,contractCompatibility:governance.contractCompatibility as ContractCompatibility}};
 }
}
export function createPlatformFoundationClient():PlatformFoundationClient{const configuredBaseUrl=import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();return new HttpPlatformFoundationClient(configuredBaseUrl||'/api/v1')}
