# Go-Live Runbook

## Roles

| Role | Responsibility |
| --- | --- |
| Release lead | Coordinates timeline and Go/No-Go decision. |
| Backend owner | Deploys backend, migrations, and health validation. |
| Frontend owner | Deploys frontend and validates user journeys. |
| Operations owner | Monitors infrastructure, alerts, logs, and rollback. |
| Business owner | Approves public launch communication. |

## 1. Open the launch window

1. Confirm on-call contacts are available.
2. Create an incident channel and share dashboard, deployment, and rollback links.
3. Record the currently running backend and frontend release versions.
4. Confirm the latest database backup and recovery point.

## 2. Deploy backend

1. Deploy the approved backend artifact.
2. Provide production secrets through the deployment platform: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `CORS_ORIGIN`, and bootstrap credentials.
3. Run `npm run db:migrate` once against production when the release includes a schema migration.
4. Confirm:

   ```text
   GET /api/v1/health/live
   GET /api/v1/health/ready
   GET /health
   GET /health/db
   GET /health/cache
   ```

5. Confirm `/health/cache` is healthy and cache warming completed.

## 3. Deploy frontend

1. Deploy the approved frontend artifact.
2. Confirm the configured API origin is the production backend.
3. Verify HTTPS, CORS, and browser console output.
4. Verify login, dashboard, analytics, AI chat, workflow, and quality pages.

## 4. Validate production traffic

1. Begin with the approved canary or progressive traffic percentage.
2. Monitor error rate, P95 latency, database connections, Redis health, and authentication failures for 15 minutes.
3. Increase traffic only if metrics remain within objectives.
4. At full traffic, continue monitoring for 60 minutes.

## 5. Close the launch

1. Record deployed versions, migration result, dashboard links, and observed metrics.
2. Confirm business-owner approval to announce availability.
3. Announce launch through approved communication channels.
4. Keep heightened monitoring active for the agreed observation period.

Escalate immediately and use `rollback.md` if a critical health check fails, error rate exceeds 1%, P95 latency exceeds 500 ms, or data integrity is at risk.
