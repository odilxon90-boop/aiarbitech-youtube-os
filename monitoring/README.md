# Production Observability Dashboard

This directory contains the production observability stack for AIArbiTech YouTube OS, including Prometheus for metrics collection and Grafana for visualization.

## Architecture

```
┌─────────────────┐
│   YouTube OS    │
│  Backend/Front  │
└────────┬────────┘
         │ /metrics
         ▼
┌─────────────────┐      ┌─────────────────┐
│   Prometheus    │◄────►│    Grafana      │
│   (Port 9090)   │      │   (Port 3001)   │
└────────┬────────┘      └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Node Exporter   │
│   (Port 9100)   │
└─────────────────┘
```

## Components

### Prometheus (Port 9090)
- Metrics collection and storage
- Scrapes metrics every 10-15 seconds
- Stores time-series data
- Access: http://localhost:9090

### Grafana (Port 3001)
- Dashboard visualization
- Pre-configured dashboards
- Default credentials: `admin` / `admin`
- Access: http://localhost:3001

### Node Exporter (Port 9100)
- System metrics (CPU, memory, disk, network)
- Host machine monitoring

## Quick Start

### Start the Observability Stack

```bash
docker-compose -f docker-compose.observability.yml up -d
```

### Stop the Stack

```bash
docker-compose -f docker-compose.observability.yml down
```

### View Logs

```bash
docker-compose -f docker-compose.observability.yml logs -f
```


## Adding Metrics to Your Application

To expose metrics from your Node.js application, add the following:

```typescript
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

## Troubleshooting

### Prometheus Not Scraping Targets
1. Check target status: http://localhost:9090/targets
2. Verify the target is accessible from the Prometheus container
3. Check network connectivity: `docker exec prometheus ping host.docker.internal`

### Grafana Not Showing Data
1. Verify Prometheus datasource is configured: http://localhost:3001/datasources
2. Check Prometheus is running: `docker ps | grep prometheus`
3. Verify metrics are being scraped: http://localhost:9090/targets

### Dashboard Not Loading
1. Check dashboard provisioning: `docker exec grafana ls /var/lib/grafana/dashboards`
2. Verify dashboard JSON is valid
3. Check Grafana logs: `docker logs grafana`

### Port Conflicts
If ports 9090, 3001, or 9100 are already in use, modify the port mappings in `docker-compose.observability.yml`.

## Production Considerations

### Security
- Change default Grafana credentials
- Enable HTTPS for Grafana
- Use authentication for Prometheus
- Restrict network access

### Performance
- Adjust `scrape_interval` based on needs
- Configure retention period in Prometheus
- Use remote storage for long-term retention

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboard Examples](https://grafana.com/grafana/dashboards/)
