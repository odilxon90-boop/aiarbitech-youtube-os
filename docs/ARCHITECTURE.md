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
