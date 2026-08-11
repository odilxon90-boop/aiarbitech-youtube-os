# Change Register

This register tracks approved and proposed platform changes with ownership, scope, sprint linkage, and execution state.

## Change Register Table

| CR ID | Change Name / Reason | Impacted Modules | Owner | Sprint | Status |
|---|---|---|---|---|---|
| CR-001 | Foundation v1.1 synchronization baseline update to align governance artifacts after feature freeze. | Platform, Registration, Governance Docs, Integration Gateway | Architecture Owner | AAT-YTOS-SYNC-1.1 | OPEN |
| CR-002 | Contract boundary hardening for API/Event validation and compatibility checks. | Integration Gateway, Platform Contracts, Health/Compatibility | Integration Owner | AAT-YTOS-SYNC-1.1 | IN_PROGRESS |
| CR-003 | Monitoring signal normalization for release and rollback decision support. | Monitoring, Dashboard, Incident Operations | SRE Owner | AAT-YTOS-OPS-1.1 | OPEN |
| CR-004 | Admin operational playbook standardization for incident and escalation handling. | Admin Panel, Incident Docs, Workflow Operations | Operations Owner | AAT-YTOS-OPS-1.1 | COMPLETED |
| CR-005 | AI Director governance checkpoint enforcement before high-impact directive execution. | AI Director, Workflow, Audit | AI Governance Owner | AAT-YTOS-AI-1.1 | OPEN |

## Definitions

- `OPEN`: Registered but execution not started.
- `IN_PROGRESS`: Active implementation or validation.
- `COMPLETED`: Implemented and verified.
- `REJECTED`: Not approved for execution.

## Usage Notes

- Every change entry must include a clear reason and impacted module scope.
- Change execution must remain aligned with Constitution, architecture boundaries, and audit requirements.
