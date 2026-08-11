# AIArbiTech YouTube OS

AIArbiTech YouTube OS is an **independent platform service** governed by the AIArbiTechnology Global Ecosystem.

This repository provides platform foundation, governance artifacts, integration boundaries, and operational standards for controlled enterprise evolution.

## Foundation status

This repository contains foundation infrastructure only. It intentionally contains no YouTube channel, video, publishing, revenue, or analytics business implementation.

Current state:

- Architecture baseline is governed and frozen by approved boundaries.
- Business-runtime expansion remains gated by change management and audit.
- Cross-platform dependencies remain contract-driven and policy-controlled.

## Architectural invariants

- The repository and deployment lifecycle are independent.
- The Global Ecosystem is the governing enterprise core.
- Integration is limited to approved, authenticated, authorized, versioned API and event contracts.
- Direct access to the Global Ecosystem database is prohibited.
- Cross-platform database access is prohibited.
- Global Core capabilities must not be duplicated locally.
- Platform-owned data and future platform-specific business logic remain local.
- Compatibility remains `NOT_VERIFIED` until approved Global Ecosystem contracts are inspected.
- Gate 0 must complete before any business feature implementation.

## Governance and control model

YouTube OS follows a strict governance hierarchy:

Constitution -> Policies and Standards -> Architecture -> Runbooks and Manuals -> Sprint Scope -> Code.

Implementation cannot override higher-order governance controls.

## Packages

- `frontend/`: React, TypeScript, and Vite platform shell.
- `backend/`: Node.js, TypeScript, Fastify, Prisma, Zod foundation API.
- `contracts/`: versioned compatibility placeholders; not approved production contracts.
- `docs/`: architecture, boundaries, integration, and Gate 0 baseline.

## Operational domains

- Platform governance and readiness tracking
- Integration boundary management
- Security and incident operations
- Release and rollback control
- Testing and quality assurance
- Executive, admin, creator, and AI operating manuals

## Local validation

```bash
cd frontend
npm install
npm run typecheck
npm test
npm run build

cd ../backend
npm install
npm run typecheck
npm test
npm run build
npx prisma validate
npx prisma generate
```

## Recommended quality gates

Before merge or release:

- Typecheck passes (frontend and backend).
- Relevant test suites pass.
- Build passes.
- Security and boundary checks are validated.
- Required docs and audit evidence are updated.

## Deployment endpoints

- Global Ecosystem API: https://aiarbitech-global-ecosystem-production.up.railway.app
- Global Ecosystem frontend: https://aiarbitech-frontend-production.up.railway.app
- YouTube OS frontend: https://aiarbitech-youtube-os.vercel.app
- YouTube OS backend: https://aiarbitech-youtube-os-production.up.railway.app

## Local PostgreSQL

```bash
docker compose up -d postgres
```

Copy `.env.example` to the appropriate local runtime environment only when running services. Never commit secrets.

## Monitoring & Observability

YouTube OS includes a comprehensive monitoring stack with Prometheus, Grafana, and Alertmanager. See [MONITORING.md](docs/MONITORING.md) for complete setup and usage instructions.

**Quick start:**

```bash
# Start main application
docker compose up -d

# In another terminal, start monitoring stack
docker compose -f docker-compose.monitoring.yml up -d

# Access dashboards
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001
# Alertmanager: http://localhost:9093
# Backend metrics: http://localhost:3000/metrics
```

**Key Features:**
- Real-time metrics collection from backend, Redis, PostgreSQL, and system
- Pre-built Grafana dashboards for API performance and infrastructure health
- Automated alerting via email, Slack, PagerDuty, Telegram, and webhooks
- 20+ alert rules covering API, database, Redis, and system metrics

## Core documentation map

Architecture and boundaries:

- `docs/ARCHITECTURE.md`
- `docs/PLATFORM_BOUNDARIES.md`
- `docs/BOUNDED_CONTEXTS.md`
- `docs/GLOBAL_ECOSYSTEM_INTEGRATION.md`
- `docs/ARCHITECTURE_FREEZE.md`

Governance and decision records:

- `docs/ADR.md`
- `docs/ARCHITECTURE_DECISION_REGISTER.md`
- `docs/CHANGE_REGISTER.md`
- `docs/DECISION_LOG.md`
- `docs/RISK_REGISTER.md`
- `docs/TECHNICAL_DEBT_REGISTER.md`
- `docs/READY_STATUS_TRACKER.md`

Policies and standards:

- `docs/SECURITY_POLICY.md`
- `docs/PRIVACY_POLICY.md`
- `docs/DATA_RETENTION_POLICY.md`
- `docs/API_RATE_LIMIT_POLICY.md`
- `docs/INCIDENT_RESPONSE_POLICY.md`
- `docs/DEVELOPMENT_STANDARDS.md`
- `docs/TESTING_STANDARD.md`
- `docs/RELEASE_ROLLBACK_STANDARD.md`
- `docs/DOR_DOD.md`

Operating manuals and playbooks:

- `docs/EXECUTIVE_HANDBOOK.md`
- `docs/ADMIN_HANDBOOK.md`
- `docs/CREATOR_HANDBOOK.md`
- `docs/AI_DIRECTOR_HANDBOOK.md`
- `docs/ENTERPRISE_OPERATING_MANUAL.md`
- `docs/DISASTER_RECOVERY_PLAYBOOK.md`
- `docs/OPERATIONAL_RUNBOOKS.md`

Legal and usage documents:

- `docs/TERMS_OF_SERVICE.md`
- `docs/CREATOR_AGREEMENT.md`

## Change policy

- Major platform changes require approved change request, architecture review, and audit traceability.
- Baseline architecture changes are allowed only through formal Change Management workflow.
- Unapproved cross-platform coupling and direct database integration remain prohibited.
