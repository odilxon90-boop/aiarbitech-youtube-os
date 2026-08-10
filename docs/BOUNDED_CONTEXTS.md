# Bounded Contexts

AIArbiTech YouTube OS — target bounded-context boundaries.

Status: `PLANNING_ARTIFACT` | Sprint: `AAT-YTOS-SPRINT-0.0.x (unassigned)` | Branch: `main`

## Purpose and scope

This document describes the **intended bounded contexts** of the AIArbiTech YouTube OS
(Platform ID `PLATFORM_YOUTUBE_OS`). It defines, per context: Responsibility, Owned Data,
Public APIs, Published Events, Consumed Global APIs, Consumed Global Events, and Forbidden
Dependencies.

This document is an **architecture and boundaries planning artifact**. It records the
target context graph and the ownership/anti-corruption rules that will govern each context.
It does **not** authorize any runtime. Consistent with `docs/PLATFORM_BOUNDARIES.md`,
none of the YouTube business contexts are implemented, and no YouTube business runtime is
authorized until Gate 0 approval. Each context below is classified as either:

- `FOUNDATION` — an implemented repository surface exists in the foundation phase, or
- `TARGET` — a future target surface. `NOT_IMPLEMENTED`, requires a separately authorized
  sprint. Missing evidence is never inferred.

## Governing invariants

These invariants are inherited verbatim from `docs/ARCHITECTURE.md`,
`docs/PLATFORM_BOUNDARIES.md`, and `governance/platform-boundary-registry.v1.json` and are
binding on every context:

1. The repository, deployment, and database are independent. Direct or shared access to the
   Global Ecosystem database, and cross-platform database access, are `PROHIBITED` for every
   context.
2. Cross-platform integration is permitted only through approved, authenticated, authorized,
   versioned API and event contracts (`API_AND_EVENT_CONTRACTS` model).
3. The following capabilities are owned by the Global Ecosystem and must be **consumed, not
   duplicated**: Identity, Authentication, Authorization, RBAC/ABAC, Security, Audit, AI
   President Core, Global AI Core, Workflow, Notifications, Billing, Subscriptions, Payments,
   the single Global Wallet, centralized financial infrastructure, centralized Media
   Management, Monitoring, Configuration, Feature Flags, and Service Registry.
4. Platform wallets are prohibited. Platform-specific advertising governance is prohibited.
   Affiliate Marketing applies only to paid subscriptions and uses the approved 30%
   commission. Standard Users require a minimum eight-character password; Executive Roles
   require enhanced password controls and mandatory MFA.
5. The President Panel remains strategic. Operational tasks are delegated, AI automation is
   preferred, and Admin panels handle operational exceptions.

## Consumed Global capability legend

The following Global capabilities are referenced below by short name.

| Short name | Owned by | Platform consumption state |
| --- | --- | --- |
| Identity / AuthN / AuthZ / RBAC-ABAC | Global Ecosystem | `BLOCKED` until authoritative contract |
| Security | Global Ecosystem | `BLOCKED` until authoritative contract |
| Audit | Global Ecosystem | `BLOCKED` until authoritative contract |
| AI President Core | Global Ecosystem | `BLOCKED` until authoritative contract |
| Global AI Core | Global Ecosystem | `BLOCKED` until authoritative contract |
| Workflow Engine | Global Ecosystem | `BLOCKED` until authoritative contract |
| Notifications | Global Ecosystem | `BLOCKED` until authoritative contract |
| Billing / Subscription / Payments | Global Ecosystem | `BLOCKED` until authoritative contract |
| Global Wallet / Financial Infra | Global Ecosystem | `BLOCKED` until authoritative contract |
| Media Management | Global Ecosystem | `BLOCKED` until authoritative contract |
| Monitoring / Config / Feature Flags | Global Ecosystem | `BLOCKED` until authoritative contract |
| Service Registry | Global Ecosystem | `BLOCKED` until authoritative contract |

Consumed API/event records remain `AUTHORITATIVE_CONTRACT_NOT_AVAILABLE` according to
`governance/platform-dependencies.v1.json`. A declared dependency with unavailable contract
status is **not** permission to call a service.

## 1. Platform Identity Context

**Classification:** `FOUNDATION`

### Responsibility
Establishes and maintains the YouTube OS **platform's own identity** as an independent
platform service within the AIArbiTechnology Global Ecosystem. Owns the platform manifest,
capability registry, knowledge registry, AI policy registry, health/readiness manifest,
registration and registration-readiness metadata, contract discovery, and compatibility
reporting. It is the single source of truth for "who and what this platform is" and for
whether the platform is ready to appear in the Future Platform Registry.

### Owned Data
- Platform identity and metadata (`PLATFORM_YOUTUBE_OS`, version, architecture model).
- Repository-owned governance artifacts: capability registry, feature registry, knowledge
  registry, platform boundary registry, platform dependencies, AI policy registry, platform
  passport, health manifest, registration-readiness.
- `PlatformRuntimeMetadata` (`platform_runtime_metadata`) — independent platform
  infrastructure metadata; no business model.

### Public APIs
- `FOUNDATION` (implemented, all `GET`): `/api/v1/platform/manifest`, `/api/v1/platform/passport`,
  `/api/v1/platform/boundaries(/)...`, `/api/v1/platform/capabilities(/)...`,
  `/api/v1/platform/features`, `/api/v1/platform/knowledge`, `/api/v1/platform/ai-policies`,
  `/api/v1/platform/health-manifest`, `/api/v1/platform/health/...`,
  `/api/v1/platform/registration(/)...`, `/api/v1/platform/dependencies`,
  `/api/v1/platform/contracts/...`, `/api/v1/platform/compatibility`.
- `TARGET` (future, `NOT_IMPLEMENTED`): `POST /api/v1/platform/registration` — remote
  platform registration submission once authorized.

### Published Events
- `TARGET`: `platform.openflow.registration.submitted` (v1) — emitted when registration is
  submitted for the Future Platform Registry.
- `TARGET`: `platform.openflow.identity.updated` (v1) — emitted when platform manifest
  metadata changes.

### Consumed Global APIs
- `ServiceRegistry` (service registration/lookup) — `BLOCKED` (`AUTHORITATIVE_CONTRACT_NOT_AVAILABLE`).
- `health.check`, `compatibility.check` (from `global-ecosystem-api.v1.json`) — `BLOCKED`.

### Consumed Global Events
- None declared. Registration outcome is expected to arrive over an approved Global event
  contract when it becomes authoritative.

### Forbidden Dependencies
- Duplicating Global Identity or Service Registry.
- Registering as, or impersonating, another platform.
- Claiming remote registration without execution evidence.
- Direct database access to the Global service registry.

## 2. User Management Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Manages the **platform-local representation of users** (creators, executives, admins,
standard users) who interact with YouTube OS: local profiles, preferences, and entitlements
that are specific to the platform experience. Authentication, credentials, and the
authoritative identity/authorization decisions belong to the Global Ecosystem and are
consumed, not recreated.

### Owned Data
- Platform-local user profile and preference records (IDs, display references).
- Cross-reference table linking platform users to Global identity/entitlement references.
- Onboarding state and platform consent/preference records.
- **Not owned:** passwords, credential material, MFA state, global roles/permissions.

### Public APIs
- `TARGET`: `GET/PUT /api/v1/users/me/preferences` — self-service preference management.
- `TARGET`: `GET /api/v1/users` (scoped admin) — local user directory summary.

### Published Events
- `TARGET`: `user.openflow.profile.updated` (v1).
- `TARGET`: `user.openflow.preferences.updated` (v1).

### Consumed Global APIs
- `Identity` / `Authentication` / `Authorization` / `RBAC_ABAC` (verify, entitlements).
- `identity.verify`, `entitlement.verify` (from `global-ecosystem-api.v1.json`) — `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global identity/entitlement lifecycle events (e.g., user.deactivated) once the
  authoritative event contract is available.

### Forbidden Dependencies
- Local authentication, password storage, MFA, or session management.
- Local RBAC/ABAC or role/permission stores (Global-owned).
- Direct global identity database access.
- Storing Global credential material or secrets locally.
## 3. Channel Management Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Manages YouTube **channels** operated or monitored through YouTube OS: channel linking,
channel configuration, per-channel settings, and the platform-local channel metadata cache.
Channel linking requires OAuth/USER authorization scoped through the Global Identity
capability; the platform stores only the cross-reference and identification metadata, never
channel credentials.

### Owned Data
- Channel records (channel ID, platform channel reference, display metadata).
- Per-channel configuration and settings.
- Channel enrollment/ownership cross-reference to Global identity and to the linked user.
- Channel metadata cache and refresh timestamps.
- **Not owned:** channel credentials/tokens (kept in separate approved provider secret
  handling), authoritative Global identity records.

### Public APIs
- `TARGET`: `POST /api/v1/channels` — link a channel (OAuth flow via Global identity).
- `TARGET`: `GET /api/v1/channels`, `GET /api/v1/channels/:channelId`.
- `TARGET`: `PATCH /api/v1/channels/:channelId/settings`.

### Published Events
- `TARGET`: `channel.openflow.linked` (v1).
- `TARGET`: `channel.openflow.settings.updated` (v1).
- `TARGET`: `channel.openflow.unlinked` (v1).

### Consumed Global APIs
- `Identity` / `Authentication` / `Authorization` — for scoped user consent to link channels.
- `workflow.request` — to start channel setup flows (`BLOCKED`).
- Future approved YouTube Data API (external provider SDK) for channel metadata — requires
  provider approval; `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global identity events affecting channel ownership once the authoritative event
  contract is available.

### Forbidden Dependencies
- Storing YouTube or channel credentials/tokens outside approved secret handling.
- Local OAuth/identity reimplementation.
- Direct YouTube database access or unversioned provider integration.
- Duplicating Global Media Management records for channel-branded assets.

## 4. Content Strategy Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Governs **what content to produce and why**: content planning, topic research, content
calendar, positioning, briefs, and SEO strategy. Strategy decisions may be informed by
Global AI Core output, but the strategic choice and platform-owned plan remain in this
context. It declares intent; it does not manufacture media assets (centralized Media
Management owns those) nor publish.

### Owned Data
- Content strategy records, topic research, and positioning statements.
- Content calendar and planned publication windows.
- Content briefs, target audience, and SEO/keyword targets.
- Editorial observations and rationale for decisions.

### Public APIs
- `TARGET`: `GET/POST/PATCH /api/v1/content-strategy/calendar`.
- `TARGET`: `GET/POST /api/v1/content-strategy/briefs`.
- `TARGET`: `GET /api/v1/content-strategy/seo-targets`.

### Published Events
- `TARGET`: `strategy.openflow.brief.created` (v1).
- `TARGET`: `strategy.openflow.calendar.updated` (v1).

### Consumed Global APIs
- `Global AI Core` (`ai-core.request`) — for ideation/summarization/research `BLOCKED`.
- `Media Management` — to reference/shape asset briefs without owning media `BLOCKED`.
- `Config` / `Feature Flags` — to gate strategy features `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global Media Management asset events relevant to planned content once contracts
  are authoritative.

### Forbidden Dependencies
- Local media asset storage (Media Management is centralized).
- Platform-specific advertising governance or ad-targeting decisioning.
- Local AI Core reimplementation for strategy.
- Direct query of publishing or analytics databases.
## 5. AI Director Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Owns the **AI-driven creative and scheduling direction** for the platform: which content is
proposed, recommended cadence, tone, and creative briefs driven by model output. AI
Director is an **orchestrator of directives**, not the AI brain itself. All model
inference is delegated to the Global AI Core, and any AI decision must respect the approved
Enterprise AI policy; AI Director records rationale and observations so decisions are
traceable and auditable.

### Owned Data
- AI direction records, proposed creative directions, and recommendation scores.
- Rationale/observations captured alongside each directive (auditability).
- AI directive state and the linkage between a directive and its originating Global AI Core
  request/response reference.
- **Not owned:** model weights, prompts policy, training data, or the AI runtime.

### Public APIs
- `TARGET`: `POST /api/v1/ai-director/propose` — request a proposed creative direction.
- `TARGET`: `GET /api/v1/ai-director/directives/:directiveId`.
- `TARGET`: `POST /api/v1/ai-director/directives/:directiveId/approve` (enterprise approval).

### Published Events
- `TARGET`: `ai.openflow.directive.proposed` (v1).
- `TARGET`: `ai.openflow.directive.approved` (v1).
- `TARGET`: `ai.openflow.directive.rejected` (v1).

### Consumed Global APIs
- `Global AI Core` (`ai-core.request`) — all inference `BLOCKED`.
- `AI President Core` — strategic directives/priorities `BLOCKED`.
- Enterprise AI policy/audit — governs and records AI behavior `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global AI Core and AI President Core directive/observation events once the
  authoritative event contract exists.

### Forbidden Dependencies
- Local AI model inference, model hosting, or AI runtime duplication.
- Creating or overriding Enterprise AI policy locally.
- Making an AI decision that bypasses the audit trail.
- Direct access to Global AI Core databases.

## 6. Workflow Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Orchestrates platform business processes (e.g., content creation → review → approval →
publish → analyze) that cross multiple contexts. The workflow **engine is Global-owned** and
is consumed; this context owns the YouTube-OS-specific workflow definitions, templates, and
the platform-side process state that must survive on the platform side. It routes events and
approvals between contexts and back to the Global Workflow engine.

### Owned Data
- Platform-specific workflow templates and definitions (YouTube OS processes).
- Platform-side workflow instance state and step status cross-references.
- Approval routing rules and the assignment of approvers (executives/admins).
- Correlation links between platform workflow state and Global workflow engine references.

### Public APIs
- `TARGET`: `POST /api/v1/workflows` — start a workflow instance.
- `TARGET`: `GET /api/v1/workflows/:workflowId` — status.
- `TARGET`: `POST /api/v1/workflows/:workflowId/advance` — advance/approve a step.

### Published Events
- `TARGET`: `workflow.openflow.started` (v1).
- `TARGET`: `workflow.openflow.step.completed` (v1).
- `TARGET`: `workflow.openflow.completed` (v1).

### Consumed Global APIs
- `Workflow Engine` (`workflow.request`) — orchestration execution `BLOCKED`.
- `Notifications` — to notify approvers `BLOCKED`.
- `Identity` / `Authorization` / `RBAC_ABAC` — approver resolution `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global workflow state and approval events once the authoritative event contract
  exists.

### Forbidden Dependencies
- Local workflow engine reimplementation (Global-owned).
- Local notification engine for workflow alerts.
- Long-running outgoing network in violation of bounded retry/idempotency policy.
- Direct workflow database access to other contexts.
## 7. Publishing Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Schedules and executes the **delivery of finished content to YouTube**: publish queue,
publication scheduling, publication metadata, and publish receipts. It consumes approved
media from centralized Media Management and submits to YouTube through an **approved,
versioned external provider SDK**. It does not govern advertising and does not own local
ad policy.

### Owned Data
- Publish queue entries and scheduled publication windows.
- Publication metadata and rendered per-platform metadata snapshots.
- Publish receipts, status transitions, and retry state.
- Correlation links: content brief → media asset reference → YouTube video ID.

### Public APIs
- `TARGET`: `POST /api/v1/publishing` — schedule a publication.
- `TARGET`: `GET /api/v1/publishing/queue`, `GET /api/v1/publishing/:publishId`.
- `TARGET`: `POST /api/v1/publishing/:publishId/cancel`.

### Published Events
- `TARGET`: `publishing.openflow.scheduled` (v1).
- `TARGET`: `publishing.openflow.published` (v1).
- `TARGET`: `publishing.openflow.failed` (v1).

### Consumed Global APIs
- `Media Management` — approved finalized assets for publishing `BLOCKED`.
- `Notifications` — publish completion alerts `BLOCKED`.
- Future approved YouTube external provider SDK (post-Gate) — requires provider approval.

### Consumed Global Events
- `TARGET`: Global Media Management finalization events before publishing once contracts are
  authoritative.

### Forbidden Dependencies
- Local ad-governance or monetization decisioning (Global/business-policy owned).
- Local media asset storage.
- Unapproved YouTube SDK or unversioned provider integration.
- Publishing without an authenticated, authorized, versioned contract.

## 8. Analytics Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Produces **performance insight for channels and videos** consumed by creators and
executives: view/engagement reporting, trend observation, and recommendation. Analytics is
derived and read-oriented. It is not a substitute for the Global-owned monitoring/telemetry
infrastructure and never introduces platform-specific advertising governance or ad metrics
policy.

### Owned Data
- Derived channel/video performance records and report artifacts.
- Report configuration, dashboards, and export state.
- Historical snapshot cache of external performance data.
- **Not owned:** raw Global monitoring/telemetry, financial truth, advertising metrics policy.

### Public APIs
- `TARGET`: `GET /api/v1/analytics/channels/:channelId/performance`.
- `TARGET`: `GET /api/v1/analytics/videos/:videoId/performance`.
- `TARGET`: `GET /api/v1/analytics/reports`.
- `TARGET`: `POST /api/v1/analytics/reports/export`.

### Published Events
- `TARGET`: `analytics.openflow.report.generated` (v1).
- `TARGET`: `analytics.openflow.insight.updated` (v1).

### Consumed Global APIs
- `Global AI Core` (`ai-core.request`) — insight summarization `BLOCKED`.
- `Config` / `Feature Flags` — toggling report features `BLOCKED`.
- Future approved YouTube Analytics external provider SDK (post-Gate) — provider approval.

### Consumed Global Events
- `TARGET`: Global AI Core insight events once the authoritative event contract exists.

### Forbidden Dependencies
- Duplicating Global Monitoring/telemetry (Global-owned).
- Local platform-specific advertising-governance or ad-metrics policy.
- Direct access to financial/revenue databases (Revenue context / Global financial truth).
- Direct global platform database access.
## 9. Revenue & Monetization Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Tracks and manages YouTube OS **revenue and monetization** in alignment with enterprise
policy: revenue recognition visibility, affiliate marketing, and monetization settings for
paid subscriptions. **Financial truth is Global-owned.** This context reads/aggregates
approved financial signals through the Global billing/payment/wallet boundary and owns only
platform-side interpretation and presentation. Platform wallets are prohibited, and
platform-specific advertising governance is prohibited.

### Owned Data
- Revenue/monetization projection and reporting records derived from Global financial data.
- Affiliate marketing configuration limited to paid subscriptions (approved 30% commission).
- Monetization settings cross-references and eligibility state.
- **Not owned:** the Global Wallet, balances, payment records, billing/subscription truth,
  advertising-governance policy.

### Public APIs
- `TARGET`: `GET /api/v1/revenue/overview`.
- `TARGET`: `GET /api/v1/revenue/affiliate` — affiliate configuration (paid subscriptions only).
- `TARGET`: `GET /api/v1/revenue/monetization/:channelId/settings`.

### Published Events
- `TARGET`: `revenue.openflow.overview.refreshed` (v1).
- `TARGET`: `revenue.openflow.affiliate.updated` (v1).

### Consumed Global APIs
- `Billing` / `Subscription` / `Payments` (`billing-subscription.query`) — `BLOCKED`.
- `Global Wallet` / centralized financial infrastructure — `BLOCKED`.
- `Entitlement` (`entitlement.verify`) — paid-subscription eligibility `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global billing/subscription/wallet events (e.g., subscription.state.changed) once
  the authoritative event contract exists.

### Forbidden Dependencies
- Local wallet, balance, or payment infrastructure (single Global Wallet is authoritative).
- Platform-specific advertising governance or ad revenue decisioning.
- Affiliate marketing outside paid subscriptions or at a non-approved commission.
- Storing financial truth or payment credentials locally.

## 10. Notification Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Manages the **platform experience of notifications** (in-product and follow-through messages
to creators, executives, and admins). The **notification engine is Global-owned** and is
consumed. This context owns platform-specific notification preferences, read state, and the
mapping between platform events and user-facing messaging; it does not operate delivery
infrastructure.

### Owned Data
- User notification preferences (per-user, per-category).
- Read/acknowledged state and in-product delivery mapping.
- Notification template reuse metadata (platform-specific presentation).
- **Not owned:** the delivery engine, provider credentials, or Global notification logs.

### Public APIs
- `TARGET`: `GET /api/v1/notifications` — list for user.
- `TARGET`: `PATCH /api/v1/notifications/:id/read`.
- `TARGET`: `PUT /api/v1/notifications/preferences`.

### Published Events
- `TARGET`: `notification.openflow.preference.updated` (v1).

### Consumed Global APIs
- `Notifications` (`notification.request`) — delivery `BLOCKED`.
- `Identity` / `Authorization` / `RBAC_ABAC` — recipient resolution `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global notification delivery/lifecycle events once the authoritative event
  contract exists.

### Forbidden Dependencies
- Local notification engine, SMTP/push/SMS direct integration without approval.
- Local Identity/AuthZ for recipient resolution.
- Storing delivery credentials or secrets locally.
## 11. Audit Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Ensures platform actions are **traceable and auditable** in accordance with the Enterprise
Audit workflow. The authoritative audit store and Audit capability are **Global-owned and
consumed**. This context captures platform-origin events, enriches them with the required
envelope/correlation metadata, and submits them to the Global Audit boundary. It owns only
platform-side correlation and submission state, never an authoritative audit ledger.

### Owned Data
- Audit submission records and correlation/reference links.
- Local retry/idempotency state for submitted audit events.
- Mapping of platform events to auditable action definitions.
- **Not owned:** the authoritative audit store, security logs, or Global audit processing.

### Public APIs
- `TARGET`: `POST /api/v1/audit/submit` — submit an auditable action record (internal contract).

### Published Events
- `TARGET`: emits auditable actions to Global as `audit.event.submit` (outbound intent declared
  in `contracts/events/global-ecosystem-events.v1.json`) — `BLOCKED`.

### Consumed Global APIs
- `Audit` (`audit.submit`) — authoritative audit ingestion `BLOCKED`.
- `Security` — security event correlation `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global audit acknowledgment/failure events once the authoritative event contract
  exists.

### Forbidden Dependencies
- Local authoritative audit ledger or security store (Global-owned).
- Submitting audit events without the required envelope fields (eventId, correlationId,
  sourcePlatformId) or without bounded retry/idempotency.
- Bypassing audit for any platform action.

## 12. Creator Experience Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Owns the **creator-facing experience**: onboarding, dashboard composition, and
self-service presentation of platform results (strategy, publishing, analytics) to creators.
It composes views by calling the owning contexts' public APIs and never reads their private
data directly. It presents platform state; it does not define strategy, publish, or decide
revenue.

### Owned Data
- Creator onboarding state and journey progress.
- Dashboard layout/configuration and UI preferences.
- Creator-facing presentation transcripts/aggregations cached for display.
- **Not owned:** channel truth, strategy decisions, publication orders, financial truth.

### Public APIs
- `TARGET`: `GET /api/v1/creator/onboarding`.
- `TARGET`: `PUT /api/v1/creator/dashboard-config`.
- `TARGET`: `GET /api/v1/creator/dashboard/overview` (composed view).

### Published Events
- `TARGET`: `creator.openflow.onboarding.completed` (v1).
- `TARGET`: `creator.openflow.dashboard.config.updated` (v1).

### Consumed Global APIs
- Internal public APIs of Channel, Content Strategy, AI Director, Workflow, Publishing, and
  Analytics contexts (composition reads).
- `Identity` / `Authorization` / `Entitlement` — creator scoping `BLOCKED` (Global).

### Consumed Global Events
- `TARGET`: internal events from publishing/analytics/strategy that refresh composed views.

### Forbidden Dependencies
- Direct database access to any other context (UI always via public API).
- Local Identity/AuthZ or onboarding-role truth.
- Making strategy, publishing, or financial decisions from the presentation layer.
- Local advertising-governance knowledge.
## 13. President & Executive Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Provides the **President Panel and executive visibility**, which remain strategic per
enterprise policy. It surfaces strategic status, delegates operational tasks, reviews
directives and approvals, and orchestrates executive oversight — with **AI automation
preferred** and operational exceptions pushed to Admin. It consumes the Global **AI President
Core** for intelligence and does not replicate enterprise governance or authority.

### Owned Data
- Executive dashboard composition and strategic status projections.
- Delegation records (which operational tasks are assigned to whom or to automation).
- Executive approval history cross-references.
- **Not owned:** enterprise authority, AI President Core internals, operational runtime truth.

### Public APIs
- `TARGET`: `GET /api/v1/executive/overview` — strategic status panel.
- `TARGET`: `POST /api/v1/executive/delegate` — delegate an operational task.
- `TARGET`: `GET /api/v1/executive/approvals` — pending approvals.

### Published Events
- `TARGET`: `executive.openflow.delegation.created` (v1).
- `TARGET`: `executive.openflow.approval.decided` (v1).

### Consumed Global APIs
- `AI President Core` — strategic intelligence/priorities `BLOCKED`.
- `Workflow Engine` — delegation and approval flows `BLOCKED`.
- `Notifications` — executive alerts `BLOCKED`.
- `Entitlement` / `RBAC_ABAC` — executive scoping and mandatory-MFA enforcement `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global AI President Core and enterprise approval events once the authoritative
  event contract exists.

### Forbidden Dependencies
- Reimplementing the AI President Core or enterprise authority.
- Granting executive powers through local RBAC/role logic.
- Local mandatory-MFA/password-policy logic (Global Security owned; executive enhanced controls).
- Replacing enterprise governance or audit workflows.

## 14. Admin Context

**Classification:** `TARGET` (`NOT_IMPLEMENTED`)

### Responsibility
Provides **admin panels to handle operational exceptions** (the operator counterpart to the
strategic President Panel). Repeated manual operations shall be automated whenever practical,
so Admin is the exception-handling surface, not the routine operating layer. It consumes
Global Configuration and Feature Flags to gate/administer platform behavior and relies on
Global Identity/AuthZ for role scoping.

### Owned Data
- Admin operation/exception handling records and outcomes.
- Scoped operational override requests and their audit links.
- Admin panel preference/configuration state.
- **Not owned:** global config/feature-flag authority, global roles, notified tooling truth.

### Public APIs
- `TARGET`: `GET /api/v1/admin/operations` — operational exception queue.
- `TARGET`: `POST /api/v1/admin/operations/:id/resolve` — handle an exception.
- `TARGET`: `GET /api/v1/admin/automation` — automation coverage of repetitive tasks.

### Published Events
- `TARGET`: `admin.openflow.operation.resolved` (v1).
- `TARGET`: `admin.openflow.automated.recommended` (v1) — suggests automating a repeated task.

### Consumed Global APIs
- `Config` / `Feature Flags` — platform-wide gating/administration `BLOCKED`.
- `Identity` / `Authorization` / `RBAC_ABAC` — admin role scoping `BLOCKED`.
- `Audit` — compliance for administrative actions `BLOCKED`.

### Consumed Global Events
- `TARGET`: Global config/feature-flag change events once the authoritative event contract
  exists.

### Forbidden Dependencies
- Local Configuration or Feature Flag replacement (Global-owned).
- Local RBAC/ABAC for admin roles (Global-owned).
- Performing operational actions without an audit trail.
- Expanding Admin into routine automation that should be automated instead.
## 15. Integration Gateway Context

**Classification:** `FOUNDATION` (boundary/adapter surface) — business runtime `TARGET`

### Responsibility
Is the **single permitted source boundary for all cross-platform integration** with the
Global Ecosystem. It owns the versioned API/event contract clients, the local adapter
surface, correlation/idempotency/retry handling, and service-to-service authentication,
consistent with `integrations/global-ecosystem`. No other context may reach the Global
Ecosystem directly; all consumption routes through this gateway.

### Owned Data
- Version-pinned contract references and compatibility/status metadata.
- Correlation, requestId, and state metadata for outbound calls and inbound events.
- Adapter configuration references and current blocked/unavailable state.
- **Not owned:** any business data, Global ecosystem data, or provider credentials for
  unapproved providers.

### Public APIs
- `FOUNDATION`: internal adapter surface (`integrations/global-ecosystem/mock-adapter.ts`)
  and contract discovery endpoints `/api/v1/platform/contracts/...` (read-only).
- `TARGET`: typed adapters for `identity.verify`, `entitlement.verify`, `ai-core.request`,
  `workflow.request`, `audit.submit`, `notification.request`, `billing-subscription.query`,
  `health.check`, `compatibility.check` once authoritative contracts are approved.

### Published Events
- `TARGET`: normalized internal integration events produced for consuming contexts; and
  `audit.event.submit` outbound (declared intent) — `BLOCKED`.

### Consumed Global APIs
- The declared `GLOBAL_ECOSYSTEM_API_V1` boundary (all operations) — `BLOCKED`
  (`AUTHORITATIVE_CONTRACT_NOT_AVAILABLE`).

### Consumed Global Events
- The declared `GLOBAL_ECOSYSTEM_EVENTS_V1` boundary — `BLOCKED`
  (`AUTHORITATIVE_CONTRACT_NOT_AVAILABLE`).

### Forbidden Dependencies
- Direct cross-platform integration from any other context or module.
- Shared/direct database access to the Global Ecosystem.
- Unversioned or unauthenticated cross-platform calls.
- Importing or linking the Global Ecosystem source/package from outside this gateway.

## Bounded context summary matrix

| # | Context | Classification | Owns data | Consumes Global (cap) | Duplicates Global (forbidden) |
| --- | --- | --- | --- | --- | --- |
| 1 | Platform Identity | `FOUNDATION` | Platform identity/governance/registration | Service Registry, health/compat | Identity, Service Registry |
| 2 | User Management | `TARGET` | Local profiles/preferences/entitlements refs | Identity, AuthN/AuthZ, RBAC | Auth, passwords, roles |
| 3 | Channel Management | `TARGET` | Channel records/settings/cache | Identity, workflow, YouTube SDK (future) | Channel creds, OAuth, media |
| 4 | Content Strategy | `TARGET` | Strategy/calendar/briefs/SEO | Global AI Core, Media Mgmt, Config | Media store, ad governance, AI Core |
| 5 | AI Director | `TARGET` | Directives/rationale | Global AI Core, AI President Core | AI model/inference, AI policy |
| 6 | Workflow | `TARGET` | Workflow templates/state refs | Workflow Engine, Notifications, AuthZ | Workflow engine, notification engine |
| 7 | Publishing | `TARGET` | Publish queue/metadata/receipts | Media Mgmt, Notifications, YouTube SDK (future) | Ad governance, media store, unapproved SDK |
| 8 | Analytics | `TARGET` | Derived metrics/reports | Global AI Core, Config, Analytics SDK (future) | Monitoring, ad-metrics policy |
| 9 | Revenue & Monetization | `TARGET` | Revenue projections/affiliate | Billing, Subscription, Payments, Wallet, Entitlement | Wallet, payments, ad governance, fin. truth |
| 10 | Notification | `TARGET` | Preferences/read state/in-product map | Notifications, Identity, AuthZ | Notification engine, delivery infra |
| 11 | Audit | `TARGET` | Audit submission/correlation state | Audit, Security | Authoritative audit ledger/security store |
| 12 | Creator Experience | `TARGET` | Onboarding/dashboard config/presentation | Internal public APIs + Global Identity/AuthZ | Direct cross-context DB, ad knowledge |
| 13 | President & Executive | `TARGET` | Delegation/approval/status projections | AI President Core, Workflow, Notifications, Entitlement | AI President Core, enterprise authority |
| 14 | Admin | `TARGET` | Exception handling records | Config, Feature Flags, Identity/AuthZ, Audit | Config/FF, RBAC, unchecked actions |
| 15 | Integration Gateway | `FOUNDATION` surface | Contract refs/correlation/adapter state | `GLOBAL_ECOSYSTEM_API/EVENTS_V1` (all) | Out-of-gateway integration, global DB |

## Consistency and evidence boundary

- This document is consistent with `docs/ARCHITECTURE.md`, `docs/PLATFORM_BOUNDARIES.md`,
  `governance/platform-boundary-registry.v1.json`, `governance/capability-registry.v1.json`,
  `governance/feature-registry.v1.json`, `governance/platform-dependencies.v1.json`, and the
  contract placeholders in `contracts/`.
- It is a planning/documentation artifact only. It performs no network request, introduces
  no runtime, model, route, or event publication, and grants no implementation or integration
  permission.
- Business contexts 2–14 remain `NOT_IMPLEMENTED`; they require Gate 0 approval and a
  separately authorized sprint before any runtime exists.
- All consumed Global APIs/events remain `BLOCKED` (`AUTHORITATIVE_CONTRACT_NOT_AVAILABLE`)
  until authoritative, versioned Global contracts are approved and inspected.