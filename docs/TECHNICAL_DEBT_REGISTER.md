# Technical Debt Register

This register tracks known technical debt, rationale, cleanup targets, and ownership.

## Technical Debt Table

| Debt ID | Short Description | Why It Was Introduced (Temporary Solution) | Target Date | Owner | Status |
|---|---|---|---|---|---|
| TD-001 | Mock-only Global integration adapter remains primary boundary implementation. | Authoritative production contract not available during foundation phase. | 2026-10-15 | Integration Owner | OPEN |
| TD-002 | Partial dashboard mock data dependencies in executive and admin views. | UI progress required before full backend contract readiness. | 2026-09-30 | Frontend Owner | IN_PROGRESS |
| TD-003 | Manual release checklist steps not fully automated in pipeline. | Initial release process prioritized documentation over automation. | 2026-11-01 | DevOps Owner | OPEN |
| TD-004 | AI directive fallback decision matrix not fully parameterized by risk class. | Baseline safety controls shipped first; fine-grained policy matrix deferred. | 2026-10-25 | AI Governance Owner | OPEN |
| TD-005 | Contract compatibility reporting granularity limited to coarse status outputs. | Foundation scope optimized for baseline compatibility visibility only. | 2026-10-05 | Platform Owner | OPEN |

## Definitions

- Status values: `OPEN`, `IN_PROGRESS`, `RESOLVED`.
- `Target Date` must be revised if dependency blockers change.

## Usage Notes

- Every debt item must map to an owner and a cleanup window.
- Resolved items should retain reference to validation evidence.
