# Incident Response Procedure — YouTube OS

This document defines the step-by-step process for detecting, triaging, resolving, and reviewing incidents. Follow these steps in order. Speed and communication matter more than perfection during an active incident.

---

## Phase 1 — Detect

**Goal:** Know that something is wrong.

### Detection Sources

| Source | Example | Who sees it first |
|---|---|---|
| Alertmanager alert | `HighAPIErrorRate` fires | Primary on-call (PagerDuty/Slack) |
| Grafana dashboard | Error rate spike visible | Anyone watching dashboards |
| Smoke tests fail | Post-deployment test exits 1 | CI/CD pipeline notification |
| User report | Creator reports broken dashboard | Support channel → on-call |
| Internal discovery | Engineer notices anomaly | First discoverer → on-call |

### Detection Checklist

- [ ] Alert or report received
- [ ] Note the exact time of detection (UTC)
- [ ] Note the source (alert name, user report, observation)
- [ ] Proceed to Triage immediately

---

## Phase 2 — Triage

**Goal:** Understand what is broken and how severe it is.

**Time limit:** 5 minutes. If you cannot determine severity in 5 minutes, default to P1 and escalate.

### Triage Steps

1. **Check dashboards first**
   - Grafana: http://localhost:3001 (or staging/production URL)
   - Prometheus targets: http://localhost:9090/targets
   - Look for: error rate, latency spikes, service down indicators

2. **Check service health**
   ```bash
   curl https://api.youtube-os.aiarbitech.com/api/v1/health
   curl https://api.youtube-os.aiarbitech.com/api/v1/health/db
   curl https://api.youtube-os.aiarbitech.com/api/v1/health/cache
   ```

3. **Check recent deployments**
   - Was there a deployment in the last 30 minutes?
   - Check CI/CD pipeline status
   - Check git log for recent merges to main

4. **Check infrastructure**
   ```bash
   docker ps                           # Are all containers running?
   docker logs aiarbitech-youtube-os-backend --tail=50
   docker logs aiarbitech-youtube-os-postgres --tail=20
   docker logs aiarbitech-youtube-os-redis --tail=20
   ```

5. **Assign severity** — see [severity-levels.md](severity-levels.md)

6. **Assign incident owner** (usually the primary on-call)

### Triage Checklist

- [ ] Time of detection noted (UTC)
- [ ] Affected services identified
- [ ] Severity assigned (P0/P1/P2/P3)
- [ ] Incident owner assigned
- [ ] Recent deployment checked (yes/no)
- [ ] Proceed to Respond

---

## Phase 3 — Respond

**Goal:** Communicate, coordinate, and begin investigation.

### Respond Steps

**For P0/P1:**

1. **Open an incident Slack channel**
   ```
   Channel name: #incident-YYYY-MM-DD-p[severity]-[short-description]
   Example:      #incident-2026-08-09-p0-backend-down
   ```

2. **Post the incident declaration message** (copy template):
   ```
   🚨 INCIDENT DECLARED — P[X]

   Summary: [one sentence describing the problem]
   Severity: P[X]
   Detected: [HH:MM UTC]
   Owner: @[your name]
   Status: Investigating

   Dashboard: [Grafana URL]
   Next update: [HH:MM UTC] (in 15 min for P0, 30 min for P1)
   ```

3. **Update status page** (for P0/P1 with user impact):
   - Status: "Investigating"
   - Message: "We are investigating an issue affecting [feature]. Updates to follow."

4. **Page secondary on-call** for P0 (they join as backup)

5. **Page escalation manager** for P0

**For P2/P3:**

- Open a thread in `#incidents`
- Note the issue, severity, and owner
- No status page update unless user-visible

### Response Checklist

- [ ] Incident channel opened (P0/P1)
- [ ] Incident declaration posted
- [ ] Status page updated (if user-visible)
- [ ] Secondary paged (P0 only)
- [ ] Escalation manager notified (P0, or P1 > 30 min)
- [ ] Proceed to Investigate

---

## Phase 4 — Investigate

**Goal:** Find the root cause or contributing factors.

### Investigation Toolkit

**Application logs:**
```bash
# Backend logs (last 100 lines)
docker logs aiarbitech-youtube-os-backend --tail=100 --since=30m

# Search for errors
docker logs aiarbitech-youtube-os-backend 2>&1 | grep -i "error\|exception\|fatal"

# Follow live
docker logs -f aiarbitech-youtube-os-backend
```

**Database diagnostics:**
```sql
-- Active connections
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

-- Slow queries
SELECT query, calls, total_exec_time / calls AS avg_ms
FROM pg_stat_statements
ORDER BY avg_ms DESC LIMIT 10;

-- Locks
SELECT pid, query, wait_event_type, wait_event
FROM pg_stat_activity WHERE wait_event IS NOT NULL;
```

**Redis diagnostics:**
```bash
redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses|evicted|connected"
redis-cli INFO memory | grep -E "used_memory_human|mem_fragmentation"
redis-cli SLOWLOG GET 10
```

**Metrics queries (Prometheus/Grafana):**
```promql
# Error rate over last 5 minutes
(sum(rate(http_request_total{status=~"5.."}[5m])) / sum(rate(http_request_total[5m]))) * 100

# p95 latency
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Which endpoint is failing most
sum by (path) (rate(http_request_total{status=~"5.."}[5m]))
```

**Recent changes:**
```bash
git log --oneline -10                              # Recent commits
git log --oneline --since="2 hours ago"            # Last 2 hours
```

### Investigation Checklist

- [ ] Logs reviewed for errors and exceptions
- [ ] Metrics checked for anomalies
- [ ] Recent deployments reviewed
- [ ] Database health confirmed
- [ ] Redis health confirmed
- [ ] Root cause hypothesis formed
- [ ] Proceed to Mitigate

---

## Phase 5 — Mitigate

**Goal:** Stop the bleeding. Restore service as fast as possible. Perfect is the enemy of good here.

### Mitigation Options (in order of preference)

**Option A — Rollback (fastest, safest for deployment-related incidents)**
```bash
# Identify last good deployment tag
git log --oneline --tags

# Roll back to previous image
docker compose pull
docker compose up -d --force-recreate backend

# Or roll back to specific commit
git checkout [last-good-commit]
docker compose build backend
docker compose up -d backend
```

**Option B — Restart affected service**
```bash
docker compose restart backend
docker compose restart redis
docker compose restart postgres
```

**Option C — Apply a targeted fix**
- Only if root cause is confirmed and fix is low-risk
- Deploy via normal CI/CD pipeline if time allows
- For P0: apply hotfix directly with escalation manager approval

**Option D — Feature flag / disable degraded feature**
- Disable the broken feature via configuration if possible
- Allows rest of platform to continue working

**Option E — Scale or failover**
- Increase container replicas
- Fail over to backup infrastructure

### Mitigation Checklist

- [ ] Mitigation strategy chosen and documented in incident channel
- [ ] Escalation manager approved any direct production changes (P0)
- [ ] Mitigation applied
- [ ] Initial verification done (see Phase 6)
- [ ] Status page updated: "Fix applied, monitoring"

---

## Phase 6 — Resolve

**Goal:** Confirm service is fully restored and stable.

### Resolution Steps

1. **Run smoke tests:**
   ```bash
   BASE_URL=https://api.youtube-os.aiarbitech.com \
   SMOKE_USER=smoke@youtube-os.test \
   SMOKE_PASS=$SMOKE_PASS \
   ./smoke-tests/test.sh
   ```

2. **Monitor dashboards for 10–15 minutes** — confirm error rate returns to baseline (< 0.1%), latency normal

3. **Check all affected features manually** if smoke tests pass

4. **Post resolution message** in incident channel:
   ```
   ✅ INCIDENT RESOLVED

   Resolved at: [HH:MM UTC]
   Duration: [X hours Y minutes]
   Root cause: [one sentence]
   Fix applied: [brief description]

   Monitoring continues. Post-mortem scheduled: [date/time]
   ```

5. **Update status page**: "Resolved — service has been restored."

6. **Close PagerDuty alert**

7. **Schedule post-mortem** (within 48 hours for P0/P1)

### Resolution Checklist

- [ ] Smoke tests passing
- [ ] Error rate back to baseline (< 0.1%)
- [ ] Latency normal (p95 < 500ms)
- [ ] Affected features verified manually
- [ ] Resolution message posted in incident channel
- [ ] Status page updated to "Resolved"
- [ ] PagerDuty alert closed
- [ ] Post-mortem scheduled

---

## Communication Templates

### Status Page — Investigating
```
We are currently investigating an issue affecting [feature/service].
Our team is aware and actively working on a resolution.
Next update in 15 minutes.
```

### Status Page — Identified
```
We have identified the cause of the issue affecting [feature/service].
We are implementing a fix now.
Next update in 15 minutes.
```

### Status Page — Resolved
```
The issue affecting [feature/service] has been resolved.
Service has been fully restored as of [HH:MM UTC].
We will conduct a post-mortem and share a summary of findings.
Thank you for your patience.
```

### Stakeholder Email (P0, impact > 30 minutes)
```
Subject: [YouTube OS] Service Disruption — [Date]

We are writing to inform you of a service disruption affecting YouTube OS.

What happened: [brief description]
When it started: [HH:MM UTC]
Who was affected: [scope]
Current status: [Investigating / Fix in progress / Resolved]

We are actively working to restore full service and will provide updates
every 30 minutes until resolved.

We apologize for the inconvenience.

— YouTube OS Engineering Team
```

---

## Phase 7 — Review

**Goal:** Learn from the incident and prevent recurrence.

- Complete the [post-mortem template](post-mortem-template.md) within 48 hours (P0/P1) or 1 week (P2)
- Schedule a blameless post-mortem meeting with all responders
- Identify and track action items with owners and due dates
- Share learnings with the broader team in `#engineering`
