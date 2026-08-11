# Development Standards

This document defines coding and collaboration standards for YouTube OS.

## 1. Folder Structure

Repository layout follows clear ownership boundaries:

- `backend/`: API server, domain contexts, middleware, config, tests.
- `frontend/`: UI shell, pages, components, client adapters, tests.
- `contracts/`: versioned API and event contract artifacts.
- `governance/`: capability, policy, boundary, and platform manifests.
- `docs/`: architecture and operating documentation.

Structure rules:

- Each bounded context owns its routes, services, and models.
- Shared utilities belong in explicit shared folders only.
- Cross-context coupling is prohibited unless routed through approved boundaries.

## 2. Naming Conventions

General rules:

- Files and folders: kebab-case (`dashboard-service.ts`, `platform-health.test.ts`).
- Types/interfaces/classes: PascalCase (`PlatformHealthService`, `DashboardSummary`).
- Variables/functions: camelCase (`loadGovernanceData`, `healthStatus`).
- Constants: UPPER_SNAKE_CASE for immutable config keys.
- Test files: `*.test.ts` or `*.test.tsx` located in test directories.

Domain naming rules:

- Use domain-specific names over generic labels (`registration-readiness` instead of `data2`).
- Endpoint names should align with bounded context and API versioning model.

## 3. Code Style

Style baseline:

- TypeScript-first with explicit types at module boundaries.
- Keep functions focused and small; prefer composable services.
- Validate external input at boundaries (request, integration, config).
- Use structured error handling with consistent error objects.
- Avoid hidden side effects; keep service behavior deterministic.

Readability rules:

- Prefer clear names over short abbreviations.
- Write concise comments only where logic is non-obvious.
- Do not duplicate global capability logic locally.

## 4. Git Strategy (Branch, Commit, PR)

Branch strategy:

- `main` is protected and deployable.
- Work in short-lived feature/fix/docs branches where possible.
- Keep branch scope single-purpose.

Commit strategy:

- One logical change per commit.
- Use clear commit messages: `type: short summary`.
- Recommended types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

PR strategy:

- Open PRs early for visibility.
- Keep PR size reviewable.
- Link related issue/task/reference in PR description.

## 5. Pull Request and Review Process

PR checklist:

- Scope is clear and bounded.
- Architecture and boundary rules are respected.
- No prohibited dependencies or direct cross-platform DB usage.
- Tests are updated or added for behavioral changes.
- Docs are updated when behavior or process changes.

Review process:

- At least one qualified reviewer is required.
- Reviewer checks correctness, security, boundary compliance, and test quality.
- Author addresses comments with follow-up commits.
- Merge only after approvals and green checks.

## 6. Testing Standards

Testing layers:

- Unit tests for service and utility logic.
- Integration tests for route and boundary behavior.
- Contract tests for API/event compatibility expectations.
- Smoke tests for deployment-level critical paths.

Minimum expectations:

- New logic requires tests for happy path and failure path.
- Regression tests are mandatory for bug fixes.
- Test data should be deterministic and isolated.
- CI gates must pass: typecheck, tests, build.

Quality gate rule:

- Implementation is not complete until verification and test evidence are complete.

## Notes

- These standards operate under Constitution, Architecture, Security, and Governance controls.
- In case of conflict, higher-order governance documents take precedence.