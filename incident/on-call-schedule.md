# On-Call Rotation Schedule — YouTube OS

## Overview

The on-call rotation ensures 24/7 production coverage with a clear primary and secondary responder for every hour of every week. The primary responder owns all incidents during their shift. The secondary responder is the escalation target if the primary is unreachable within 5 minutes.

---

## Rotation Structure

| Role | Shift Length | Handover Time |
|---|---|---|
| Primary On-Call | 1 week | Monday 09:00 UTC |
| Secondary On-Call | 1 week | Monday 09:00 UTC |
| Escalation Manager | 1 month | 1st of month 09:00 UTC |

Weekly handover happens every **Monday at 09:00 UTC**. The outgoing primary briefs the incoming primary on any open incidents, known flakiness, or upcoming scheduled changes.

---

## Current Rotation

Update this table each month. Weeks rotate in round-robin order through the engineering team.

| Week | Dates | Primary | Secondary | Escalation Manager |
|---|---|---|---|---|
| Week 1 | ___ – ___ | _______________ | _______________ | _______________ |
| Week 2 | ___ – ___ | _______________ | _______________ | _______________ |
| Week 3 | ___ – ___ | _______________ | _______________ | _______________ |
| Week 4 | ___ – ___ | _______________ | _______________ | _______________ |

---

## On-Call Responsibilities

### Primary On-Call

- Acknowledge PagerDuty/Alertmanager alerts within **5 minutes**
- Triage severity and open an incident channel if P0 or P1
- Lead investigation and coordinate responders
- Post status updates every 15 minutes during P0/P1 incidents
- Hand off cleanly at end of shift with written notes

### Secondary On-Call

- Monitor for escalations from the primary
- Available to join active incidents on request
- Take over if primary is unreachable after **5 minutes**
- Cover primary's shift if primary is ill or unavailable (swap agreed in advance)

### Escalation Manager

- Available for P0 incidents that cannot be resolved within 30 minutes
- Authorized to engage additional engineering resources or vendors
- Responsible for external stakeholder communication during P0 events
- Conducts post-mortems for all P0 incidents

---

## Escalation Path

```
Alert fires
    │
    ▼ (0–5 min)
Primary On-Call acknowledges
    │
    ├── Resolved quickly → close alert, log incident
    │
    ▼ (> 5 min, primary unreachable)
Secondary On-Call takes over
    │
    ├── Resolved → close alert, brief primary at handover
    │
    ▼ (P0 unresolved > 30 min)
Escalation Manager engaged
    │
    ▼ (P0 unresolved > 60 min OR data loss / security breach)
Executive notification
```

---

## Contact Information

Fill in with actual team contact details. Store credentials and phone numbers in the team's secure credential manager (not in this file).

| Name | Role | Notification Method |
|---|---|---|
| _______________ | Primary On-Call | PagerDuty, Slack DM, phone |
| _______________ | Secondary On-Call | PagerDuty, Slack DM, phone |
| _______________ | Escalation Manager | Phone, Slack DM |
| _______________ | Executive Sponsor | Phone (P0 only) |
| _______________ | Security Officer | Phone (security incidents only) |

---

## Swap and Coverage Policy

- On-call swaps must be agreed at least **24 hours in advance**
- Swaps are recorded by updating this file via a pull request
- If a swap is not recorded, the original schedule holder remains responsible
- Planned leave must be covered at least **1 week in advance**
- No engineer should be on-call for more than **2 consecutive weeks**

---

## Handover Checklist

Complete this at each Monday 09:00 UTC handover:

- [ ] Outgoing primary briefs incoming primary (15-minute call or written notes)
- [ ] Open incidents handed off with context and current status
- [ ] Alertmanager notifications confirmed routing to incoming primary
- [ ] PagerDuty schedule updated to reflect new primary
- [ ] Any scheduled deployments or maintenance windows communicated
- [ ] Known flakiness or recent regressions documented

---

## On-Call Health

On-call load is reviewed quarterly. Targets:

| Metric | Target |
|---|---|
| Average alerts per on-call week | < 5 |
| Mean time to acknowledge (MTTA) | < 5 minutes |
| Mean time to resolve (MTTR) P0 | < 1 hour |
| Mean time to resolve (MTTR) P1 | < 4 hours |
| Percentage of alerts actioned (not noise) | > 80% |

If average alerts per week exceeds 10, the team reviews alert rules for noise reduction before the next rotation cycle.
