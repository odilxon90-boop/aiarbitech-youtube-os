# Performance Tuning Notes — YouTube OS

## Environment Assumptions

All settings are calibrated for a **4GB RAM** production server. Adjust values proportionally based on actual server specifications using the formulas noted below.

---

## PostgreSQL

### Key Settings

| Parameter | Value | Formula |
|---|---|---|
| `shared_buffers` | 1GB | `RAM × 0.25` |
| `work_mem` | 16MB | Fixed (max_connections × work_mem ≤ RAM) |
| `maintenance_work_mem` | 256MB | Fixed |
| `max_connections` | 200 | Fixed |
| `effective_cache_size` | 3GB | `RAM × 0.75` |
| `wal_buffers` | 16MB | Fixed (PostgreSQL auto-tunes from shared_buffers) |

### Rationale

**`shared_buffers = 1GB` (25% of RAM)**  
PostgreSQL's primary in-memory cache for data pages. Setting below 25% wastes memory; above 40% can cause OS page cache contention. The OS uses remaining RAM as a file system cache which PostgreSQL also benefits from via `effective_cache_size`.

**`work_mem = 16MB`**  
Per-sort and per-hash memory. With `max_connections = 200` and multiple sorts per query, worst-case usage is `200 × n_sorts × 16MB`. Keep conservative for high-concurrency workloads. Increase to 32–64MB for reporting/analytics queries by setting it in the session: `SET work_mem = '64MB'`.

**`maintenance_work_mem = 256MB`**  
Used by `VACUUM`, `CREATE INDEX`, `ALTER TABLE ADD FOREIGN KEY`. Higher values speed up index builds and vacuum passes. Safe to increase further if index operations are slow.

**`effective_cache_size = 3GB` (75% of RAM)**  
A planner estimate of total available cache (shared_buffers + OS page cache). Does not allocate memory — only influences the query planner's cost estimates. Underestimating causes the planner to prefer sequential scans over index scans.

**`wal_buffers = 16MB`**  
WAL write buffer in shared memory. PostgreSQL 12+ auto-tunes this to 1/32 of shared_buffers (min 64KB, max 16MB). Explicit 16MB is appropriate for write-heavy workloads.

### Adjusting for Different RAM Sizes

| Server RAM | shared_buffers | effective_cache_size | work_mem |
|---|---|---|---|
| 2GB | 512MB | 1.5GB | 8MB |
| 4GB | 1GB | 3GB | 16MB |
| 8GB | 2GB | 6GB | 32MB |
| 16GB | 4GB | 12GB | 64MB |
| 32GB | 8GB | 24GB | 128MB |

### Additional Recommendations

**Connection Pooling (Critical for production)**  
With `max_connections = 200`, each idle connection uses ~5–10MB RAM. Use [PgBouncer](https://www.pgbouncer.org/) in transaction mode to multiplex application connections:

```ini
# pgbouncer.ini
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

**Index Maintenance**  
Run `ANALYZE` after bulk inserts and `REINDEX` when index bloat exceeds 20%:
```sql
-- Check for bloat
SELECT schemaname, tablename, n_dead_tup, n_live_tup,
       round(n_dead_tup::numeric/n_live_tup * 100, 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_live_tup > 0
ORDER BY dead_pct DESC;
```

**Slow Query Monitoring**  
`log_min_duration_statement = 1000` logs queries over 1 second. Enable `pg_stat_statements` for aggregate query profiling:
```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT query, calls, total_exec_time / calls AS avg_ms
FROM pg_stat_statements
ORDER BY avg_ms DESC
LIMIT 20;
```

---

## Redis

### Key Settings

| Parameter | Value | Notes |
|---|---|---|
| `maxmemory` | 3GB | `RAM × 0.75` |
| `maxmemory-policy` | `allkeys-lru` | Evict least-recently used when full |
| `save` | 60 1000 | RDB snapshot at 60s/1000 changes |
| `appendonly` | yes | AOF enabled for durability |
| `appendfsync` | everysec | 1-second fsync interval |
| `hz` | 15 | Background task frequency |

### Rationale

**`maxmemory = 3GB` (75% of RAM)**  
Leaves 25% for OS, Redis process overhead, AOF rewrite buffer, and active defrag. Setting maxmemory to 100% causes OOM killer risk during replication or AOF rewrites.

**`maxmemory-policy = allkeys-lru`**  
For a pure cache workload (as in YouTube OS), `allkeys-lru` is preferred over `volatile-lru` because it doesn't require setting explicit TTLs for eviction. All keys are eligible for eviction based on recency of access. The LRU approximation uses `maxmemory-samples = 10` (higher values improve accuracy at CPU cost).

**`save 60 1000` (RDB Snapshots)**  
Triggers an RDB snapshot every 60 seconds when at least 1000 keys have changed. Multiple save rules provide a safety net:
- `60 1000` — High activity
- `300 100` — Medium activity
- `3600 1` — Low activity

**`appendonly yes` (AOF Persistence)**  
Provides better durability than RDB alone. Combined with `aof-use-rdb-preamble yes`, Redis writes an RDB snapshot as AOF header for fast restarts while maintaining AOF for subsequent writes.

**`appendfsync everysec`**  
Balances durability vs. performance. Options:
- `always` — Maximum durability, slowest (fsync on every write)
- `everysec` — Up to 1 second of data loss on crash (**recommended**)
- `no` — Fastest, OS controls fsync timing

### Adjusting for Different RAM Sizes

| Server RAM | maxmemory | Notes |
|---|---|---|
| 1GB | 768MB | Reduce AOF rewrite min-size to 64MB |
| 2GB | 1.5GB | |
| 4GB | 3GB | Default config |
| 8GB | 6GB | Increase maxmemory-samples to 15 |
| 16GB+ | 12GB | Consider Redis Cluster |

### Cache TTL Strategy

YouTube OS cache TTLs (defined in `cache-service.ts`):

| Cache Domain | TTL | Rationale |
|---|---|---|
| Dashboard | 60s | High-access, moderate freshness |
| Genre | 5m | Low-change, high-cache-benefit |
| Intelligence | 2m | Moderate staleness tolerance |
| Analytics | 3m | Moderate freshness requirement |
| Admin | 5m | Low-change configuration data |
| Gateway | 30–60s | External integration, short freshness |

### Monitoring Key Metrics

```bash
# Real-time metrics
redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses|evicted_keys"

# Memory fragmentation ratio (> 1.5 = high fragmentation)
redis-cli INFO memory | grep mem_fragmentation_ratio

# Command latency statistics
redis-cli LATENCY HISTORY command

# Slow log (commands > 10ms)
redis-cli SLOWLOG GET 25
```

**Target ratios:**
- **Hit rate** > 80% (`keyspace_hits / (keyspace_hits + keyspace_misses)`)
- **Memory fragmentation ratio** < 1.5
- **Evictions** → 0 (size cache appropriately; evictions indicate under-provisioning)

---

## Applying Configuration

### PostgreSQL

Mount the config file into the PostgreSQL container or place it in the PostgreSQL data directory. In Docker Compose, add a volume mount and a `command` override:

```yaml
postgres:
  image: postgres:16-alpine
  volumes:
    - ./backend/config/postgresql.conf:/etc/postgresql/postgresql.conf:ro
  command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

Or copy to the PostgreSQL data directory and reload:
```bash
cp backend/config/postgresql.conf /var/lib/postgresql/data/
psql -c "SELECT pg_reload_conf();"
```

### Redis

Mount the config file when starting the Redis container:

```yaml
redis:
  image: redis:7-alpine
  volumes:
    - ./backend/config/redis.conf:/etc/redis/redis.conf:ro
  command: redis-server /etc/redis/redis.conf --requirepass "${REDIS_PASSWORD}"
```

Or apply settings at runtime (non-persistent):
```bash
redis-cli CONFIG SET maxmemory 3gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG REWRITE   # Save to running config file
```

---

## Verification

### PostgreSQL — Confirm Settings Applied

```sql
SHOW shared_buffers;
SHOW work_mem;
SHOW max_connections;
SHOW effective_cache_size;
SHOW wal_buffers;
```

### Redis — Confirm Settings Applied

```bash
redis-cli CONFIG GET maxmemory
redis-cli CONFIG GET maxmemory-policy
redis-cli CONFIG GET appendonly
redis-cli CONFIG GET save
redis-cli INFO memory | grep maxmemory
```
