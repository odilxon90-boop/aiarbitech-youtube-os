# Architecture

## System context

AIArbiTech YouTube OS is an independently deployed platform service. The AIArbiTechnology Global Ecosystem remains the governing enterprise core and system of authority for shared enterprise capabilities.

```text
Users
  -> YouTube OS Frontend
       -> YouTube OS Backend
            -> YouTube OS PostgreSQL (platform-owned data only)
            -> Versioned Global Ecosystem API/Event Boundary
                 -> Global Ecosystem shared capabilities
```

## Packages

- The frontend owns presentation and platform status views.
- The backend owns the platform API composition root and future platform-specific application logic.
- Prisma is restricted to platform-owned metadata and future platform-owned data.
- `integrations/global-ecosystem` is the only permitted source boundary for cross-platform integration.
- `contracts` contains compatibility placeholders until authoritative contracts are approved.

## Prohibited architecture

- No import, package link, filesystem link, or database link to the Global Ecosystem repository.
- No direct query against Global Ecosystem tables or schemas.
- No local authentication, RBAC/ABAC, billing, notification, workflow, AI Core, monitoring, feature flag, configuration, or service registry replacement.
- No unversioned or unauthenticated cross-platform call.

## Current scope

Foundation infrastructure only. YouTube business features are intentionally excluded until Gate 0 approval.

## Post-Foundation enterprise synchronization

Document `AAT-FOUNDATION-SYNC-001` synchronizes the following approved Enterprise decisions with the Foundation architecture. This synchronization records policy and ownership only; it does not authorize or implement runtime behavior.

### Platform independence principle

- Every platform uses an independent repository.
- Every platform uses an independent deployment.
- Every platform uses an independent database.
- Cross-platform integration is permitted only through approved, versioned APIs and events.
- Direct, shared, or cross-platform database access remains prohibited.

### Enterprise change and architecture governance

- Enterprise changes are initiated through Change Requests.
- Approved architecture decisions are recorded through the Architecture Registry.
- Implementation occurs only in an authorized sprint.
- Enterprise changes follow the Enterprise Audit workflow.
- Enterprise Evolution & Stability, Architecture Protection, Future Compatibility & Extensibility, and Architectural Integrity policies govern future change without altering the approved independence principle.

### Enterprise capability policies

- Enterprise Media Governance centralizes media management. Platform-specific advertising governance is prohibited.
- Affiliate Marketing is approved with a 30% commission and applies only to paid subscriptions.
- Standard Users require a minimum eight-character password.
- Executive Roles require enhanced password controls and mandatory MFA.
- The Global Wallet is the single wallet. Platform wallets are prohibited, and financial infrastructure remains centralized.

These statements define Enterprise policy alignment only. YouTube OS must consume approved Global Ecosystem capabilities through the established API/event boundary and must not duplicate them locally.

### President-first automation and administration

- The President Panel remains strategic.
- Operational tasks are delegated.
- AI automation is preferred.
- Admin panels handle operational exceptions.
- Repetitive manual operations shall be automated whenever practical.

No AI President, workflow, AI automation, or administration runtime is introduced by this synchronization.

### Critical platform classification

- **Critical Class A:** AI Arbitrage Platform.
- **Critical Class B:** AI Market Pulse Scalper.
- AIArbiTech YouTube OS has no critical class assigned by this decision.

### Future Platform Registry

The approved future registry scope contains:

- AIArbiTech YouTube OS
- AI Arbitrage Platform
- AI Market Pulse Scalper
- AI Video Creator Studio
- AIArbiTech TV Global Media

Registry inclusion is an approved future architecture decision, not evidence that remote registration has occurred.
