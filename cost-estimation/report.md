# Production Cost Estimation

> Estimates are USD per month and are planning figures, not provider quotes. Confirm current regional pricing, included usage, egress, and taxes before purchase.

## Base production scenario

Assumptions: one backend VM, static frontend hosting, managed PostgreSQL, managed Redis, 50 GB backup storage, and hosted monitoring.

| Component | Provider options | Assumption | Estimated monthly cost |
| --- | --- | --- | ---: |
| Backend | Fly.io / Railway | 1 VM, 2 CPU, 1 GB RAM | $20 |
| Frontend | Vercel / Fly.io | Static hosting and normal traffic | $5 |
| PostgreSQL | Neon / Supabase | Managed production database | $20 |
| Redis | Upstash / Redis Cloud | Managed cache | $15 |
| Backups | Amazon S3-compatible storage | 50 GB retained backup data | $5 |
| Monitoring | Grafana Cloud | Metrics, dashboards, and alerts | $10 |
| Domain | Registrar | $15/year, amortized monthly | $1.25 |
| SSL/TLS | Let's Encrypt | Certificate issuance and renewal | $0 |
| **Estimated total** | | | **$76.25/month** |

The expected base operating range is **$70–$80/month** before tax, overages, and unusual outbound traffic.

## Scaled scenario

Assumptions: two to three backend VMs, increased database/cache capacity, more monitoring retention, and higher backup/egress usage.

| Component | Estimated monthly range |
| --- | ---: |
| Backend: 2–3 Fly.io VMs | $40–$60 |
| Frontend and CDN | $5–$15 |
| PostgreSQL | $30–$50 |
| Redis | $20–$35 |
| Backups and egress | $10–$20 |
| Monitoring | $15–$25 |
| Domain and SSL | $1.25 |
| **Estimated total** | **$121–$206/month** |

Plan for **$150–$200/month** once sustained traffic requires two to three backend instances.

## Cost drivers and controls

| Cost driver | What increases it | Control |
| --- | --- | --- |
| Compute | Concurrent requests, background jobs, high CPU workloads | Autoscale with minimum/maximum instance counts and measure P95 latency. |
| PostgreSQL | Storage, compute hours, connection count, reads | Use connection pooling, indexes, cache warming, and retention policies. |
| Redis | Memory use, commands, data transfer | Apply TTLs, eviction policy, and cache key limits. |
| Egress | Video assets, API responses, backups | Serve static content through Cloudflare CDN and monitor egress. |
| Monitoring | Metric cardinality and log retention | Cap URL cardinality, sample noisy logs, and set retention periods. |
| Backups | Retention duration and restore copies | Use lifecycle policies and test restores without retaining unnecessary copies. |

## Budget checkpoints

- Review actual spend weekly for the first month.
- Alert at 50%, 80%, and 100% of the approved monthly budget.
- Review provider invoices, egress, backup retention, and idle instances monthly.
- Reforecast before adding regions, always-on workers, or additional production environments.
