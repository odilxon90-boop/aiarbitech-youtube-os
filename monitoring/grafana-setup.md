# Grafana Dashboard Setup

## Prerequisites

1. Run Prometheus with exporters for the backend, host/node metrics, PostgreSQL, and Redis.
2. Ensure scraped metrics use `service="youtube-os"` for application metrics.
3. Expose application metrics including `http_requests_total`, `http_request_duration_seconds_bucket`, `youtube_os_active_users`, `youtube_os_signups_total`, and `youtube_os_cache_hit_rate_percent`.

## Import dashboards

1. In Grafana, add a Prometheus data source and name it `Prometheus`, or select it from each dashboard's `datasource` variable.
2. Go to **Dashboards → New → Import**.
3. Upload each file:
   - `grafana/dashboards/production.json`
   - `grafana/dashboards/overview.json`
   - `grafana/dashboards/api.json`
4. Select the Prometheus data source when Grafana prompts for it.
5. Save dashboards in a `YouTube OS` folder with production-only access controls.

## Recommended alerts

| Alert | PromQL condition | Severity |
| --- | --- | --- |
| Service unavailable | `up{job="youtube-os"} == 0` for 2 minutes | Critical |
| High API error rate | 5xx rate exceeds 1% for 5 minutes | Critical |
| Slow API | P95 latency exceeds 0.5 seconds for 10 minutes | Warning |
| Redis unavailable | `redis_up == 0` for 2 minutes | Critical |
| High Redis memory | Redis memory exceeds 80% of limit for 10 minutes | Warning |
| Database connection pressure | Active connections exceed approved pool threshold | Warning |

## Validation

1. Generate a controlled request to the backend and confirm request rate and latency panels update.
2. Confirm node, PostgreSQL, and Redis exporters populate their respective panels.
3. Trigger a test alert through Alertmanager and confirm it reaches the on-call channel.
4. Restrict dashboard edit permissions and document the dashboard URLs in the launch runbook.
