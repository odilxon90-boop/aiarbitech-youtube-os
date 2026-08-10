# Launch Day Checklist

Record the owner and timestamp for each completed item.

## Pre-launch: T-24 hours

- [ ] Release commit, changelog, owners, and rollback version are confirmed.
- [ ] Final PostgreSQL backup completed and restore point is recorded.
- [ ] SSL certificate, DNS records, and production URLs are valid.
- [ ] Backend and frontend smoke tests pass in the release environment.
- [ ] PostgreSQL migration is rehearsed or approved.
- [ ] Redis cache warming and `/health/cache` are healthy.
- [ ] Monitoring dashboards and alert routes are accessible.
- [ ] On-call, business owner, support, and communications contacts are notified.
- [ ] No unresolved critical incidents or unaccepted high-risk changes remain.

## Launch: T-0

- [ ] Enable maintenance notice or progressive traffic controls if planned.
- [ ] Deploy backend release.
- [ ] Run database migration when required by the release.
- [ ] Confirm backend health endpoints and JWT login.
- [ ] Deploy frontend release.
- [ ] Verify frontend-to-backend CORS and API connectivity.
- [ ] Run smoke tests for login, dashboard, analytics, AI chat, workflow, and quality score.
- [ ] Verify PostgreSQL, Redis warming, logs, dashboards, and alerts.
- [ ] Announce launch to approved channels.

## Post-launch: first hour

- [ ] Error rate remains below 1%.
- [ ] P95 response time remains below 500 ms.
- [ ] No sustained database, Redis, gateway, or authentication alerts occur.
- [ ] Cache warming and scheduled refresh show healthy status.
- [ ] Backup job status is confirmed.
- [ ] Logs are reviewed for authentication failures, unhandled errors, and unusual traffic.
- [ ] Support and business teams confirm the core user journey works.
- [ ] Launch decision and observations are recorded.
