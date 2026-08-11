# DoR and DoD

This document defines Definition of Ready (DoR) and Definition of Done (DoD) for YouTube OS delivery governance.

## 1. Definition of Ready (DoR)

A task is ready for coding only when all required preconditions are satisfied.

### Ready Checklist

- Requirement is clear
  Task scope, expected behavior, acceptance criteria, and out-of-scope boundaries are explicitly defined.
- Architecture is aligned
  The task is consistent with platform boundaries, constitutional constraints, and approved architecture rules.
- Dependencies are identified
  Internal/external dependencies, ownership, and sequencing impact are documented.
- API contract exists
  Required API/event contract is available, versioned, and approved for the planned implementation scope.
- Ecosystem review is completed
  Cross-platform impact and Global Ecosystem alignment review has been completed and recorded.

### DoR Decision Rule

- If any checklist item is incomplete, the task remains `NOT_READY` and coding must not start.

## 2. Definition of Done (DoD)

A task is complete only when implementation and all quality/governance verifications are finished.

### Done Checklist

- Code is implemented
  Required code changes are complete and traceable to approved requirement scope.
- Tests are passing
  Relevant unit/integration/contract/smoke tests pass with no unresolved regression.
- Code review is approved
  Review comments are resolved and required approvals are granted.
- Security verification is passed
  Security checks for permissions, boundary compliance, and risk controls are completed.
- Documentation is updated
  User/developer/architecture or operational docs are updated as required by the change.
- Audit is completed
  Required audit evidence and governance traceability are recorded and verified.

### DoD Decision Rule

- If any checklist item is incomplete, the task remains `NOT_DONE` and cannot be marked complete.

## Operating Principle

In YouTube OS, delivery follows strict quality governance:

`Ready -> Implement -> Verify -> Audit -> Done`