# Production Readiness Checklist

Complete every item before deploying AIArbiTech YouTube OS. Record evidence, owner, and completion date in the deployment change record.

## Infrastructure

- [ ] Production Docker image is built from a pinned release commit and scanned.
- [ ] Fly.io application, region, secrets, autoscaling limits, and rollback release are configured.
- [ ] PostgreSQL uses the production `DATABASE_URL`; migration has completed successfully.
- [ ] PostgreSQL connection pooling, backups, retention, and least-privilege roles are configured.
- [ ] Redis is reachable through `REDIS_URL`; `/health/cache` reports `HEALTHY`.
- [ ] Redis eviction policy, memory limit, TLS, and credentials are configured.
- [ ] Required environment variables are supplied by the deployment secret manager, not source control.

## Security

- [ ] `JWT_SECRET` is random, at least 32 characters, stored as a deployment secret, and rotated per policy.
- [ ] `AUTH_BOOTSTRAP_ADMIN_PASSWORD` is set through the secret manager and changed after initial access.
- [ ] JWT expiry and refresh expiry match the approved session policy.
- [ ] Production CORS origin allows only the deployed frontend origin.
- [ ] Helmet security headers are active.
- [ ] HTTPS/TLS certificate is valid; HTTP redirects to HTTPS.
- [ ] Rate limiting is enabled at the edge or application layer for login and public endpoints.
- [ ] Dependency audit has no unaccepted high or critical vulnerabilities.

## Performance

- [ ] Load test covers login, dashboard, quality, workflow, and gateway endpoints.
- [ ] P95 response time, throughput, and error rate meet approved service-level objectives.
- [ ] Redis warming completes on startup; 15-minute refresh jobs run successfully.
- [ ] Database query and connection-pool metrics stay within capacity limits.
- [ ] Frontend production build is generated and bundle size is reviewed.

## Monitoring and Operations

- [ ] Structured logs are collected centrally and searchable by correlation ID.
- [ ] `/health`, `/health/db`, `/health/gateway`, and `/health/cache` are monitored.
- [ ] Prometheus metrics, Grafana dashboards, and Alertmanager routing are configured.
- [ ] Alerts exist for downtime, elevated error rate, slow responses, database failures, and Redis failures.
- [ ] On-call owner, escalation path, and incident runbook are documented.

## Backup and Recovery

- [ ] PostgreSQL automated backups and point-in-time recovery are enabled.
- [ ] File/object storage backups, retention, and encryption are configured where applicable.
- [ ] A restore test has succeeded using a non-production environment.
- [ ] Recovery point objective and recovery time objective are approved.

## Documentation and Approval

- [ ] README, API/OpenAPI contract, environment variable reference, and deployment guide are current.
- [ ] UAT plan is executed and business acceptance is recorded.
- [ ] Known risks have an owner, mitigation, and accepted severity.
- [ ] Business owner and technical owner approve the release.
