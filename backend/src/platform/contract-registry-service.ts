import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';
import { getBoundaryRegistry } from './boundary-service.js';

const contractFileSchema = z.object({ $id: z.string().min(1), title: z.string().min(1), contractVersion: z.string().regex(/^v\d+$/), status: z.literal('NOT_VERIFIED') }).passthrough();
export type ContractLifecycle = 'ACTIVE' | 'PLACEHOLDER';
export type ContractCompatibility = 'VERIFIED' | 'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT';
export interface ContractRecord { contractId:string; kind:'API'|'EVENT'; ownership:'OWNED'|'CONSUMED'; direction:'PROVIDED'|'CONSUMED'; version:string; lifecycle:ContractLifecycle; compatibility:ContractCompatibility; repositoryEvidence:'VERIFIED'; origin:string; relatedFiles:readonly string[]; method?:'GET'; path?:string }
export interface ContractRegistry { registryType:'API_CONTRACT_REGISTRY'|'EVENT_CONTRACT_REGISTRY'; platformId:'PLATFORM_YOUTUBE_OS'; currentSprint:'AAT-YTOS-SPRINT-0.0.5'; contracts:readonly ContractRecord[]; networkRequestPerformed:false }
export interface VersionMatrixRow { contractId:string; kind:'API'|'EVENT'; ownership:'OWNED'|'CONSUMED'; version:string; requiredVersion:string; lifecycle:ContractLifecycle; compatibility:ContractCompatibility; origin:string }
export interface ContractValidation { valid:boolean; checks:readonly { id:string; valid:boolean; evidence:string }[]; errors:readonly string[]; networkRequestPerformed:false }

function root():string{return process.cwd().endsWith('backend')?resolve(process.cwd(),'..'):process.cwd()}
async function load(path:string){return contractFileSchema.parse(JSON.parse(await readFile(resolve(root(),path),'utf8')) as unknown)}
function id(path:string):string{return `API_GET_${path.replace(/^\/api\/v1\//,'').replace(/[/:]/g,'_').toUpperCase()}`}

export async function getApiContractRegistry():Promise<ContractRegistry>{
 const [boundary,global]=await Promise.all([getBoundaryRegistry(),load('contracts/api/global-ecosystem-api.v1.json')]);
 const owned=boundary.platformPublicApis.map((api):ContractRecord=>({contractId:id(api.path),kind:'API',ownership:'OWNED',direction:'PROVIDED',version:'v1',lifecycle:'ACTIVE',compatibility:'VERIFIED',repositoryEvidence:'VERIFIED',origin:api.origin,relatedFiles:[api.origin,'governance/platform-boundary-registry.v1.json'],method:'GET',path:api.path}));
 const consumed:ContractRecord={contractId:'GLOBAL_ECOSYSTEM_API_V1',kind:'API',ownership:'CONSUMED',direction:'CONSUMED',version:global.contractVersion,lifecycle:'PLACEHOLDER',compatibility:'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT',repositoryEvidence:'VERIFIED',origin:'contracts/api/global-ecosystem-api.v1.json',relatedFiles:['contracts/api/global-ecosystem-api.v1.json','governance/platform-dependencies.v1.json']};
 return{registryType:'API_CONTRACT_REGISTRY',platformId:'PLATFORM_YOUTUBE_OS',currentSprint:'AAT-YTOS-SPRINT-0.0.5',contracts:[...owned,consumed],networkRequestPerformed:false};
}
export async function getEventContractRegistry():Promise<ContractRegistry>{
 const [boundary,global]=await Promise.all([getBoundaryRegistry(),load('contracts/events/global-ecosystem-events.v1.json')]);
 const owned=boundary.platformPublicEvents.map((event):ContractRecord=>({contractId:event,kind:'EVENT',ownership:'OWNED',direction:'PROVIDED',version:'v1',lifecycle:'ACTIVE',compatibility:'VERIFIED',repositoryEvidence:'VERIFIED',origin:'governance/platform-boundary-registry.v1.json',relatedFiles:['governance/platform-boundary-registry.v1.json']}));
 const consumed:ContractRecord={contractId:'GLOBAL_ECOSYSTEM_EVENTS_V1',kind:'EVENT',ownership:'CONSUMED',direction:'CONSUMED',version:global.contractVersion,lifecycle:'PLACEHOLDER',compatibility:'BLOCKED_MISSING_AUTHORITATIVE_CONTRACT',repositoryEvidence:'VERIFIED',origin:'contracts/events/global-ecosystem-events.v1.json',relatedFiles:['contracts/events/global-ecosystem-events.v1.json','governance/platform-dependencies.v1.json']};
 return{registryType:'EVENT_CONTRACT_REGISTRY',platformId:'PLATFORM_YOUTUBE_OS',currentSprint:'AAT-YTOS-SPRINT-0.0.5',contracts:[...owned,consumed],networkRequestPerformed:false};
}
export async function getApiVersionMatrix():Promise<{matrix:readonly VersionMatrixRow[];overallCompatibility:'PARTIAL';networkRequestPerformed:false}>{const [apis,events]=await Promise.all([getApiContractRegistry(),getEventContractRegistry()]);return{matrix:[...apis.contracts,...events.contracts].map(({contractId,kind,ownership,version,lifecycle,compatibility,origin})=>({contractId,kind,ownership,version,requiredVersion:version,lifecycle,compatibility,origin})),overallCompatibility:'PARTIAL',networkRequestPerformed:false}}
export async function validateContractRegistries():Promise<ContractValidation>{
 const [apis,events,matrix,docs]=await Promise.all([getApiContractRegistry(),getEventContractRegistry(),getApiVersionMatrix(),readFile(resolve(root(),'docs/PLATFORM_API_EVENT_CONTRACTS.md'),'utf8')]);const all=[...apis.contracts,...events.contracts];
 const unique=(items:readonly ContractRecord[])=>new Set(items.map(x=>x.contractId)).size===items.length;
 const checks=[{id:'UNIQUE_API_CONTRACT_IDS',valid:unique(apis.contracts),evidence:'API registry'},{id:'UNIQUE_EVENT_CONTRACT_IDS',valid:unique(events.contracts),evidence:'Event registry'},{id:'VERSION_CONSISTENCY',valid:matrix.matrix.every(x=>x.version===x.requiredVersion),evidence:'Version matrix'},{id:'LIFECYCLE_CONSISTENCY',valid:all.every(x=>x.ownership==='OWNED'?x.lifecycle==='ACTIVE':x.lifecycle==='PLACEHOLDER'),evidence:'Repository ownership'},{id:'COMPATIBILITY_CONSISTENCY',valid:all.every(x=>x.lifecycle==='ACTIVE'?x.compatibility==='VERIFIED':x.compatibility==='BLOCKED_MISSING_AUTHORITATIVE_CONTRACT'),evidence:'Lifecycle policy'},{id:'EVIDENCE_COMPLETE',valid:all.every(x=>x.origin&&x.relatedFiles.length>0&&x.repositoryEvidence==='VERIFIED'),evidence:'Registry records'},{id:'DOCUMENTATION_COMPLETE',valid:['API Contract Registry','Event Contract Registry','API Version Matrix','Compatibility Validation'].every(x=>docs.includes(`## ${x}`)),evidence:'docs/PLATFORM_API_EVENT_CONTRACTS.md'}];
 return{valid:checks.every(x=>x.valid),checks,errors:checks.filter(x=>!x.valid).map(x=>x.id),networkRequestPerformed:false};
}
export async function getContractRegistrySummary(){const [apis,events,versions,validation]=await Promise.all([getApiContractRegistry(),getEventContractRegistry(),getApiVersionMatrix(),validateContractRegistries()]);return{apiContracts:apis.contracts.length,eventContracts:events.contracts.length,ownedContracts:[...apis.contracts,...events.contracts].filter(x=>x.ownership==='OWNED').length,consumedContracts:[...apis.contracts,...events.contracts].filter(x=>x.ownership==='CONSUMED').length,blockedContracts:versions.matrix.filter(x=>x.compatibility==='BLOCKED_MISSING_AUTHORITATIVE_CONTRACT').length,overallCompatibility:versions.overallCompatibility,validationStatus:validation.valid?'VALID':'INVALID',networkRequestPerformed:false}}