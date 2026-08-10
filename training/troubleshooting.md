# Troubleshooting Guide — YouTube OS

A reference for diagnosing and resolving common issues. Each section describes the symptom, likely causes, diagnostic steps, and fixes.

---

## Quick Diagnostic Checklist

Run these first for any reported issue:

```bash
# 1. Are all containers running?
docker compose ps

# 2. Is the API healthy?
curl -s http://localhost:3000/api/v1/health | jq .
curl -s http://localhost:3000/api/v1/health/db | jq .
curl -s http://localhost:3000/api/v1/health/cache | jq .

# 3. Any recent errors in logs?
docker compose logs --tail=50 backend 2>&1 | grep -i "error\|fatal"

# 4. Was there a recent deployment?
git log --oneline -5

# 5. Check Grafana error rate
# → http://localhost:3001
```

---

## Backend Issues

---

### Backend container exits immediately on start

**Symptom:** `docker compose ps` shows backend as `Exited` shortly after start.

**Likely causes:**
- Missing required environment variable
- Database not ready when backend starts
- TypeScript compilation error in build

**Diagnose:**
```bash
docker compose logs backend
```

**Common errors and fixes:**

| Error message | Fix |
|---|---|
| `EnvironmentValidationError: DATABASE_URL: Required` | Set `DATABASE_URL` in `.env` |
| `ECONNREFUSED 5432` | Start PostgreSQL first: `docker compose up -d postgres` |
| `Cannot find module` | Run `npm install` in `backend/` |
| `SyntaxError: Cannot use import` | Run `npm run build` before `npm start` |

---

### API returns 500 on all requests

**Symptom:** Every API call returns HTTP 500; Grafana error rate spikes to 100%.

**Diagnose:**
```bash
# Check backend logs
docker compose logs --tail=100 backend 2>&1 | grep '"level":"error"'

# Check if database is connected
curl http://localhost:3000/api/v1/health/db
```

**Likely causes and fixes:**

1. **Database connection lost**
   ```bash
   docker compose restart postgres
   docker compose restart backend
   ```

2. **Unhandled exception crashing the request handler**
   - Check logs for stack trace
   - Identify the route from the error
   - Fix the code or redeploy previous version

3. **Out of memory**
   ```bash
   docker stats aiarbitech-youtube-os-backend
   # If memory near limit:
   docker compose restart backend
   ```

---

### API returns 503 Service Unavailable

**Symptom:** HTTP 503 from all or some endpoints.

**Likely causes:**
- Backend container is unhealthy (health check failing)
- Nginx/reverse proxy can't reach backend
- Backend started but crashed after initial health check

**Diagnose:**
```bash
docker compose ps  # check backend health status
docker compose logs backend --tail=50
```

**Fix:** Restart backend; check if the issue recurs within minutes (indicates crashing loop).

---

### API returns 401 Unauthorized unexpectedly

**Symptom:** Authenticated requests returning 401 for a logged-in user.

**Likely causes:**
- JWT token expired (normal — client should refresh)
- Token signing secret changed (all sessions invalidated)
- Clock skew between server and client

**Diagnose:**
```bash
# Check if token is being sent
# In browser: Network tab → check Authorization header on requests

# Check logs for auth errors
docker compose logs backend 2>&1 | grep "401\|unauthorized\|jwt"
```

**Fix:** If the secret changed, users must re-login. Document the change in the incident log.

---

### API returns 429 Too Many Requests

**Symptom:** Some users receiving 429 errors.

**Expected behavior:** Rate limiting is working correctly. 429 should be returned (not 500) when a client exceeds the rate limit.

**If false positives** (legitimate users rate limited):

```bash
# Check rate limit configuration
grep -r "rateLimit\|rateLimitMiddleware" backend/src/middleware/
```

Review thresholds in `backend/src/middleware/rate-limit.middleware.ts` and adjust if too aggressive.

---

### Response times suddenly high (p95 > 1s)

**Symptom:** Grafana latency panel shows p95 climbing; users report slow pages.

**Diagnose:**
```bash
# Which endpoints are slowest?
# In Prometheus:
# histogram_quantile(0.95, sum by (path, le) (rate(http_request_duration_seconds_bucket[5m])))

# Check PostgreSQL for slow queries
docker compose exec postgres psql -U youtube_os -d youtube_os -c "
SELECT query, calls, total_exec_time / calls AS avg_ms
FROM pg_stat_statements ORDER BY avg_ms DESC LIMIT 10;"

# Check Redis response time
docker compose exec redis redis-cli -a youtube_os LATENCY HISTORY command
```

**Common fixes:**

| Cause | Fix |
|---|---|
| Missing database index | Add index via Prisma migration |
| Cache miss (cold start) | Wait for cache to warm up; check TTLs |
| N+1 query | Refactor to use `include` in Prisma query |
| Large payload | Add pagination; reduce response size |
| Memory pressure | Restart backend; check for memory leak |

---

## Database Issues

---

### `FATAL: remaining connection slots are reserved`

**Symptom:** New database connections fail with this message.

**Cause:** PostgreSQL `max_connections = 200` reached. All connection slots taken.

**Diagnose:**
```sql
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
SELECT usename, count(*) FROM pg_stat_activity GROUP BY usename;
```

**Fix:**
1. Identify connections being held open (state: `idle`)
2. Restart backend to release connections: `docker compose restart backend`
3. Long-term: configure PgBouncer connection pooler

---

### `ERROR: deadlock detected`

**Symptom:** Errors in logs: `deadlock detected` with table/row information.

**Diagnose:**
```bash
docker compose logs backend 2>&1 | grep -A5 "deadlock"
```

**Fix:**
- Identify the conflicting queries from the error message
- Ensure consistent lock acquisition order in the application code
- Add `lock_timeout = 30s` in `backend/config/postgresql.conf` to prevent indefinite waits

---

### Database disk full

**Symptom:** `ERROR: could not extend file ... No space left on device`

**Immediate action:**
```bash
# Check disk usage
df -h

# Find large PostgreSQL files
docker compose exec postgres bash -c "du -sh /var/lib/postgresql/data/*"

# Check WAL accumulation
docker compose exec postgres psql -U youtube_os -c "SELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0'));"
```

**Fix:**
1. Free disk space (remove old logs, temp files)
2. Run `VACUUM FULL` on large tables
3. Increase disk size on the host
4. Archive and delete old data if appropriate

---

### Migration fails with `column already exists`

**Symptom:** `npx prisma migrate deploy` fails with a column or table already exists error.

**Cause:** Migration was partially applied or database is out of sync.

**Fix:**
```bash
# Check migration status
npx prisma migrate status

# Mark the failed migration as applied (if you're sure the state is correct)
npx prisma migrate resolve --applied "MIGRATION_NAME"

# Then re-run
npx prisma migrate deploy
```

> Never use `--force-reset` on production.

---

## Redis Issues

---

### Redis container unhealthy

**Symptom:** `docker compose ps` shows Redis as `unhealthy`.

**Diagnose:**
```bash
docker compose logs redis --tail=20

# Try connecting
docker compose exec redis redis-cli -a youtube_os ping
# Expected: PONG
```

**Fix:**
```bash
docker compose restart redis
```

If Redis keeps failing, check memory availability on the host (Redis OOM).

---

### High Redis memory — evictions occurring

**Symptom:** Alertmanager fires `HighRedisMemoryUsage` or `RedisEvictions` alert.

**Diagnose:**
```bash
docker compose exec redis redis-cli -a youtube_os INFO memory
# Check: used_memory_human, mem_fragmentation_ratio
# Check: evicted_keys (should be 0 in healthy state)
```

**Fix:**
1. If evictions are acceptable (cache-only use case), no action needed — `allkeys-lru` is working
2. If data loss is a concern, increase `maxmemory` in `backend/config/redis.conf`
3. Reduce cache TTLs for large-value keys

---

### Cache always missing (X-Cache: MISS on every request)

**Symptom:** Grafana cache hit rate near 0%; all requests show `X-Cache: MISS` header.

**Diagnose:**
```bash
# Test a cacheable endpoint twice
curl -v http://localhost:3000/api/v1/dashboard/summary 2>&1 | grep X-Cache
# First: X-Cache: SET
# Second: X-Cache: HIT (if working)

# Check Redis has keys
docker compose exec redis redis-cli -a youtube_os KEYS "cache:*" | head -20
```

**Likely causes:**
- `?no-cache=true` is being appended to requests by the client
- Route not in the cacheable routes list in `cache-middleware.ts`
- Redis is down and in-memory fallback is being used (check logs for `using in-memory cache fallback`)
- User is not authenticated (user-scoped cache keys require `req.auth.subject`)

---

## Frontend Issues

---

### Blank page or white screen on load

**Symptom:** Browser shows blank white page; no visible content.

**Diagnose:**
```bash
# Open browser console (F12) → Console tab
# Look for: JavaScript errors, network request failures
```

**Common causes:**

| Error in console | Fix |
|---|---|
| `Failed to fetch` | Backend is not running or CORS is misconfigured |
| `Uncaught TypeError` | JavaScript bundle error — check frontend build |
| `401 Unauthorized` | Auth token missing — clear localStorage and re-login |
| `Module not found` | Run `npm install` in `frontend/` |

---

### Login redirect loop

**Symptom:** After login, user is immediately redirected back to the login page.

**Cause:** Auth token is not being stored correctly; the app immediately detects no valid session.

**Fix:**
1. Clear browser localStorage: DevTools → Application → Local Storage → Clear
2. Try an incognito window
3. Check backend logs for auth errors at login time

---

### Frontend build fails in CI

**Symptom:** GitHub Actions build step fails with TypeScript or Vite errors.

**Diagnose:**
```bash
cd frontend
npm run typecheck  # Find TypeScript errors
npm run build      # Find build errors
```

Fix the TypeScript errors locally before pushing. Never skip `npm run typecheck`.

---

## Monitoring Issues

---

### Grafana shows "No data" on all panels

**Symptom:** All Grafana dashboard panels show "No data".

**Diagnose:**
```bash
# Is Prometheus running and scraping?
curl http://localhost:9090/api/v1/query?query=up

# Are scrape targets healthy?
# Open: http://localhost:9090/targets
```

**Fix:**
1. If Prometheus targets are down: check if backend/exporters are running
2. If Prometheus is down: `docker compose -f docker-compose.monitoring.yml restart prometheus`
3. If Grafana datasource is broken: check datasource config in Grafana UI → Connections → Data Sources

---

### Alertmanager not sending notifications

**Symptom:** Alerts fire in Prometheus but no Slack/email notifications received.

**Diagnose:**
```bash
# Check Alertmanager logs
docker compose -f docker-compose.monitoring.yml logs alertmanager --tail=50

# Check Alertmanager API for active alerts
curl http://localhost:9093/api/v1/alerts | jq .
```

**Common fixes:**
- Check environment variables: `ALERTMANAGER_SLACK_WEBHOOK_URL`, `ALERTMANAGER_EMAIL_PASSWORD` etc.
- Test Slack webhook manually: `curl -X POST -H 'Content-type: application/json' --data '{"text":"test"}' $ALERTMANAGER_SLACK_WEBHOOK_URL`
- Reload Alertmanager config: `docker compose -f docker-compose.monitoring.yml restart alertmanager`

---

## Escalation Guide

If you cannot resolve an issue within the time limits below, escalate:

| Severity | Time limit before escalation | Escalate to |
|---|---|---|
| P0 | 30 minutes | Escalation Manager |
| P1 | 1 hour | Escalation Manager |
| P2 | 4 hours | Technical Lead |
| P3 | Next business day | Technical Lead (via ticket) |

See [On-Call Guide](on-call.md) and [Incident Response](../incident/response-procedure.md) for full procedures.
