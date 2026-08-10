# Post-Launch Metrics Catalog

## API performance

| Metric | Definition | Target | Source |
| --- | --- | --- | --- |
| RPS | Average and peak requests per second | Capacity-dependent baseline | Grafana API dashboard |
| P50 latency | Median API response time | Track baseline | `http_request_duration_seconds_bucket` |
| P95 latency | 95th percentile API response time | < 500 ms | Grafana API dashboard |
| P99 latency | 99th percentile API response time | Approved SLO | Grafana API dashboard |
| Error rate | 4xx and 5xx requests / total requests | 5xx < 1% | `http_requests_total` |
| Endpoint error rate | Errors grouped by route | Investigate deviations | Prometheus route labels |

## Cache and database

| Metric | Definition | Target | Source |
| --- | --- | --- | --- |
| Redis cache hit rate | Cache hits / (hits + misses) | Improve against baseline | `redis_keyspace_hits_total`, `redis_keyspace_misses_total` |
| Redis evictions | Evicted keys per second | 0 sustained evictions | `redis_evicted_keys_total` |
| Redis memory | Used memory and percentage of limit | < 80% | `redis_memory_used_bytes` |
| Warming health | Startup and scheduled warming result | `HEALTHY` | `/health/cache` |
| PostgreSQL connections | Active connections by state | Below pool threshold | `pg_stat_activity_count` |
| PostgreSQL cache hit rate | Shared-buffer hits / total reads | > 99% where feasible | `pg_stat_database_blks_hit`, `pg_stat_database_blks_read` |
| Query time | Read/write I/O and slow query duration | Compare to baseline | PostgreSQL exporter and slow-query logs |

## Infrastructure

| Metric | Definition | Target | Source |
| --- | --- | --- | --- |
| Backend CPU | Process or VM CPU utilization | < 75% sustained | Node exporter / hosting metrics |
| Backend memory | Process or VM memory utilization | < 75% sustained | Node exporter / hosting metrics |
| Disk usage | Persistent volume utilization | < 80% | Node exporter |
| Availability | Healthy service instances / expected instances | 100% | `up{job="youtube-os"}` |
| Network egress | Outbound bytes and provider cost | Budget-dependent | Hosting provider metrics |

## User adoption

| Metric | Definition | Cadence |
| --- | --- | --- |
| DAU / WAU / MAU | Unique active users daily, weekly, monthly | Daily |
| New sign-ups | New accounts in period | Daily and weekly |
| Activation rate | New users completing the primary onboarding flow | Weekly |
| Churn rate | Active users who become inactive in the defined period | Monthly |
| Feature usage | Unique users and actions per feature | Weekly |
| Retention | Cohort users returning after 1, 7, and 30 days | Weekly |

## Error and operational signals

| Metric | Definition | Source |
| --- | --- | --- |
| Authentication failures | Failed JWT login, verification, and refresh events | Backend structured logs |
| Unhandled exceptions | Errors tagged as internal failures | Loki backend logs |
| Nginx 5xx rate | Proxy/server error responses | Nginx logs / exporter |
| Database failures | Connection, timeout, and recovery errors | PostgreSQL logs |
| Incident count and MTTR | Incidents and time to restore service | Incident system |

## Review guidance

1. Compare every metric to its pre-launch baseline and stated SLO.
2. Use the same time range across Grafana dashboards and Loki queries.
3. Segment by release version, endpoint, region, and user cohort where available.
4. Link supporting graphs and log queries in `template.md`.
5. Turn material deviations into owned action items with measurable outcomes.
