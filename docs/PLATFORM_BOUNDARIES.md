# Platform Boundaries

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
