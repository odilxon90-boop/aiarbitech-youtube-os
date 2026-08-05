import { GovernanceCard } from './GovernanceCard';
import type { Gate0BGovernance } from './types';
export function Gate0BDashboard({governance}: {governance:Gate0BGovernance}) { const cards=[
 ['Platform Passport',governance.passport,'Verified platform identity, ownership and registration identifiers.',['platformId','currentGate','currentSprint','compatibility']],
 ['Feature Registry',governance.features,'Versioned feature scope with prohibited business work held NOT_IMPLEMENTED.',['artifactVersion','features']],
 ['Capability Registry',governance.capabilities,'Ownership and compatibility status for platform and Global Ecosystem capabilities.',['artifactVersion','capabilities']],
 ['Knowledge Registry',governance.knowledge,'Repository evidence and explicitly missing authoritative knowledge.',['artifactVersion','knowledge']],
 ['AI Policy Registry',governance.aiPolicies,'Gate 0B deny policies; no AI runtime or requests are present.',['artifactVersion','policies']],
 ['Platform Boundary Registry',governance.boundaries,'Owned modules, APIs, data objects and prohibited dependencies.',['platformInternalModules','platformPublicApis','forbiddenDependencies','forbiddenDatabaseAccess']],
 ['Platform Health Manifest',governance.healthManifest,'Evidence-based compliance, health, completion and readiness scores.',['architectureComplianceScore','repositoryHealthScore','foundationCompletion','overallReadiness']],
 ['Registration Readiness',governance.registrationReadiness,'Enterprise registration state and remaining blockers.',['status','readinessPercent','enterpriseRegistrationComplete','sprint0Authorized']],
 ['Contract Compatibility',governance.contractCompatibility,'Local-only discovery; authoritative Global contracts remain unavailable.',['overallCompatibility','matrix','missingContractsReport','networkRequestPerformed']],
 ['Dependency Declaration',governance.dependencies,'Required Global APIs/events, versions and missing contracts.',['globalApis','globalEvents','missingContracts','networkContactPerformed']],
 ] as const; return <>{cards.map(([title,artifact,summary,highlights])=><GovernanceCard key={title} title={title} artifact={artifact} summary={summary} highlights={highlights}/>)}</> }
