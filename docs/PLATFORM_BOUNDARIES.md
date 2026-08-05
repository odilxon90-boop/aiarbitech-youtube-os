# Platform Boundaries

`governance/platform-boundary-registry.v1.json` is the authoritative, schema-validated, read-only inventory for Sprint `AAT-YTOS-SPRINT-0.0.4`. Entries require a repository origin. Missing evidence is not inferred.

## Boundary Classification

Boundaries are classified as platform-internal modules, platform-owned persistence, public platform contracts, consumed Global contracts, prohibited dependencies or database access, external providers, and allowed network destinations. Classification documents architecture only and does not activate runtime behavior.

## Platform Internal Modules

Only tracked foundation modules with an existing repository path are registered. Business modules are absent because no business runtime is authorized.

## Platform-Owned Database Objects

`PlatformRuntimeMetadata`, mapped to `platform_runtime_metadata`, is the sole Prisma model. It contains independent platform infrastructure metadata; no business model is present.

## Platform Public APIs

The registry lists every repository-declared Fastify endpoint. Every registered method is `GET`. Boundary registry resources are `/api/v1/platform/boundaries`, `/summary`, and `/validation`.

## Platform Public Events

Empty. No event publication declaration or runtime exists.

## Consumed Global APIs

`GLOBAL_ECOSYSTEM_API_V1` remains `AUTHORITATIVE_CONTRACT_NOT_AVAILABLE`. The local adapter is a mock contract boundary and performs no network request.

## Consumed Global Events

`GLOBAL_ECOSYSTEM_EVENTS_V1` remains `AUTHORITATIVE_CONTRACT_NOT_AVAILABLE`. No event consumer is activated.

## Forbidden Dependencies

Global source imports/package links, Global service duplication, unapproved provider SDKs, YouTube business runtime, and unversioned cross-platform integration are prohibited. Package manifests are validated for prohibited Google/YouTube and Global source dependencies.

## Forbidden Database Access

Global Ecosystem database access, cross-platform database access, and shared Prisma clients are prohibited. Only the platform-owned Prisma schema may define owned data.

## External Providers

Empty. No external provider package or integration is registered.

## Allowed Network Destinations

Empty. No outbound destination is approved or activated.

## Boundary Validation Rules

Validation checks schema strictness, module origin existence, API path inventory, Prisma model/table ownership, dependency integrity, absence of public event publication, empty external/network boundaries, and required documentation sections. Validation reads local files only and reports `networkRequestPerformed: false`.

## Dependency Rules

Cross-platform integration requires an authoritative versioned API/event contract. A declaration with unavailable contract status is not permission to call a service.

## Ownership Rules

YouTube OS owns this repository, deployment, frontend/backend foundation, governance artifacts, and its metadata table. Global services and databases remain outside this ownership boundary.

## Network Boundary Definitions

An allowed network destination requires explicit future authorization and repository evidence. Environment placeholders do not constitute approval and therefore are not registry entries.

## Owned by YouTube OS

- Independent repository, release, and deployment lifecycle.
- Frontend shell and backend platform API.
- Platform-owned PostgreSQL schema.
- Platform-specific business logic and data introduced only after Gate 0.
- Adapters implementing approved Global Ecosystem contracts.

## Owned by the Global Ecosystem

Identity, authentication, authorization, RBAC/ABAC, security, audit, AI President Core, Global AI Core, workflow, notifications, billing, subscriptions, payments, the single Global Wallet, centralized financial infrastructure, centralized media management, monitoring, configuration, feature flags, and service registry.

YouTube OS declares dependencies on these capabilities. It does not reimplement them.

Enterprise policy constraints include:

- Platform wallets are prohibited.
- Platform-specific advertising governance is prohibited.
- Affiliate Marketing applies only to paid subscriptions and uses the approved 30% commission.
- Standard Users require a minimum eight-character password.
- Executive Roles require enhanced password requirements and mandatory MFA.
- The President Panel remains strategic; operational tasks are delegated, AI automation is preferred, and admin panels handle operational exceptions.
- Repetitive manual operations shall be automated whenever practical.

## Data boundary

- `globalDatabaseAccess`: `PROHIBITED`
- `crossPlatformDatabaseAccess`: `PROHIBITED`
- YouTube OS Prisma models must represent only platform-owned data.
- Cross-platform state is exchanged only through approved API and event contracts.

## Feature boundary

No channel, video, publishing, revenue, analytics, or other YouTube business feature is authorized in the foundation phase.

Enterprise Media Governance does not authorize media business runtime. Any future media capability must use centralized Media Management and remain subject to a separately authorized sprint.

## Change and evolution boundary

- Changes require a Change Request, Architecture Registry traceability, sprint authorization, and Enterprise Audit workflow.
- Enterprise Evolution & Stability, Architecture Protection, Future Compatibility & Extensibility, and Architectural Integrity policies apply to future evolution.
- These policies do not permit repository coupling, shared deployment, shared databases, direct database access, or unversioned integration.

## Registry and classification boundary

- The Future Platform Registry includes AIArbiTech YouTube OS, AI Arbitrage Platform, AI Market Pulse Scalper, AI Video Creator Studio, and AIArbiTech TV Global Media.
- AI Arbitrage Platform is Critical Class A.
- AI Market Pulse Scalper is Critical Class B.
- Future registry inclusion and critical classification do not imply implementation or registration execution in this repository.
