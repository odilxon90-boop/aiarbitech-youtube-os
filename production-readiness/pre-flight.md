# Production Pre-Flight Validation

Run these checks in the target production environment immediately before a release.

## 1. Verify runtime configuration

1. Confirm deployment secrets include `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CORS_ORIGIN`, and `AUTH_BOOTSTRAP_ADMIN_PASSWORD`.
2. Confirm `NODE_ENV=production`.
3. Confirm no `.env` file or secret appears in the container image, repository, logs, or CI output.

## 2. Validate services

1. Deploy the release candidate without routing public traffic.
2. Run `cd backend && npm run db:migrate`.
3. Verify PostgreSQL tables: `users`, `channels`, `videos`, `metrics`, `goals`, and `workflows`.
4. Start the backend and confirm:

   ```text
   GET /api/v1/health/live
   GET /api/v1/health/ready
   GET /health
   GET /health/db
   GET /health/gateway
   GET /health/cache
   ```

5. Confirm `/health/cache` reports `HEALTHY`, warming has populated items, and Redis is reachable.
6. Login with an approved admin account; verify the access token can call authorized endpoints and cannot access an endpoint without its required claim.

## 3. Validate security and observability

1. Confirm HTTPS certificate chain, hostname, and expiration date.
2. Verify Helmet headers and CORS behavior from the production frontend origin and an unapproved origin.
3. Trigger a controlled failing request and verify structured logs include its correlation ID.
4. Verify metrics, dashboards, and alert delivery for backend, PostgreSQL, Redis, and gateway health.

## 4. Validate recovery and release controls

1. Confirm the latest PostgreSQL backup completed successfully.
2. Confirm a recent restore test and documented rollback procedure.
3. Run smoke tests against the candidate release.
4. Record release version, migration version, test results, monitoring links, and approvers.
5. Route traffic progressively; monitor error rate and latency during the agreed observation window.
