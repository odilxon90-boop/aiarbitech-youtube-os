# YouTube OS — Monitoring & Observability Guide

## Overview

This guide explains how to set up and use the complete monitoring stack for YouTube OS, which includes:

- **Prometheus** — Metrics collection and alerting engine
- **Grafana** — Metrics visualization and dashboarding
- **Alertmanager** — Alert routing and delivery (email, Slack, PagerDuty, Telegram, webhooks)
- **Exporters** — Prometheus exporters for Redis, PostgreSQL, and system metrics

## Quick Start

### 1. Prerequisites

Ensure you have Docker and Docker Compose installed:

```bash
docker --version
docker-compose --version
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables (optional for basic usage):

```bash
# Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your_secure_password

# Alert Notifications (optional)
ALERTMANAGER_EMAIL_USERNAME=your-email@gmail.com
ALERTMANAGER_EMAIL_PASSWORD=your-app-password
ALERTMANAGER_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
ALERTMANAGER_PAGERDUTY_KEY=your-pagerduty-service-key
ALERTMANAGER_TELEGRAM_TOKEN=your-bot-token
ALERTMANAGER_TELEGRAM_CHAT_ID=your-chat-id

# Redis (must match main docker-compose.yml)
REDIS_PASSWORD=youtube_os
```

### 3. Start the Main Application Stack

First, start the main YouTube OS services:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Backend API (port 3000)
- Frontend (port 5173)
- Redis (port 6379)

### 4. Start the Monitoring Stack

In a separate terminal, start the monitoring services:

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

This starts:
- **Prometheus** (port 9090) — http://localhost:9090
- **Grafana** (port 3001) — http://localhost:3001
- **Alertmanager** (port 9093) — http://localhost:9093
- **Exporters** (ports 9100, 9121, 9187) — Auto-discovered by Prometheus

### 5. Access the Dashboards

#### Prometheus UI
- **URL:** http://localhost:9090
- **Purpose:** Explore metrics, view targets, and test PromQL queries
- **Common Endpoints:**
  - Targets: http://localhost:9090/targets
  - Alerts: http://localhost:9090/alerts
  - Rules: http://localhost:9090/graph?g0.expr=up

#### Grafana Dashboards
- **URL:** http://localhost:3001
- **Default Credentials:** admin / admin (or use `GRAFANA_ADMIN_PASSWORD`)
- **Available Dashboards:**
  1. **YouTube OS Backend Dashboard** — API performance, latency, error rates
  2. **YouTube OS Infrastructure Dashboard** — Redis, PostgreSQL, system resources

#### Alertmanager UI
- **URL:** http://localhost:9093
- **Purpose:** View active alerts and their routing rules

## Metrics & Queries

### Available Metrics

The backend exposes the following Prometheus metrics at `/metrics`:

**HTTP Metrics:**
```promql
# Total HTTP requests by method, path, and status
http_request_total{method="GET", path="/api/health", status="200"}

# HTTP request latency histogram
http_request_duration_seconds_bucket{method="POST", path="/api/dashboard", le="0.5"}
http_request_duration_seconds_sum{method="GET", path="/api/genres"}
http_request_duration_seconds_count{method="GET", path="/api/genres"}

# Rate-limited requests
http_requests_rate_limited_total{path="/api/intelligence"}
```

**Process Metrics:**
```promql
# Memory usage
process_memory_bytes{type="heap_used"}
process_memory_bytes{type="heap_total"}
process_memory_bytes{type="external"}
process_memory_bytes{type="rss"}

# CPU time
process_cpu_seconds_total

# Open file descriptors
process_open_fds

# Event loop lag
nodejs_event_loop_lag_seconds
```

**Redis Metrics (via redis-exporter):**
```promql
redis_memory_used_bytes
redis_memory_max_bytes
redis_keyspace_hits_total
redis_keyspace_misses_total
redis_connected_clients
redis_commands_processed_total
```

**PostgreSQL Metrics (via postgres-exporter):**
```promql
pg_stat_activity_count
pg_stat_database_tup_returned
pg_stat_database_tup_fetched
pg_cache_index_hit_ratio
```

**System Metrics (via node-exporter):**
```promql
node_cpu_seconds_total
node_memory_MemTotal_bytes
node_memory_MemAvailable_bytes
node_filesystem_avail_bytes
node_network_receive_bytes_total
```

### Example PromQL Queries

Use these in Prometheus UI or Grafana:

```promql
# API request rate (requests per second)
sum(rate(http_request_total[5m])) by (method)

# API error rate (percentage)
(sum(rate(http_request_total{status=~"5.."}[5m])) / sum(rate(http_request_total[5m]))) * 100

# API latency p95
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Redis memory usage percentage
(redis_memory_used_bytes / redis_memory_max_bytes) * 100

# Cache hit rate
(redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)) * 100

# PostgreSQL active connections
pg_stat_activity_count

# System CPU usage
(1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))) * 100

# Disk usage percentage
(node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes * 100
```

## Alerts

Prometheus evaluates 20+ alert rules every 15 seconds. Active alerts are:
1. Routed by **Alertmanager** to configured receivers
2. Grouped by alertname, service, and severity
3. Deduplicated and inhibited to prevent alert storms

### Alert Severities

- **CRITICAL** — Immediate action required (0s wait, sent to PagerDuty)
- **WARNING** — Monitor closely (30s wait, sent to Slack)
- **INFO** — Informational only (5m wait, sent to Telegram)

### Alert Examples

**API Health:**
- `HighAPIErrorRate` — Error rate > 5% over 5 minutes
- `HighAPILatency` — p95 latency > 1 second
- `BackendDown` — Service unreachable for 1 minute

**Redis:**
- `RedisDown` — Redis service down
- `HighRedisMemoryUsage` — Memory > 80% of max

**PostgreSQL:**
- `PostgresDown` — Database service down
- `HighDatabaseConnections` — Connections > 80% of pool

**System:**
- `HighCPUUsage` — CPU > 85% over 5 minutes
- `LowDiskSpace` — Free disk < 15%

### Configuring Notifications

Edit `alertmanager/config.yml` to update notification channels:

**Email:**
```yaml
email_configs:
  - to: 'ops@company.com'
    from: 'alerts@company.com'
    smarthost: 'smtp.gmail.com:587'
    auth_username: 'your-email@gmail.com'
    auth_password: 'your-app-password'
```

**Slack:**
```yaml
slack_configs:
  - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
    channel: '#alerts'
```

**PagerDuty:**
```yaml
pagerduty_configs:
  - service_key: 'your-pagerduty-integration-key'
```

After editing, restart Alertmanager:
```bash
docker-compose -f docker-compose.monitoring.yml restart alertmanager
```

## Troubleshooting

### Prometheus can't connect to backend /metrics endpoint

**Check backend is running:**
```bash
curl http://localhost:3000/metrics
```

If it returns data, verify Prometheus scrape config targets the correct hostname. In Docker, use service name `backend:3000` instead of `localhost:3000`.

### Grafana dashboards show "No data"

1. Wait 30 seconds for Prometheus to scrape metrics
2. Check Prometheus targets page (http://localhost:9090/targets)
3. Verify dashboard queries use correct metric names from `/metrics` endpoint

### Redis/PostgreSQL exporters not connecting

Ensure exporters can reach their target services:

```bash
# Check Redis exporter
curl http://localhost:9121/metrics

# Check PostgreSQL exporter
curl http://localhost:9187/metrics
```

If connection fails, verify:
1. Services are running (`docker-compose ps`)
2. Exporter environment variables point to correct host
3. Credentials match (REDIS_PASSWORD, PostgreSQL user/password)

### Alerts not being sent

1. Check Alertmanager is running: `docker-compose -f docker-compose.monitoring.yml ps`
2. View alerts in Alertmanager UI: http://localhost:9093
3. Check notification channel credentials in `.env`
4. Review Alertmanager logs: `docker-compose -f docker-compose.monitoring.yml logs alertmanager`

## Maintenance

### Data Retention

**Prometheus:** Metrics retained for 15 days (configured in `docker-compose.monitoring.yml`)
- To increase: Change `--storage.tsdb.retention.time=30d`
- Storage location: `prometheus_data` Docker volume

**Grafana:** Dashboards stored in `grafana_data` volume

### Backup

Backup monitoring data:

```bash
# Prometheus data
docker run --rm -v prometheus_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/prometheus-backup.tar.gz -C /data .

# Grafana data
docker run --rm -v grafana_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/grafana-backup.tar.gz -C /data .
```

### Scaling

For production:
1. Use persistent volumes outside of Docker (AWS EBS, etc.)
2. Configure Prometheus remote storage for long-term retention
3. Set up Grafana with authentication (LDAP, OAuth)
4. Use reverse proxy (nginx) for HTTPS/auth
5. Monitor the monitoring stack itself (meta-monitoring)

## Integration with Backend Webhooks

Alertmanager can send alerts to the backend at `/webhooks/alerts`:

```bash
curl -X POST http://localhost:3000/webhooks/alerts \
  -H 'Content-Type: application/json' \
  -d '{
    "alerts": [{
      "status": "firing",
      "labels": {
        "alertname": "HighAPIErrorRate",
        "severity": "critical"
      },
      "annotations": {
        "description": "API error rate is 7% over 5 minutes"
      }
    }]
  }'
```

Use this webhook to:
- Send alerts to internal notification systems
- Trigger automated incident response
- Log alerts to application database
- Update status page

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [PromQL Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.monitoring.yml logs [service]`
2. Review configuration files in `prometheus/`, `alertmanager/`, `grafana/`
3. Test metrics: `curl http://localhost:3000/metrics`
4. Access Prometheus web UI for debugging queries
