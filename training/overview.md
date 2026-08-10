# Platform Overview — YouTube OS

Welcome to YouTube OS. This document gives you the conceptual foundation you need before diving into code, operations, or on-call duties. Read this first.

---

## What Is YouTube OS?

YouTube OS is an **independent platform service** owned by AIArbiTech, operating as a bounded context within the AIArbiTechnology Global Ecosystem. It provides the tooling, intelligence, and workflows for YouTube creators — dashboards, analytics, AI assistance, content planning, and goal tracking — while remaining decoupled from the Global Ecosystem's internal systems.

**What it is not:**
- It is not a YouTube API proxy
- It does not replicate Global Ecosystem capabilities locally
- It does not share a database with any other platform

---

## Architecture Principles

### 1. Independent Deployment Lifecycle
YouTube OS deploys independently. It does not share infrastructure with the Global Ecosystem or other platforms. Changes here do not require coordinated releases with other teams.

### 2. Contract-Based Integration
All communication with the Global Ecosystem happens through versioned, approved API and event contracts in the `contracts/` directory. Direct database access across platforms is prohibited.

### 3. Bounded Contexts
The platform is organized into bounded contexts — each owning its own data, logic, and APIs. Contexts do not call each other's internal services directly.

### 4. Governance-Driven
Platform capabilities, boundaries, and feature registrations are declared in the `governance/` directory as JSON manifests. These are the authoritative source of truth for what the platform is allowed to do.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
│  React + Vite SPA (port 5173)                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────▼───────────────────────────────────┐
│  Backend API — Fastify + TypeScript (port 3000)                 │
│                                                                 │
│  ┌──────────────┐  ┌───────────┐  ┌─────────────────────────┐  │
│  │ Auth / RBAC  │  │ Rate Limit│  │ Request Correlation IDs │  │
│  └──────────────┘  └───────────┘  └─────────────────────────┘  │
│                                                                 │
│  Bounded Contexts:                                              │
│  Dashboard · Analytics · AI Assistant · Goals · Video Studio   │
│  Music Studio · Genre · Intelligence · Memory · Admin          │
│  Integration Gateway · Registration · Platform Health          │
│                                                                 │
│  ┌──────────────────────────┐   ┌──────────────────────────┐   │
│  │  Cache Layer (Redis)     │   │  /metrics (Prometheus)   │   │
│  └──────────────────────────┘   └──────────────────────────┘   │
└────────────────┬────────────────────────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼─────┐          ┌──────▼──────┐
│PostgreSQL│          │  Redis 7    │
│   16     │          │  (Cache)    │
└──────────┘          └─────────────┘
```

### Key Layers

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, TypeScript, Vite | Creator-facing SPA |
| Backend API | Fastify 5, TypeScript, Node.js 20 LTS | REST API server |
| Database | PostgreSQL 16 + Prisma ORM | Persistent data storage |
| Cache | Redis 7 | Response caching, session data |
| Monitoring | Prometheus + Grafana + Alertmanager | Metrics, dashboards, alerts |
| Infrastructure | Docker + Docker Compose | Local and production orchestration |
| CI/CD | GitHub Actions | Automated typecheck → test → build |

---

## Bounded Contexts (Modules)

Each module lives under `backend/src/[context]/` and owns its routes, service logic, and data. Modules expose endpoints under `/api/v1/[context]/`.

| Context | Endpoint Prefix | Purpose |
|---|---|---|
| Health | `/api/v1/health` | Service, DB, Redis health checks |
| Platform | `/api/v1/platform` | Governance, capabilities, boundaries |
| Registration | `/api/v1/registration` | Platform registration with Global Ecosystem |
| Dashboard | `/api/v1/dashboard` | Creator channel summary |
| Analytics | `/api/v1/analytics` | View counts, watch time, revenue metrics |
| AI Assistant | `/api/v1/ai` | Content strategy AI chat |
| Goals | `/api/v1/goals` | Creator goal tracking |
| Video Studio | `/api/v1/video` | Video library and metadata |
| Music Studio | `/api/v1/music` | Music track browsing |
| Genre | `/api/v1/genre` | Genre recommendations |
| Intelligence | `/api/v1/intelligence` | Market and trend insights |
| Memory | `/api/v1/memory` | Creator session memory |
| Admin | `/api/v1/admin` | User management, moderation, audit logs |
| Integration Gateway | `/api/v1/gateway` | Outbound Global Ecosystem calls |

---

## Data Flow

**Typical creator request:**
```
Browser → React SPA
  → POST /api/v1/auth/login → JWT token issued
  → GET /api/v1/dashboard/summary
      → Cache middleware checks Redis (HIT: return cached)
      → MISS: Dashboard service queries PostgreSQL
      → Response cached in Redis (60s TTL)
      → JSON response returned
```

**Global Ecosystem integration:**
```
YouTube OS Backend
  → Integration Gateway
    → Versioned API contract (contracts/api/)
      → Global Ecosystem API (external)
```

---

## Contract Versioning

Contracts live in `contracts/`:
- `contracts/api/` — REST API schemas (OpenAPI YAML/JSON)
- `contracts/events/` — Event schemas for async communication
- `contracts/README.md` — Contract governance rules

Contracts are **never modified without approval** from the Global Ecosystem team. Breaking changes require a new version (`v2`) and a migration period.

---

## Governance Files

`governance/` contains JSON manifests that declare what this platform is and what it can do:

| File | Purpose |
|---|---|
| `capability-registry.v1.json` | What capabilities this platform provides |
| `platform-boundary-registry.v1.json` | What this platform does NOT own |
| `feature-registry.v1.json` | Feature flags and status |
| `platform-passport.v1.json` | Platform identity and metadata |
| `ai-policy-registry.v1.json` | AI usage policies |
| `platform-health-manifest.v1.json` | Health check definitions |

---

## Repository Structure

```
aiarbitech-youtube-os/
├── backend/             # Fastify API server (TypeScript)
│   ├── src/
│   │   ├── app/         # Server bootstrap
│   │   ├── config/      # Environment configuration
│   │   ├── [context]/   # One folder per bounded context
│   │   ├── cache/       # Redis client + cache service + middleware
│   │   ├── middleware/  # Security, rate limit, metrics, throttle
│   │   └── shared/      # Logger, errors, auth, correlation IDs
│   ├── prisma/          # Database schema and migrations
│   └── config/          # PostgreSQL and Redis tuning configs
├── frontend/            # React + Vite SPA
├── contracts/           # Versioned API and event contracts
├── governance/          # Platform capability and boundary manifests
├── docs/                # Architecture, bounded contexts, gate docs
├── smoke-tests/         # Post-deployment smoke test scripts
├── incident/            # On-call schedule, severity, response, post-mortem
├── testing/uat/         # User acceptance testing plan
├── load-test/           # k6 load testing scripts
├── prometheus/          # Prometheus configuration and alert rules
├── alertmanager/        # Alertmanager routing configuration
├── grafana/             # Grafana dashboards and provisioning
└── docker-compose.yml   # Main service orchestration
```

---

## Technology Decisions (Rationale)

| Decision | Rationale |
|---|---|
| Fastify over Express | Lower overhead, schema-first validation, TypeScript-native |
| Prisma over raw SQL | Type-safe queries, migration management, schema-as-code |
| Redis for caching | Sub-millisecond reads for hot data; in-memory fallback for dev |
| Prometheus/Grafana | Open-source standard; pre-built exporters for Redis and PostgreSQL |
| Zod for validation | Runtime type safety at API boundaries; integrates with Fastify |
| Vitest for tests | Fast TypeScript-native test runner; compatible with ESM |

---

## Further Reading

- [Architecture Decision Records](../docs/ARCHITECTURE.md)
- [Platform Boundaries](../docs/PLATFORM_BOUNDARIES.md)
- [Gate 0 Baseline](../docs/GATE0_BASELINE.md)
- [Global Ecosystem Integration](../docs/GLOBAL_ECOSYSTEM_INTEGRATION.md)
- [Developer Setup →](developer-setup.md)
