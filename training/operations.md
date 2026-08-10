# Daily Operations — YouTube OS

This guide covers the day-to-day operational tasks for running YouTube OS in production: monitoring, logging, alerting, deployments, backups, and maintenance.

---

## Daily Health Checks

Perform these checks at the start of each business day:

### 1. Verify All Services Are Running

```bash
docker compose ps
```

All services should show `healthy`:
- `aiarbitech-youtube-os-postgres` — healthy
- `aiarbitech-youtube-os-redis` — healthy
- `aiarbitech-youtube-os-backend` — healthy
- `aiarbitech-youtube-os-frontend` — healthy

### 2. Check API Health Endpoints

```bash
curl -s https://api.youtube-os.aiarbitech.com/api/v1/health | jq .
curl -s https://api.youtube-os.aiarbitech.com/api/v1/health/db | jq .
curl -s https://api.youtube-os.aiarbitech.com/api/v1/health/cache | jq .
```

All should return `{"status":"ok"}` or `{"status":"healthy"}`.

### 3. Review Grafana Dashboards

Open Grafana: http://grafana.youtube-os.aiarbitech.com (or `http://localhost:3001`)

Check:
- **Backend Dashboard:** Error rate < 0.1%, p95 latency < 500ms
- **Infrastructure Dashboard:** All service status indicators green
- No active alerts in the Alerting panel

### 4. Check Alertmanager

Open: http://alertmanager.youtube-os.aiarbitech.com (or `http://localhost:9093`)

- Confirm no active firing alerts
- If alerts are firing, check `incident/response-procedure.md`

---

## Monitoring Stack

### Accessing Dashboards

| Tool | URL | Credentials |
|---|---|---|
| Grafana | http://localhost:3001 | `admin` / `GRAFANA_ADMIN_PASSWORD` |
| Prometheus | http://localhost:9090 | None (internal) |
| Alertmanager | http://localhost:9093 | None (internal) |

Start the monitoring stack if not running:

```bash
docker compose -f docker-compose.monitoring.yml up -d
```

### Key Grafana Panels to Watch

**Backend Dashboard (`youtube-os-backend`):**
- Request Rate — should track traffic patterns (higher during business hours)
- API Latency p95 — target < 500ms; investigate if > 1s
- API Error Rate — target < 0.1%; alert fires at > 5%
- Cache Hit Rate — target > 70%; low hit rate means cache is undersized or TTLs too short
- PostgreSQL Connections — target < 80% of pool (200 max)

**Infrastructure Dashboard (`youtube-os-infra`):**
- Redis/PostgreSQL/Backend status — all green
- Memory usage — alert fires at > 90%
- CPU usage — alert fires at > 85%

### Prometheus Direct Queries

Use the Prometheus UI (http://localhost:9090) for ad-hoc queries:

```promql
# Current error rate
(sum(rate(http_request_total{status=~"5.."}[5m])) / sum(rate(http_request_total[5m]))) * 100

# Slowest endpoints (p95 latency)
histogram_quantile(0.95, sum by (path, le) (rate(http_request_duration_seconds_bucket[5m])))

# Active database connections
pg_stat_activity_count

# Redis cache hit ratio
(redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)) * 100

# Disk usage
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100
```

---

## Log Management

### Viewing Logs

```bash
# All services (follow)
docker compose logs -f

# Backend only (last 100 lines)
docker compose logs --tail=100 backend

# Backend errors only
docker compose logs backend 2>&1 | grep -i '"level":"error"'

# Follow backend logs live
docker compose logs -f backend

# PostgreSQL
docker compose logs --tail=50 postgres

# Redis
docker compose logs --tail=50 redis
```

### Log Format

Backend logs are structured JSON:

```json
{
  "timestamp": "2026-08-09T14:32:01.234Z",
  "level": "info",
  "message": "Request completed",
  "method": "GET",
  "path": "/api/v1/dashboard/summary",
  "statusCode": 200,
  "duration": 42,
  "correlationId": "abc-123-def"
}
```

Use `jq` to parse:

```bash
# Pretty-print JSON logs
docker compose logs backend 2>&1 | grep "^{" | jq .

# Filter by level
docker compose logs backend 2>&1 | grep "^{" | jq 'select(.level == "error")'

# Filter by path
docker compose logs backend 2>&1 | grep "^{" | jq 'select(.path == "/api/v1/dashboard/summary")'

# Show slow requests (> 500ms)
docker compose logs backend 2>&1 | grep "^{" | jq 'select(.duration > 500)'
```

### Correlation IDs

Every request carries an `X-Correlation-Id` header. Use it to trace a specific request across all log entries:

```bash
# Find all log lines for a specific request
docker compose logs backend 2>&1 | grep "abc-123-def"
```

---

## Alerting

### Alert Channels

| Severity | Channel | Tool |
|---|---|---|
| P0 Critical | PagerDuty + Email | Immediate page |
| P1 High | Slack `#youtube-os-warnings` | 30s grouping |
| P2 Info | Telegram | 5m grouping |
| All | HTTP Webhook `backend:3000/webhooks/alerts` | Custom handling |

### Acknowledging Alerts

1. Go to Alertmanager UI: http://localhost:9093
2. Click the alert → "Silence" to suppress during investigation
3. Set silence duration equal to expected fix time
4. Post update in `#incidents` Slack channel

### Alert Rules Reference

Alert rules are in `prometheus/alert-rules.yml`. Key thresholds:

| Alert | Threshold | Severity |
|---|---|---|
| `HighAPIErrorRate` | > 5% errors over 5 min | Critical |
| `HighAPILatency` | p95 > 1s | Warning |
| `BackendDown` | Unreachable for 1 min | Critical |
| `RedisDown` | Unreachable for 1 min | Critical |
| `PostgresDown` | Unreachable for 1 min | Critical |
| `HighMemoryUsage` | > 90% | Warning |
| `LowDiskSpace` | < 15% free | Critical |

---

## Deployment

### Standard Deployment (CI/CD)

All production deployments go through the CI/CD pipeline (GitHub Actions):

1. Push to `main` branch or create a pull request
2. Pipeline runs: typecheck → tests → build
3. On `main`: build Docker images → push to registry → deploy to staging
4. After smoke tests pass: promote to production

Monitor the deployment:

```bash
# Watch pipeline in GitHub Actions UI
# Or tail backend logs during deployment:
docker compose logs -f backend
```

### Manual Deployment (emergency only)

Requires escalation manager approval for production:

```bash
# Pull latest images
docker compose pull

# Recreate backend container
docker compose up -d --force-recreate backend

# Verify health
curl http://localhost:3000/api/v1/health

# Run smoke tests
BASE_URL=https://api.youtube-os.aiarbitech.com \
SMOKE_USER=smoke@youtube-os.test \
SMOKE_PASS=$SMOKE_PASS \
./smoke-tests/test.sh
```

### Rollback

```bash
# Roll back to the previous image tag
docker compose stop backend
docker tag registry.example.com/youtube-os-backend:previous \
  registry.example.com/youtube-os-backend:latest
docker compose up -d backend

# Verify
curl http://localhost:3000/api/v1/health
./smoke-tests/test.sh
```

---

## Database Operations

### Connecting to PostgreSQL

```bash
# Via Docker
docker compose exec postgres psql -U youtube_os -d youtube_os

# Direct connection
psql postgresql://youtube_os:youtube_os@localhost:5432/youtube_os
```

### Running Migrations

```bash
cd backend

# Apply pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

> Never run `migrate reset` on production — it drops all data.

### Database Backup

```bash
# Manual backup
docker compose exec postgres pg_dump -U youtube_os youtube_os \
  > backup/postgres-$(date +%Y%m%d-%H%M%S).sql

# Restore from backup
docker compose exec -T postgres psql -U youtube_os youtube_os \
  < backup/postgres-YYYYMMDD-HHMMSS.sql
```

### Useful PostgreSQL Queries

```sql
-- Table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::regclass))
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- Active connections by state
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;

-- Slowest queries (requires pg_stat_statements extension)
SELECT query, calls, total_exec_time / calls AS avg_ms, rows
FROM pg_stat_statements
ORDER BY avg_ms DESC LIMIT 10;

-- Table row counts
SELECT tablename, n_live_tup AS row_count
FROM pg_stat_user_tables ORDER BY row_count DESC;
```

---

## Redis Operations

### Connecting to Redis

```bash
docker compose exec redis redis-cli -a youtube_os
```

### Common Redis Commands

```bash
# Check memory and hit rate
INFO memory
INFO stats

# See all keys matching a pattern (use carefully in production)
SCAN 0 MATCH "cache:dashboard:*" COUNT 100

# Check TTL on a key
TTL "cache:dashboard:user123"

# Delete a specific cache key
DEL "cache:dashboard:user123"

# Clear all keys (DANGER — never on production without incident approval)
FLUSHALL

# Slow log (commands that took > 10ms)
SLOWLOG GET 25

# Memory fragmentation ratio (> 1.5 = high)
INFO memory | grep mem_fragmentation_ratio
```

### Cache TTL Reference

| Cache Domain | Key Pattern | TTL |
|---|---|---|
| Dashboard | `cache:dashboard:[userId]` | 60 seconds |
| Genre | `cache:genre:*` | 5 minutes |
| Intelligence | `cache:intelligence:*` | 2 minutes |
| Analytics | `cache:analytics:[userId]` | 3 minutes |
| Admin | `cache:admin:*` | 5 minutes |
| Gateway | `cache:gateway:*` | 30–60 seconds |

---

## Maintenance Windows

### Scheduled Maintenance

Announce maintenance at least **24 hours in advance** via:
1. Status page: "Scheduled maintenance on [date] [time] UTC for [duration]"
2. Slack `#status`

During maintenance:
1. Put up a maintenance page if needed
2. Perform the maintenance
3. Run smoke tests: `./smoke-tests/test.sh`
4. Update status page: "Maintenance complete"

### Dependencies to Keep Updated

| Dependency | Check | Update Frequency |
|---|---|---|
| Node.js | `node --version` | LTS releases (every 6 months) |
| PostgreSQL | `docker inspect postgres` | Minor versions monthly |
| Redis | `docker inspect redis` | Minor versions monthly |
| npm packages | `npm outdated` | Monthly security review |
| Docker images | `docker compose pull` | Monthly |

---

## Capacity Planning

Review these metrics monthly to plan infrastructure scaling:

| Metric | Current | Alert Threshold | Scale When |
|---|---|---|---|
| Concurrent users (p95) | — | > 200 (warning) | Sustained > 150 |
| DB connection pool | — | > 80% | Sustained > 60% |
| Redis memory | — | > 80% | Sustained > 70% |
| Disk usage | — | < 15% free | < 30% free |
| CPU usage (sustained) | — | > 85% | Sustained > 70% |

---

## Next Steps

- [Troubleshooting Guide →](troubleshooting.md)
- [On-Call Guide →](on-call.md)
- [Incident Response Procedure →](../incident/response-procedure.md)
