# On-Call Guide — YouTube OS

This guide is your operational reference for handling on-call duties. Read it before your first on-call shift. Keep it open during incidents.

---

## Before Your Shift Starts

Complete this checklist before taking over as primary on-call:

- [ ] Read the handover notes from the outgoing primary
- [ ] Confirm PagerDuty is routing alerts to your phone number
- [ ] Confirm you can access Grafana, Prometheus, and Alertmanager
- [ ] Confirm you can SSH/connect to production infrastructure
- [ ] Know who the secondary on-call is and how to reach them
- [ ] Know who the escalation manager is and how to reach them
- [ ] Review any open incidents or known issues from the outgoing primary
- [ ] Review the Grafana dashboards — understand the current baseline

---

## When an Alert Fires

### Step 1 — Acknowledge within 5 minutes

When your PagerDuty page fires:
1. Acknowledge the alert in PagerDuty immediately
2. Open Grafana to see which metric triggered: http://grafana.youtube-os.aiarbitech.com
3. Open the Prometheus alert: http://prometheus.youtube-os.aiarbitech.com/alerts

### Step 2 — Assess severity in under 5 minutes

Use this decision tree:

```
Platform completely down or data loss in progress?   → P0
Security breach in progress?                         → P0
Major feature broken for most users?                 → P1
Non-critical feature degraded?                       → P2
Cosmetic or minor issue?                             → P3
```

If unsure → default to **P1** and escalate. Always better to over-escalate.

Full severity definitions: [incident/severity-levels.md](../incident/severity-levels.md)

### Step 3 — Open an incident channel (P0/P1)

In Slack, create a channel:
```
#incident-YYYY-MM-DD-p[severity]-[short-description]
```

Post the declaration template:
```
🚨 INCIDENT DECLARED — P[X]

Summary: [one sentence]
Severity: P[X]
Detected: [HH:MM UTC]
Owner: @[you]
Status: Investigating

Grafana: [URL]
Next update: [HH:MM UTC]
```

### Step 4 — Follow the response procedure

Full step-by-step: [incident/response-procedure.md](../incident/response-procedure.md)

---

## Escalation

### When to call the secondary on-call

- You cannot acknowledge within 5 minutes
- You need a second pair of eyes on the investigation
- You are not confident in the fix for a P0

### When to page the escalation manager

- Any P0 incident
- A P1 unresolved after 30 minutes
- Any data loss or security concern

### When to notify executives

- P0 unresolved after 60 minutes
- Confirmed data loss or PII exposure
- Security breach

**Escalation path:**
```
You (Primary) → Secondary → Escalation Manager → Executive
```

Contact details are in [incident/on-call-schedule.md](../incident/on-call-schedule.md).

---

## Common First-Response Actions

These are the most common fixes. Try them in order.

### Service is down (backend/postgres/redis)

```bash
# 1. Check container status
docker compose ps

# 2. View logs for the failing service
docker compose logs --tail=50 [service-name]

# 3. Restart the failing service
docker compose restart [service-name]

# 4. Verify health
curl http://localhost:3000/api/v1/health
```

### High error rate (> 5%)

```bash
# 1. Check which endpoints are failing
docker compose logs backend 2>&1 | grep '"statusCode":5'

# 2. Check database health
curl http://localhost:3000/api/v1/health/db

# 3. If recent deployment, consider rollback
git log --oneline -5
docker compose stop backend
# Roll back image and restart
docker compose up -d backend
```

### Deployment went bad

```bash
# 1. Run smoke tests to confirm failure
./smoke-tests/test.sh

# 2. If tests fail, rollback immediately
docker compose stop backend
# Pull and run last known good image
docker compose up -d backend

# 3. Run smoke tests again to confirm recovery
./smoke-tests/test.sh
```

### Database unresponsive

```bash
# 1. Check PostgreSQL container
docker compose ps postgres
docker compose logs postgres --tail=30

# 2. Try connecting
docker compose exec postgres psql -U youtube_os -c "SELECT 1;"

# 3. If connection refused, restart PostgreSQL
docker compose restart postgres

# 4. Wait for it to be healthy, then restart backend
docker compose ps  # wait for postgres: healthy
docker compose restart backend
```

### Redis eviction / cache miss surge

```bash
# 1. Check Redis status
docker compose exec redis redis-cli -a youtube_os INFO stats | grep evicted
docker compose exec redis redis-cli -a youtube_os INFO memory

# 2. If Redis is down, restart it
docker compose restart redis

# 3. Backend will fall back to in-memory cache automatically
# Monitor — performance may degrade slightly until Redis is back
```

---

## Diagnostic Commands Reference

```bash
# ─── Service health ────────────────────────────────────────────────────────
docker compose ps
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/health/db
curl http://localhost:3000/api/v1/health/cache

# ─── Logs ──────────────────────────────────────────────────────────────────
docker compose logs --tail=100 backend
docker compose logs --tail=50 postgres
docker compose logs --tail=30 redis
docker compose logs -f backend                    # follow live

# ─── Errors only ───────────────────────────────────────────────────────────
docker compose logs backend 2>&1 | grep '"level":"error"'
docker compose logs backend 2>&1 | grep '"statusCode":5'

# ─── Database ──────────────────────────────────────────────────────────────
docker compose exec postgres psql -U youtube_os -d youtube_os
# Inside psql:
# SELECT count(*), state FROM pg_stat_activity GROUP BY state;
# SELECT query, total_exec_time/calls AS avg_ms FROM pg_stat_statements ORDER BY avg_ms DESC LIMIT 5;

# ─── Redis ─────────────────────────────────────────────────────────────────
docker compose exec redis redis-cli -a youtube_os
# Inside redis-cli:
# INFO stats
# INFO memory
# SLOWLOG GET 10

# ─── Smoke tests ───────────────────────────────────────────────────────────
BASE_URL=https://api.youtube-os.aiarbitech.com \
SMOKE_USER=smoke@youtube-os.test \
SMOKE_PASS=$SMOKE_PASS \
./smoke-tests/test.sh

# ─── Rollback ──────────────────────────────────────────────────────────────
docker compose stop backend
docker compose up -d backend     # after updating image tag
```

---

## Status Page Updates

**Update the status page** whenever there is user-visible impact. Silence creates more panic than a transparent message.

Access the status page admin at: [URL to be configured]

| Situation | Status | Message |
|---|---|---|
| Alert fired, investigating | Investigating | "We are investigating an issue affecting [feature]. Updates to follow." |
| Root cause found, fixing | Identified | "We have identified the cause and are applying a fix now." |
| Fix deployed, monitoring | Monitoring | "A fix has been applied. We are monitoring for full recovery." |
| Fully restored | Resolved | "The issue has been resolved. Full service restored as of [HH:MM UTC]." |

---

## Status Update Cadence

| Severity | Update interval |
|---|---|
| P0 | Every 15 minutes |
| P1 | Every 30 minutes |
| P2 | Every 2 hours |

Even if there's nothing new to report, post: "Still investigating. No change in status. Next update at [HH:MM UTC]."

---

## After the Incident

### Before closing the incident

- [ ] Smoke tests passing: `./smoke-tests/test.sh`
- [ ] Error rate back to baseline on Grafana (< 0.1%)
- [ ] Latency normal (p95 < 500ms)
- [ ] Status page updated to "Resolved"
- [ ] PagerDuty alert closed
- [ ] Resolution posted in incident channel

### Schedule a post-mortem

- **P0:** Post-mortem within 48 hours
- **P1:** Post-mortem within 1 week
- Use the template: [incident/post-mortem-template.md](../incident/post-mortem-template.md)

### Post-mortem is blameless

The post-mortem goal is to improve systems, not assign blame. Focus on:
- What failed and why
- What slowed down detection or resolution
- What concrete actions will prevent recurrence

---

## At the End of Your Shift

- [ ] Write handover notes: open incidents, known issues, recent deployments
- [ ] Brief the incoming primary (15-minute call or written notes in `#on-call`)
- [ ] Confirm PagerDuty schedule switched to new primary
- [ ] Log any alerts that were noisy (candidates for rule tuning)

---

## Quick Reference Card

| Action | Where | Link |
|---|---|---|
| Grafana dashboards | http://localhost:3001 | [operations.md](operations.md) |
| Prometheus | http://localhost:9090 | [operations.md](operations.md) |
| Alertmanager | http://localhost:9093 | [operations.md](operations.md) |
| Severity levels | incident/severity-levels.md | [→](../incident/severity-levels.md) |
| Response procedure | incident/response-procedure.md | [→](../incident/response-procedure.md) |
| Post-mortem template | incident/post-mortem-template.md | [→](../incident/post-mortem-template.md) |
| Troubleshooting | training/troubleshooting.md | [→](troubleshooting.md) |
| On-call schedule | incident/on-call-schedule.md | [→](../incident/on-call-schedule.md) |
| Smoke tests | ./smoke-tests/test.sh | [→](../smoke-tests/README.md) |
