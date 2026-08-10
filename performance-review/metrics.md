<<<<<<< HEAD
# Key Metrics to Monitor

This document defines the key metrics that should be monitored for AIArbiTech YouTube OS platform performance and health.

---

## 1. Performance Metrics

### 1.1 Request Metrics

#### Requests Per Second (RPS)
- **Description:** Number of requests processed per second
- **Target:** Monitor trends, no specific target
- **Alert Threshold:** Sudden drop >50% or spike >200%
- **Measurement:** Prometheus `rate(http_requests_total[1m])`
- **Visualization:** Time series graph with peak/average markers
- **Why Important:** Indicates platform load and capacity utilization

#### Response Time (Latency)
- **Description:** Time taken to process and respond to requests
- **Targets:**
  - p50 (median): <100ms
  - p95: <500ms
  - p99: <1000ms
- **Alert Threshold:** p95 >1s or p99 >2s
- **Measurement:** Prometheus histogram `http_request_duration_seconds`
- **Visualization:** Percentile distribution graph
- **Why Important:** Directly impacts user experience

#### Per-Endpoint Response Time
- **Description:** Response time broken down by API endpoint
- **Target:** Each endpoint <500ms p95
- **Alert Threshold:** Any endpoint p95 >1s
- **Measurement:** Prometheus histogram with `endpoint` label
- **Visualization:** Table or heatmap by endpoint
- **Why Important:** Identifies specific slow endpoints for optimization

### 1.2 Error Metrics

#### Error Rate (Overall)
- **Description:** Percentage of requests resulting in errors (4xx, 5xx)
- **Target:** <1% overall error rate
- **Alert Threshold:** >2% for 5 minutes
- **Measurement:** `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100`
- **Visualization:** Time series graph with threshold line
- **Why Important:** Indicates platform stability and reliability

#### Error Rate by Type
- **Description:** Breakdown of errors by HTTP status code
- **Targets:**
  - 4xx (client errors): <5%
  - 5xx (server errors): <0.5%
- **Alert Threshold:** 5xx >1% for 2 minutes
- **Measurement:** Prometheus with `status` label grouping
- **Visualization:** Stacked area chart by status code
- **Why Important:** Helps identify type of issues (client vs server)

#### Error Rate by Endpoint
- **Description:** Error rate broken down by API endpoint
- **Target:** Each endpoint <2% error rate
- **Alert Threshold:** Any endpoint >5% error rate
- **Measurement:** Prometheus with `endpoint` and `status` labels
- **Visualization:** Table or heatmap
- **Why Important:** Pinpoints problematic endpoints
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
