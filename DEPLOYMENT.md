# Multi-Environment Deployment Guide

This guide covers deployment strategies for **Development**, **Staging**, and **Production** environments.

## Environment Overview

| Environment | Purpose | Backend | Frontend | Database | Cache |
|-------------|---------|---------|----------|----------|-------|
| **Development** | Local development & testing | Hot-reload, mock auth | Vite dev server | Local PostgreSQL | Redis (optional) |
| **Staging** | Pre-production testing | Production build, JWT | Production build | Cloud PostgreSQL | Redis (required) |
| **Production** | Live deployment | Scaled, rate limiting | CDN, CSP, compression | Cloud PostgreSQL | Redis cluster |

---

## Development Environment

### Quick Start

```bash
# Start all services with hot-reload
docker-compose -f docker-compose.dev.yml up

# Start in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

### Access Points

- **Frontend:** http://localhost:5173 (Vite dev server with HMR)
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5433
- **Redis:** localhost:6379

### Features

- ✅ **Hot-reload:** Backend and frontend automatically restart on code changes
- ✅ **Mock authentication:** No JWT required for local development
- ✅ **Debug logging:** Verbose logs for troubleshooting
- ✅ **Volume mounts:** Code changes reflected immediately
- ✅ **Optional Redis:** Cache layer can be disabled if not needed

### Environment Variables

Development uses default values. Override in `docker-compose.dev.yml` if needed:

```env
NODE_ENV=development
DATABASE_URL=postgresql://dev_user:dev_password@postgres:5432/youtube_os_dev
REDIS_URL=redis://redis:6379
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev-secret-key-change-in-production
LOG_LEVEL=debug
```

---

## Staging Environment

### Prerequisites

1. **Cloud PostgreSQL:** Set up a managed PostgreSQL instance (e.g., Supabase, AWS RDS, Neon)
2. **Redis:** Set up a managed Redis instance (e.g., Upstash, AWS ElastiCache)
3. **Domain:** Configure staging subdomain (e.g., `staging.yourdomain.com`)
4. **SSL Certificate:** Ensure HTTPS is enabled

### Deployment on Fly.io

```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Authenticate
flyctl auth login

# 3. Set secrets (environment variables)
flyctl secrets set DATABASE_URL="postgresql://..."
flyctl secrets set REDIS_URL="redis://..."
flyctl secrets set JWT_SECRET="your-staging-jwt-secret"
flyctl secrets set CORS_ORIGIN="https://staging.yourdomain.com"

# 4. Deploy staging
flyctl deploy --config deploy/staging/fly.toml

# 5. Check deployment status
flyctl status --config deploy/staging/fly.toml

# 6. View logs
flyctl logs --config deploy/staging/fly.toml
```

### Features

- ✅ **Production build:** Optimized, minified code
- ✅ **JWT authentication:** Real authentication tokens
- ✅ **Rate limiting:** Protection against abuse
- ✅ **Security headers:** CSP, HSTS, etc.
- ✅ **Health checks:** Automatic monitoring
- ✅ **Auto-restart:** Services restart on failure

---

## Production Environment

### Prerequisites

1. **Cloud PostgreSQL:** High-availability managed database
2. **Redis Cluster:** Distributed cache for scaling
3. **Domain:** Production domain (e.g., `yourdomain.com`)
4. **SSL Certificate:** HTTPS with valid certificate
5. **CDN:** CloudFlare, AWS CloudFront, or similar
6. **Monitoring:** Prometheus + Grafana or Datadog

### Deployment on Fly.io

```bash
# 1. Set production secrets
flyctl secrets set DATABASE_URL="postgresql://..."
flyctl secrets set REDIS_URL="redis://..."
flyctl secrets set JWT_SECRET="your-production-jwt-secret"
flyctl secrets set CORS_ORIGIN="https://yourdomain.com"

# 2. Deploy production
flyctl deploy --config deploy/production/fly.toml

# 3. Scale machines (if needed)
flyctl scale count 3 --config deploy/production/fly.toml

# 4. Check status
flyctl status --config deploy/production/fly.toml

# 5. Monitor
flyctl logs --config deploy/production/fly.toml
```

### Features

- ✅ **Auto-scaling:** 2-10 machines based on CPU usage
- ✅ **Performance VMs:** 2 CPU, 1GB RAM per machine
- ✅ **High availability:** Multiple regions, rolling deployments
- ✅ **Rate limiting:** Strict limits (100 req/min)
- ✅ **Security hardening:** Full CSP, HSTS, CORS restrictions
- ✅ **Metrics endpoint:** Prometheus-compatible metrics at `/metrics`
- ✅ **Health checks:** Automatic load balancer health monitoring

---

## Environment Comparison

### Security

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| Authentication | Mock | JWT | JWT |
| CORS | localhost only | Staging domain | Production domain |
| Rate Limiting | Disabled | Enabled (100/min) | Enabled (100/min) |
| CSP Headers | Relaxed | Strict | Very strict |
| HSTS | Disabled | Enabled (1 year) | Enabled (1 year + preload) |
| HTTPS | No | Yes | Yes (force) |

### Performance

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| Build Type | Dev (unminified) | Production (minified) | Production (optimized) |
| Caching | Minimal | Standard | Aggressive |
| CDN | No | No | Yes |
| Compression | No | Gzip | Gzip + Brotli |
| Database | Local | Cloud (single) | Cloud (HA cluster) |
| Cache | Redis (optional) | Redis (single) | Redis cluster |

### Monitoring

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| Log Level | Debug | Info | Warn |
| Metrics | No | Basic | Full (Prometheus) |
| Health Checks | Basic | Standard | Comprehensive |
| Alerting | No | Email | Email + Slack + PagerDuty |

---

## Deployment Commands

### Development

```bash
# Start
docker-compose -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build

# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d postgres
```

### Staging

```bash
# Deploy to Fly.io
flyctl deploy --config deploy/staging/fly.toml

# Rollback to previous version
flyctl releases rollback --config deploy/staging/fly.toml

# Update secrets
flyctl secrets set KEY=value --config deploy/staging/fly.toml

# View logs
flyctl logs --config deploy/staging/fly.toml
```

### Production

```bash
# Deploy to Fly.io
flyctl deploy --config deploy/production/fly.toml

# Scale machines
flyctl scale count 5 --config deploy/production/fly.toml

# Monitor CPU/Memory
flyctl ssh console --config deploy/production/fly.toml
flyctl status --config deploy/production/fly.toml

# View metrics
flyctl metrics --config deploy/production/fly.toml
```

---

## Troubleshooting

### Development

**Issue:** Backend not starting
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs backend

# Rebuild
docker-compose -f docker-compose.dev.yml up --build backend
```

**Issue:** Database connection failed
```bash
# Check if PostgreSQL is healthy
docker-compose -f docker-compose.dev.yml ps

# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d postgres
```

### Staging

**Issue:** Deployment failed
```bash
# Check deployment logs
flyctl logs --config deploy/staging/fly.toml

# Check machine status
flyctl status --config deploy/staging/fly.toml

# Rollback
flyctl releases rollback --config deploy/staging/fly.toml
```

### Production

**Issue:** High CPU usage
```bash
# Scale up
flyctl scale count 5 --config deploy/production/fly.toml

# Check metrics
flyctl metrics --config deploy/production/fly.toml
```

**Issue:** Database connection pool exhausted
```bash
# Increase pool size in environment
flyctl secrets set DATABASE_POOL_SIZE=20 --config deploy/production/fly.toml
```

---

## Best Practices

1. **Never commit secrets:** Use environment variables or secret managers
2. **Use different databases:** Never share databases between environments
3. **Test in staging first:** Always deploy to staging before production
4. **Monitor production:** Set up alerts for errors, latency, and resource usage
5. **Backup databases:** Regular backups for staging and production
6. **Use HTTPS everywhere:** Enforce HTTPS in staging and production
7. **Enable rate limiting:** Protect against abuse in staging and production
8. **Keep dependencies updated:** Regular security updates

---

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)

---

## Support

For deployment issues:
1. Check logs: `flyctl logs` or `docker-compose logs`
2. Review environment variables
3. Check database connectivity
4. Verify DNS and SSL configuration
5. Contact support team

- ✅ **Zero-downtime deploys:** Rolling strategy with max_unavailable=1

