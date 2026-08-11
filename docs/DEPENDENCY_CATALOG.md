# Dependency Catalog

This catalog maps YouTube OS module-level dependencies based on architecture constraints in `docs/BOUNDED_CONTEXTS.md`, `docs/PLATFORM_BOUNDARIES.md`, and `docs/GLOBAL_ECOSYSTEM_INTEGRATION.md`.

Status: `PLANNING_ARTIFACT` (Foundation governance and target context mapping)

## Module Dependency Matrix

| Module | Internal Module Dependencies | Global Ecosystem Service Dependencies | Forbidden Dependencies |
|---|---|---|---|
| Creator | Channel, Content, AI Director, Workflow, Publishing, Analytics | Identity / Authentication / Authorization / RBAC-ABAC, Entitlement | Direct DB access to other contexts; local Identity/AuthZ reimplementation; strategy/publishing/financial decisioning in presentation layer |
| Channel | User Management, Workflow | Identity / Authentication / Authorization, Workflow Engine | Storing channel credentials outside approved secret handling; local OAuth/Auth reimplementation; unversioned provider integration; direct Global DB access |
| Content | Channel, Analytics, AI Director, Workflow | Global AI Core, Media Management, Configuration, Feature Flags | Local media asset storage; local AI Core reimplementation; platform-specific advertising governance; direct publishing/analytics DB query |
| Publishing | Content, Channel, Workflow, Analytics | Media Management, Notifications, Identity / Authorization | Local ad-governance decisioning; local media asset storage; unapproved YouTube SDK/provider integration; unauthenticated/unversioned cross-platform calls |
| Analytics | Channel, Content, Publishing, Monetization | Global AI Core, Configuration, Feature Flags | Duplicating Global monitoring/telemetry; local ad-metrics policy; direct financial truth DB access; direct Global DB access |
| AI Director | Content, Workflow, Analytics, President Panel | Global AI Core, AI President Core, Audit | Local model inference/runtime duplication; local AI policy override; bypassing audit trail; direct Global AI Core DB access |
| Workflow | Channel, Content, AI Director, Publishing, Admin Panel | Workflow Engine, Notifications, Identity / Authorization / RBAC-ABAC | Local workflow engine reimplementation; local notification engine; direct cross-context DB access; unbounded long-running network behavior |
| Monetization | Channel, Analytics, Publishing, Admin Panel | Billing, Subscriptions, Payments, Global Wallet / Financial Infrastructure, Entitlement | Local wallet/payment infrastructure; platform-specific advertising governance; affiliate outside paid subscriptions or non-approved commission; storing payment credentials locally |
| President Panel | AI Director, Workflow, Analytics, Monetization, Admin Panel | AI President Core, Workflow Engine, Notifications, Entitlement | Reimplementing AI President Core or enterprise authority; local RBAC/role authority escalation; local mandatory-MFA/password policy logic |
| Admin Panel | Workflow, Monetization, Analytics, President Panel | Configuration, Feature Flags, Identity / Authorization / RBAC-ABAC, Audit | Local Config/Feature Flag replacement; local RBAC/ABAC reimplementation; unaudited admin operations; direct Global DB access |

## Notes

- `Content` corresponds to the Content Strategy context.
- `Monetization` corresponds to Revenue & Monetization context scope.
- `President Panel` corresponds to President & Executive context scope.
- All Global dependencies are consumed only through approved, versioned API/event contracts via the Integration Gateway boundary.