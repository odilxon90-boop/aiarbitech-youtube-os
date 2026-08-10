# Incident Severity Levels — YouTube OS

Severity levels determine response urgency, communication requirements, and escalation thresholds. Every incident must be assigned a severity at triage. Re-assess severity as new information emerges — incidents can be upgraded or downgraded.

---

## Quick Reference

| Severity | Label | Response Time | Acknowledgment | Escalation | Example |
|---|---|---|---|---|---|
| **P0** | Critical | Immediate | < 5 min | Always | Platform down, data loss, security breach |
| **P1** | High | 15 minutes | < 15 min | If unresolved > 30 min | Major feature broken, high error rate |
| **P2** | Medium | 1 hour | < 1 hour | If unresolved > 4 hours | Minor feature broken, degraded performance |
| **P3** | Low | 24 hours | < 24 hours | Not required | Cosmetic issue, minor bug |

---

## P0 — Critical

**Definition:** The platform is entirely unavailable, users cannot complete core workflows, data is being lost or corrupted, or a security breach is in progress.

**Trigger Conditions (any one):**
- Backend API returning > 50% 5xx errors for > 2 minutes
- Platform completely unreachable (no HTTP response)
- Database unavailable or data corruption detected
- Active security breach (unauthorized access, data exfiltration)
- Authentication system down (no users can log in)
- PII or credentials exposed

**Response Requirements:**
- Primary on-call acknowledges within **5 minutes**
- Incident channel opened immediately (`#incident-YYYY-MM-DD-p0-[name]`)
- Secondary on-call notified as backup
- Escalation manager paged
- Status page updated within **10 minutes**: "Investigating"
- Executive notification if not resolved within **30 minutes**
- Status updates every **15 minutes**

**Resolution Target:** < 1 hour

**Communication:**
- Slack: `#incidents` (real-time), `#status` (updates)
- Status page: public update
- Email: stakeholder notification if impact > 15 minutes

---

## P1 — High

**Definition:** A major feature is broken or significantly degraded, affecting a significant portion of users, but the platform remains partially functional.

**Trigger Conditions (any one):**
- API error rate > 5% for > 5 minutes
- p95 response time > 1 second for > 5 minutes
- Dashboard, AI Assistant, Analytics, or Video Studio unavailable
- Redis or PostgreSQL degraded (elevated latency, partial unavailability)
- Authentication intermittently failing (> 1% of login attempts)
- Admin functions unavailable

**Response Requirements:**
- Primary on-call acknowledges within **15 minutes**
- Incident channel opened if impact > 30 minutes or multiple users affected
- Status page updated if user-visible impact confirmed
- Escalation manager paged if unresolved after **30 minutes**
- Status updates every **30 minutes** while active

**Resolution Target:** < 4 hours

**Communication:**
- Slack: `#incidents`
- Status page: update if user-visible
- Email: not required unless impact > 2 hours

---

## P2 — Medium

**Definition:** A feature is degraded or producing incorrect results in non-critical paths. Core platform workflows remain functional.

**Trigger Conditions (any one):**
- Non-critical feature returning errors (Goals, Music Studio, Genre recommendations)
- Performance degradation (p95 > 500ms but < 1s) for > 15 minutes
- UI rendering issues for a subset of users
- Non-critical API endpoint returning incorrect data
- Elevated but sub-threshold error rate (1–5%)
- Cache eviction warnings (not yet impacting performance)

**Response Requirements:**
- Acknowledged within **1 hour** during business hours
- Investigation starts within 1 hour
- No immediate incident channel required (use thread in `#incidents` if needed)
- Escalation manager informed (not paged) if unresolved after **4 hours**
- Status page updated only if user-visible impact is confirmed

**Resolution Target:** < 24 hours (or next business day for low-impact issues)

**Communication:**
- Slack: `#incidents` thread
- Status page: only if user-visible

---

## P3 — Low

**Definition:** Cosmetic issues, minor bugs with workarounds, or non-user-facing technical debt. No meaningful user impact.

**Trigger Conditions (any one):**
- UI text, alignment, or styling issues
- Minor feature behaving unexpectedly but with clear workaround
- Non-critical log noise or warning messages
- Documentation errors
- Monitoring alert for non-critical threshold (disk at 60%, minor memory growth)

**Response Requirements:**
- Acknowledged and logged within **24 hours**
- No incident channel required
- Ticket created in backlog with appropriate priority
- No escalation required

**Resolution Target:** Next sprint or scheduled maintenance window

**Communication:**
- Slack: optional `#incidents` mention
- Status page: no update required

---

## Severity Assessment Guide

Use this decision tree at triage to quickly classify an incident:

```
Is the platform completely down or data being lost/corrupted?
  YES → P0

Is a security breach in progress or suspected?
  YES → P0

Is a major user-facing feature unavailable (dashboard, auth, analytics)?
  YES → P1

Is the overall error rate > 5%?
  YES → P1

Is a non-critical feature degraded or intermittently failing?
  YES → P2

Is the issue cosmetic or has a clear workaround with no user impact?
  YES → P3
```

**When in doubt, start higher** — it is always better to escalate and downgrade than to under-triage a P0 as a P2.

---

## Severity Change Protocol

If severity changes during an incident:

1. Update the incident channel topic with new severity
2. Add a timestamp entry to the incident timeline: `[HH:MM UTC] Severity upgraded/downgraded from PX to PY — reason: ___`
3. Adjust communication cadence and escalation contacts to match new severity
4. Notify escalation manager of any P0/P1 upgrades immediately
