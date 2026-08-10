# AIArbiTech YouTube OS

AIArbiTech YouTube OS is an **independent platform service** governed by the AIArbiTechnology Global Ecosystem.

## Foundation status

This repository contains foundation infrastructure only. It intentionally contains no YouTube channel, video, publishing, revenue, or analytics business implementation.

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

## Packages

- `frontend/`: React, TypeScript, and Vite platform shell.
- `backend/`: Node.js, TypeScript, Fastify, Prisma, Zod foundation API.
- `contracts/`: versioned compatibility placeholders; not approved production contracts.
- `docs/`: architecture, boundaries, integration, and Gate 0 baseline.

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

## Local PostgreSQL

```bash
docker compose up -d postgres
```

Copy `.env.example` to the appropriate local runtime environment only when running services. Never commit secrets.
