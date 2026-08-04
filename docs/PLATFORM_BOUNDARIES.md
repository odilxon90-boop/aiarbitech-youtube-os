# Platform Boundaries

## Owned by YouTube OS

- Independent repository, release, and deployment lifecycle.
- Frontend shell and backend platform API.
- Platform-owned PostgreSQL schema.
- Platform-specific business logic and data introduced only after Gate 0.
- Adapters implementing approved Global Ecosystem contracts.

## Owned by the Global Ecosystem

Identity, authentication, authorization, RBAC/ABAC, security, audit, AI President Core, Global AI Core, workflow, notifications, billing, subscriptions, payments, monitoring, configuration, feature flags, and service registry.

YouTube OS declares dependencies on these capabilities. It does not reimplement them.

## Data boundary

- `globalDatabaseAccess`: `PROHIBITED`
- `crossPlatformDatabaseAccess`: `PROHIBITED`
- YouTube OS Prisma models must represent only platform-owned data.
- Cross-platform state is exchanged only through approved API and event contracts.

## Feature boundary

No channel, video, publishing, revenue, analytics, or other YouTube business feature is authorized in the foundation phase.
