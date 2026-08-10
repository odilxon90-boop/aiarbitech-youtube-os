# Production Cost Optimization

## Development and staging

1. Use Fly.io, Neon, and Upstash free tiers only for development and short-lived preview environments.
2. Automatically suspend preview environments and delete stale branches.
3. Use production-like but reduced dataset sizes for staging.
4. Keep development and production credentials, databases, and Redis instances separate.

## Compute and frontend delivery

1. Host static frontend assets on Vercel, Fly.io static hosting, or Cloudflare Pages.
2. Put Cloudflare CDN in front of static assets and enable cache-control headers.
3. Keep dashboard eager-loaded and continue lazy-loading non-critical frontend pages.
4. Autoscale backend instances from measured CPU, memory, request concurrency, latency, and error-rate thresholds.
5. Set a maximum instance count and budget alert before enabling aggressive autoscaling.

## Database and cache

1. Start with Neon free tier only for development; move production to an appropriately sized paid plan before traffic requires it.
2. Use the PostgreSQL pool rather than creating connections per request.
3. Index query paths, measure slow queries, and keep retention policies for historical metrics.
4. Use Upstash free tier for development and a managed paid Redis tier for production availability requirements.
5. Keep cache warming enabled, use TTLs, and limit cache warming items to the configured maximum.
6. Track cache hit rate and remove low-value keys that consume memory without reducing database reads.

## Monitoring and backups

1. Start with Grafana Cloud’s lowest suitable plan and set explicit log and metric retention.
2. Avoid high-cardinality labels; aggregate metrics by route rather than full query URLs.
3. Store compressed database backups in S3-compatible object storage with lifecycle rules.
4. Transition older backups to lower-cost storage classes while retaining the approved recovery window.
5. Review alert volume monthly and remove noisy alerts that do not result in action.

## Governance

1. Assign an owner for each provider account and enable billing alerts.
2. Tag resources by environment, service, and owner.
3. Review unused IPs, domains, volumes, snapshots, instances, and preview deployments monthly.
4. Record planned scaling thresholds and require approval for spend above the accepted monthly budget.
