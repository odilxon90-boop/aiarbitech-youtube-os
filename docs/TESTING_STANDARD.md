# Testing Standard

This document defines testing standards for YouTube OS across development, integration, security, and release verification.

## Test Types and Standards

| Test Type | When and Where It Is Used | How It Is Executed | Responsible |
|---|---|---|---|
| Unit Test | Used during feature development at module/service/helper level in backend and frontend code areas. Applied before merge to validate isolated logic behavior. | Executed with Vitest (and Jest-compatible patterns where needed). Run per file or per module; mock external dependencies; verify happy and failure paths. | Developer (feature owner), reviewed by code reviewer |
| Integration Test | Used when validating route-service-database/cache flow, API behavior, and cross-module interactions in backend/frontend integration points. | Executed with Vitest integration setup and test fixtures. Run against controlled local test environment and dependency stubs where required. | Developer + QA/Reviewer |
| Regression Test | Used after bug fixes and before release to ensure previously fixed issues do not return and stable flows remain intact. | Executed by rerunning targeted regression scenarios and relevant automated suites (Vitest-based test sets). Regression cases are linked to issue IDs when possible. | Developer (fix owner), QA, Release owner |
| Contract Test | Used for API/Event boundary compatibility checks between YouTube OS modules and declared contract artifacts. | Executed by validating request/response and event schema behavior against versioned contracts, using automated contract assertions in test suites. | Integration owner, Backend developer |
| Security Test | Used before release and after security-sensitive changes (auth, permission, boundary, config, dependency changes). | Executed via security-focused test cases, permission boundary checks, negative-path testing, and dependency/security scan workflows. | Security owner, Developer, Reviewer |
| Focused Tests (Function-Specific) | Used during active implementation for a single function/component/flow under change to get rapid feedback. | Executed by running a narrow test selection (single file/test block) with Vitest watch or targeted command patterns. | Developer (task owner) |
| Full Test Suite | Used before PR merge, release candidate preparation, and major synchronization/audit checkpoints. | Executed by running complete automated test set (unit + integration + contract + selected regression/security checks) in CI and local verification. | Developer, CI pipeline, QA/Release owner |

## Execution Baseline

- Local development should prioritize focused tests first, then broader suites.
- Pull requests must include relevant automated test evidence.
- Release readiness requires full suite pass and no unresolved critical test failures.

## Responsibility Model

- Developer: writes and maintains tests for implemented scope.
- Reviewer: validates test quality, coverage intent, and failure handling.
- QA/Release: verifies regression quality and release-level confidence.
- Security Owner: confirms security test adequacy for sensitive changes.

## Notes

- Testing is complete only when results are reproducible and traceable.
- Failing critical tests block completion status until resolved and re-verified.