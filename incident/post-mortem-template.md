# Post-Mortem Template — YouTube OS

**Purpose:** This template captures the facts, timeline, contributing factors, and action items for an incident. Post-mortems are **blameless** — the goal is to understand what happened and improve systems, not to assign personal fault.

Complete within **48 hours** of resolution for P0/P1 incidents, within **1 week** for P2.

---

## Incident Details

| Field | Value |
|---|---|
| **Incident ID** | INC-YYYY-MM-DD-NNN |
| **Title** | _One-sentence description_ |
| **Severity** | P0 / P1 / P2 / P3 |
| **Status** | Resolved |
| **Detected At** | YYYY-MM-DD HH:MM UTC |
| **Resolved At** | YYYY-MM-DD HH:MM UTC |
| **Total Duration** | _X hours Y minutes_ |
| **Incident Owner** | _______________ |
| **Post-Mortem Author** | _______________ |
| **Review Meeting** | YYYY-MM-DD HH:MM UTC |
| **Attendees** | _______________ |

---

## Summary

_Write 2–4 sentences describing what happened, who was affected, and how it was resolved. This section is suitable for sharing with stakeholders who were not directly involved._

> Example: On 2026-08-09 at 14:32 UTC, the YouTube OS backend became unresponsive due to a misconfigured database connection pool following a deployment. All API requests began returning 503 errors. The issue was detected via Alertmanager within 3 minutes and resolved by rolling back to the previous deployment within 22 minutes. Approximately 150 active creator sessions were affected.

---

## Impact

| Category | Detail |
|---|---|
| **User impact** | _e.g., "All users unable to access dashboard for 22 minutes"_ |
| **Error rate at peak** | ___% |
| **Affected features** | _List affected features or endpoints_ |
| **Estimated users affected** | ___ |
| **Data loss / corruption** | Yes / No — details: ___ |
| **Revenue impact** | _If known_ |
| **SLA impact** | _If applicable_ |

---

## Timeline

List events in chronological order with UTC timestamps. Include detection, key investigation steps, mitigation actions, and resolution. Be specific.

| Time (UTC) | Event |
|---|---|
| HH:MM | Alert fired: `[AlertName]` |
| HH:MM | Primary on-call acknowledged alert |
| HH:MM | Incident channel `#incident-[name]` opened |
| HH:MM | Initial triage: severity assessed as P[X] |
| HH:MM | Secondary on-call / escalation manager notified |
| HH:MM | Status page updated: "Investigating" |
| HH:MM | Root cause hypothesis: ___ |
| HH:MM | Mitigation started: ___ |
| HH:MM | Status page updated: "Fix applied, monitoring" |
| HH:MM | Smoke tests passed |
| HH:MM | Incident resolved — service fully restored |
| HH:MM | Status page updated: "Resolved" |
| HH:MM | PagerDuty alert closed |

---

## Root Cause

_Describe the specific technical cause of the incident. Be precise. Include the chain of events that led from the initial cause to the user-visible failure._

**Contributing Factors:**
- _Factor 1_ (e.g., No connection pool size limit configured)
- _Factor 2_ (e.g., Deployment process does not run smoke tests pre-cutover)
- _Factor 3_ (e.g., Alert threshold too high — alert fired 3 minutes after onset)

**Root Cause Statement:**

> _One or two sentences identifying the single most proximate cause._
> Example: "A deployment to production set `DATABASE_POOL_MAX` to 0 (disabled) instead of 20, causing all database queries to fail immediately after the deployment completed."

---

## Detection

| Question | Answer |
|---|---|
| How was the incident detected? | _Alert / user report / internal discovery_ |
| What was the alert that fired? | _Alert name and condition_ |
| Time from onset to detection | _X minutes_ |
| Was detection fast enough? | Yes / No |
| If no, why not? | ___ |

---

## Response

| Question | Answer |
|---|---|
| Time from detection to acknowledgment | _X minutes_ |
| Time from acknowledgment to mitigation start | _X minutes_ |
| Time from mitigation start to resolution | _X minutes_ |
| Was the response procedure followed? | Yes / Mostly / No — details: ___ |
| Were the right people notified? | Yes / No — details: ___ |
| Were communication updates timely? | Yes / No — details: ___ |

---

## What Went Well

_List things that worked effectively during the incident. These are practices to reinforce._

- 
- 
- 

---

## What Went Wrong

_List things that did not work as expected, caused delays, or made the incident worse. These are areas for improvement._

- 
- 
- 

---

## Where We Got Lucky

_List near-misses or things that could have made the incident worse but did not. These represent hidden risks._

- 
- 
- 

---

## Action Items

List specific, concrete improvements to prevent recurrence or improve response time. Each action item must have an owner and due date.

| ID | Action | Owner | Priority | Due Date | Status |
|---|---|---|---|---|---|
| AI-001 | _e.g., Add smoke tests to deployment pipeline before cutover_ | ___ | P0 | YYYY-MM-DD | Open |
| AI-002 | _e.g., Add alert for database connection pool exhaustion_ | ___ | P1 | YYYY-MM-DD | Open |
| AI-003 | _e.g., Document rollback procedure in runbook_ | ___ | P2 | YYYY-MM-DD | Open |

Track action items in the team backlog. Review status at the next sprint planning.

---

## Metrics

| Metric | Value |
|---|---|
| MTTD (Mean Time to Detect) | _X min_ |
| MTTA (Mean Time to Acknowledge) | _X min_ |
| MTTM (Mean Time to Mitigate) | _X min_ |
| MTTR (Mean Time to Resolve) | _X min_ |
| Total incident duration | _X hr Y min_ |
| Number of engineers involved | ___ |
| Status page updates posted | ___ |
| Action items generated | ___ |

---

## Supporting Evidence

Link to relevant artifacts gathered during the investigation:

- **Grafana snapshot:** ___
- **Prometheus query results:** ___
- **Relevant log excerpts:** ___
- **Incident Slack channel:** `#incident-[name]`
- **Related PRs / commits:** ___
- **PagerDuty incident:** ___

---

## Sign-off

The post-mortem is complete when reviewed and signed off by the incident owner and an engineering lead.

| Role | Name | Sign-off Date |
|---|---|---|
| Incident Owner | _______________ | _______________ |
| Engineering Lead | _______________ | _______________ |

---

## Blameless Reminder

> This post-mortem is a tool for learning, not for assigning blame. Engineers involved in an incident are not the cause of the incident — they are the people who understood the system well enough to respond. Focus on systems, processes, and tooling. Identify structural improvements, not individual failures.
