# Centralized Production Logging

Vector ships backend, Nginx, PostgreSQL, Redis, and frontend error logs to Grafana Loki. Grafana provides the search and correlation interface.

## Architecture

```text
Backend JSON logs ─┐
Nginx logs ───────┤
PostgreSQL logs ──┼─> Vector ─> Loki ─> Grafana Explore / alerts
Redis logs ───────┤
Frontend errors ──┘
```

## Setup

1. Deploy Loki using `logging/grafana-loki.yml` with persistent storage mounted at `/var/lib/loki`.
2. Deploy Vector using `logging/vector.toml`.
3. Set `LOKI_URL` to the Loki endpoint and `ENVIRONMENT=production` in Vector.
4. Configure backend structured logs to write JSON lines to `/var/log/youtube-os/backend.json.log`.
5. Configure Nginx, PostgreSQL, and Redis paths to match the Vector source paths, or update the configuration for the hosting platform.
6. Send frontend client errors as JSON to Vector's protected `/` HTTP endpoint on port `8686`, preferably through an authenticated internal proxy.
7. Add Loki as a Grafana data source and restrict read access to authorized operators.

## Required metadata

Vector attaches these labels to every log entry:

- `service`: backend, nginx, postgresql, redis, or frontend
- `environment`: deployment environment
- `severity`: normalized log level

The JSON body preserves structured fields such as `correlationId`/`request_id`, `user_id`, endpoint/path, status, latency, and error details.

## Query examples

```logql
{service="backend", environment="production", severity="error"}
{service="nginx"} |= " 5"
{service="backend"} | json | correlationId="correlation-id-here"
{service="frontend"} |= "Unhandled"
```

Use time-range selection, service and severity labels, endpoint fields, full-text filters, and correlation IDs to trace a request across services.

## Alert patterns

- Backend unhandled errors above the approved threshold.
- Repeated authentication failures from a source.
- Nginx 5xx spikes.
- PostgreSQL connection, recovery, or storage errors.
- Redis availability or eviction warnings.
- Frontend unhandled exception spikes.

Alert rules should link to the relevant Grafana log query and notify the on-call channel.
