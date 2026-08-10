# User Acceptance Test Cases

## Execution rules

- Record the environment, build identifier, executor, and execution time before testing.
- Use a dedicated non-production account and representative non-sensitive test data.
- A failed prerequisite makes the case **BLOCKED**, not passed.
- P0 must pass at 100%, P1 at 95% or higher, and P2 at 80% or higher for release approval.

| ID | Scenario | Priority | Preconditions | Test steps | Expected result | Status |
| --- | --- | --- | --- | --- | --- | --- |
| UAT-01 | SCN-AUTH | P0 | Active test account and application are available. | Sign in with valid credentials. | User is authenticated and reaches the dashboard. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-02 | SCN-AUTH | P0 | Active test account is available. | Sign in with an invalid password. | Authentication is rejected without revealing account details. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-03 | SCN-AUTH | P0 | Authenticated user has an active refresh token. | Refresh the access token, then call an authenticated API. | New token works and the API returns authorized data. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-04 | SCN-AUTH | P0 | Authenticated user has an active session. | Sign out, then reuse the session token. | Sign-out succeeds and the revoked token is rejected. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-05 | SCN-AUTH | P0 | A user without an admin permission exists. | Request an admin-only action. | Request is denied with an authorization error. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-06 | SCN-DASH | P0 | Authenticated dashboard user. | Load the dashboard from a cold browser session. | Dashboard loads within the approved response-time target and displays a summary. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-07 | SCN-DASH | P1 | Known dashboard fixture data exists. | Compare displayed summary values with fixture/API data. | Creator score, workflows, and quality values match the source data. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-08 | SCN-AI | P0 | Authenticated user with AI permission. | Send a valid assistant message. | A relevant response is returned without an application error. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-09 | SCN-AI | P1 | Authenticated user with AI permission. | Send an empty, oversized, and malformed message. | Validation feedback is clear; the application remains usable. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-10 | SCN-ANALYTICS | P1 | Authenticated analytics user and fixture metrics exist. | Open analytics overview. | KPI cards and charts match the fixture metrics. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-11 | SCN-ANALYTICS | P1 | Analytics filters and multiple fixture periods exist. | Change the time-range and channel filters. | Displayed metrics update only for the selected filters. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-12 | SCN-GOALS | P1 | Authenticated goals user. | Create a goal with valid title, target, and due date. | New goal appears with the submitted values. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-13 | SCN-GOALS | P1 | A user-owned goal exists. | Update its target, then delete it. | Update persists; deletion removes only the selected goal. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-14 | SCN-VIDEO | P1 | Video fixture records exist. | Open the video library and select a record. | List renders and the selected metadata matches the fixture. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-15 | SCN-VIDEO | P1 | A user can edit a video fixture. | Change title, description, and tags, then save. | Metadata persists after reload and is visible only to authorized users. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-16 | SCN-MUSIC | P2 | Music catalog fixtures include licensed and unlicensed tracks. | Browse catalog and search by title and genre. | Matching tracks display with correct license status. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-17 | SCN-MUSIC | P2 | A track with license restrictions exists. | Attempt to attach the restricted track to a project. | Restriction is explained and no invalid assignment is saved. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-18 | SCN-GENRE | P2 | Genre preference and recommendation fixtures exist. | Request recommendations for a selected genre. | Recommendations match the selected genre and eligibility rules. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-19 | SCN-GENRE | P2 | Caching is enabled and recommendation data exists. | Repeat the same recommendation request. | Equivalent results return within the approved cached-response target. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-20 | SCN-ADMIN | P0 | Administrator and standard-user test accounts exist. | Open user management as an administrator. | Administrator can view permitted user-management controls. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-21 | SCN-ADMIN | P0 | A moderation fixture exists. | Apply and reverse a moderation action, recording a reason. | Action is recorded, reversible when authorized, and visible in audit history. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-22 | SCN-PERF | P0 | Production-like environment and agreed response targets. | Call health, login, dashboard, and AI endpoints at normal expected traffic. | No errors occur and each endpoint meets its agreed response target. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-23 | SCN-PERF | P1 | Load-test environment and approved concurrency profile. | Run the approved concurrent-request profile. | Error rate and latency remain within release thresholds. | ☐ PASS ☐ FAIL ☐ BLOCKED |
| UAT-24 | SCN-PERF | P1 | Monitoring and centralized logging are active. | Trigger a controlled invalid request and inspect monitoring. | Error is observable in metrics and logs with correlation metadata. | ☐ PASS ☐ FAIL ☐ BLOCKED |

## Results summary

| Priority | Total | Passed | Failed | Blocked | Required pass rate | Actual pass rate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| P0 | 10 | 4 | 0 | 6 | 100% | 40% |
| P1 | 10 | 2 | 2 | 6 | 95% | 20% |
| P2 | 4 | 0 | 0 | 4 | 80% | 0% |

## Execution results (2026-08-09)

Environment: local backend at `http://localhost:3000`, local PostgreSQL/Redis monitoring stack, smoke test account. Browser frontend, approved load profile, and non-admin test account were not available.

| ID | Result | Evidence or reason |
| --- | --- | --- |
| UAT-01 | BLOCKED | Login API succeeded, but no frontend was running to verify dashboard redirect. |
| UAT-02 | PASS | Invalid password returned HTTP 401. |
| UAT-03 | PASS | Refreshed access token successfully authorized dashboard API access. |
| UAT-04 | PASS | Logged-out token was rejected with HTTP 401. |
| UAT-05 | BLOCKED | No standard-user account or role-management setup was available. |
| UAT-06 | BLOCKED | No browser frontend or approved cold-load response-time target was available. |
| UAT-07 | PASS | Dashboard API returned fixture values: creator score 72, active workflows 2, quality score 91. |
| UAT-08 | PASS | AI API returned the expected mock response for `hello`. |
| UAT-09 | FAIL | Empty AI message returned HTTP 200 instead of validation feedback. |
| UAT-10 | PASS | Analytics overview API returned fixture KPI data. |
| UAT-11 | FAIL | Time-range and channel query parameters returned the same unfiltered analytics response. |
| UAT-12 | BLOCKED | No goals create endpoint or UI was available. |
| UAT-13 | BLOCKED | No goals update/delete endpoint or UI was available. |
| UAT-14 | BLOCKED | No video library endpoint or UI was available. |
| UAT-15 | BLOCKED | No video metadata update endpoint or UI was available. |
| UAT-16 | BLOCKED | No music catalog endpoint, fixture, or UI was available. |
| UAT-17 | BLOCKED | No music licensing workflow or fixture was available. |
| UAT-18 | BLOCKED | No genre recommendation endpoint or fixture was available. |
| UAT-19 | BLOCKED | No cached genre recommendation workflow or approved response target was available. |
| UAT-20 | BLOCKED | Admin users API returned HTTP 200, but no frontend user-management view was running. |
| UAT-21 | BLOCKED | No moderation action/reversal endpoint or audit fixture was available. |
| UAT-22 | BLOCKED | Health, login, dashboard, and AI endpoints responded, but no approved performance thresholds existed. |
| UAT-23 | BLOCKED | No approved load profile or production-like load-test environment was available. |
| UAT-24 | BLOCKED | Loki/Vector were running, but backend logs were not mounted or shipped to Vector for correlation verification. |
