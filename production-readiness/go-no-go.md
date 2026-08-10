# Go / No-Go Decision

## Release

| Field | Value |
| --- | --- |
| Release version / commit | |
| Environment | Production |
| Deployment date and time | |
| Technical owner | |
| Business owner | |

## Critical checks

| Check | Status | Evidence / link | Owner |
| --- | --- | --- | --- |
| Database migration completed | ☐ Pass ☐ Fail | | |
| PostgreSQL connectivity and backups verified | ☐ Pass ☐ Fail | | |
| Redis cache warming and `/health/cache` verified | ☐ Pass ☐ Fail | | |
| JWT, CORS, HTTPS, and secrets verified | ☐ Pass ☐ Fail | | |
| Monitoring, logging, dashboards, and alerts verified | ☐ Pass ☐ Fail | | |
| Restore test and rollback plan verified | ☐ Pass ☐ Fail | | |
| Smoke and load tests meet objectives | ☐ Pass ☐ Fail | | |

## Risks

| Risk | Severity | Mitigation | Accepted by |
| --- | --- | --- | --- |
| | ☐ Low ☐ Medium ☐ High | | |

## Decision

- [ ] **GO** — all critical checks pass; high-risk items are resolved or formally accepted.
- [ ] **NO-GO** — one or more critical checks fail or required approvals are missing.

| Approval | Name | Date and time | Signature / reference |
| --- | --- | --- | --- |
| Technical owner | | | |
| Business owner | | | |
| Operations / security owner | | | |

## Rollback trigger

State the measurable condition requiring rollback, the rollback owner, and the target previous release:

```text
Trigger:
Owner:
Rollback target:
Verification after rollback:
```
