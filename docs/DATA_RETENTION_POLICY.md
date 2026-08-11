# Data Retention Policy

## Purpose

This policy defines how long data is kept, how it is reviewed, and how it is removed safely.

## Retention Principles

- Keep data only as long as needed for approved operational, legal, and audit purposes.
- Classify data and apply retention by category.
- Ensure deletion or archival is controlled and auditable.

## Retention Matrix

| Data Type | Typical Content | Retention Target | Owner |
|---|---|---|---|
| Platform operational logs | Service and workflow activity logs | 90-180 days | Platform Operations |
| Audit evidence | Approval traces, incident records | 12-24 months | Governance + Security |
| Security events | Access/security incidents and alerts | 12-24 months | Security Owner |
| Temporary processing data | Cache and transient processing data | Short-lived by TTL policy | Platform Owner |

## Retention Process

1. Classify data source and sensitivity.
2. Apply retention target from matrix.
3. Archive or delete data based on policy and legal constraints.
4. Record retention actions for audit traceability.

## Deletion and Exception Rules

- Deletion must not break active legal, audit, or incident investigations.
- Exceptions require documented approval and expiration date.
- Emergency deletion actions must be reviewed post-action.
