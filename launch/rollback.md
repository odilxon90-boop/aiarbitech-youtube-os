# Critical Rollback Procedure

Use this procedure for data loss risk, authentication failure, sustained error rate above 1%, P95 latency above 500 ms, or a failing critical dependency.

## 1. Declare and stabilize

1. Release lead declares rollback and records the start time.
2. Stop progressive traffic or enable the maintenance response.
3. Notify on-call, business, support, and operations owners.
4. Preserve deployment logs, correlation IDs, metrics, and error samples.

## 2. Revert application releases

1. Roll backend back to the recorded previous healthy release.
2. Roll frontend back to the recorded previous healthy release.
3. Do not run destructive database commands during application rollback.
4. Confirm backend liveness, readiness, database, and cache health endpoints.

## 3. Handle database changes

1. Determine whether the failed release ran a database migration.
2. If migration is backward-compatible, keep it in place while the application is rolled back.
3. If migration must be reverted, use a tested, reviewed down migration.
4. Restore from the recorded backup only when data integrity requires it and the incident commander approves it.
5. Verify the restored schema and critical records before traffic is restored.

## 4. Verify and restore traffic

1. Run smoke tests for login, dashboard, workflow, quality score, and frontend API connectivity.
2. Confirm error rate is below 1%, P95 latency is below 500 ms, and alerts are clear.
3. Restore traffic progressively.
4. Confirm support and business owners see normal operation.

## 5. Close the incident

1. Record final versions, migration state, recovery action, and user impact.
2. Rotate exposed credentials if the incident involved secrets.
3. Schedule a post-incident review with root cause, corrective actions, owners, and due dates.
