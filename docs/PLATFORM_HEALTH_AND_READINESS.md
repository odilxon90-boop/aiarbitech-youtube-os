# Platform Capability Health & Readiness Manifest

Sprint: `AAT-YTOS-SPRINT-0.0.3`

The module is a local, read-only operational evidence model. It does not call the Global Ecosystem, Google, YouTube, or any external service.

## Repository-derived models

- **Architecture compliance:** percentage of explicit passport and boundary controls that pass. Controls cover independent repository/deployment, platform-owned data, prohibited cross-platform database access, absent public events/providers, and required forbidden dependencies.
- **Repository health:** percentage of required Sprint files declared by `governance/platform-health-manifest.v1.json` that exist in the repository.
- **Foundation completion:** percentage of required local governance artifacts that load and pass their Zod schemas.
- **Readiness:** percentage of local readiness conditions supported by the passport, dependency declaration, and registration-readiness artifact. Missing authoritative contracts or identifiers remain blockers rather than being inferred.
- **Overall readiness:** arithmetic mean of architecture compliance, repository health, foundation completion, and readiness.
- **Last validation timestamp:** latest filesystem modification time among the declared local evidence files. It is evidence-derived rather than generated from the request time.

## Read-only API

- `GET /api/v1/platform/health-manifest`
- `GET /api/v1/platform/health/summary`
- `GET /api/v1/platform/health/readiness`
- `GET /api/v1/platform/health/architecture-compliance`

POST, PUT, PATCH, and DELETE routes are not registered.

## UI

`frontend/src/platform/PlatformHealthDashboard.tsx` displays the derived scores, current Gate/Sprint/Phase, validation status, evidence timestamp, and readiness blockers. It contains no form or action control.