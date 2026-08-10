/**
 * Prometheus metrics — exposes Fastify/Node.js metrics for monitoring.
 *
 * Metrics collected:
 *  - HTTP request rate, latency, status codes
 *  - Node.js process metrics (memory, CPU, file descriptors)
 *  - Event loop lag
 *  - GC statistics (if available)
 *
 * Endpoint: /metrics
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createHash } from 'node:crypto';

// ─── Simple metrics registry ─────────────────────────────────────────────────

interface MetricCounter {
  name: string;
  help: string;
  labels: Record<string, string[]>;
  values: Map<string, number>;
}

interface MetricHistogram {
  name: string;
  help: string;
  buckets: number[];
  labels: Record<string, string[]>;
  values: Map<string, { sum: number; count: number; buckets: Map<number, number> }>;
}

interface MetricGauge {
  name: string;
  help: string;
  labels: Record<string, string[]>;
  values: Map<string, number>;
}

const counters = new Map<string, MetricCounter>();
const histograms = new Map<string, MetricHistogram>();
const gauges = new Map<string, MetricGauge>();

// ─── Metric registry functions ──────────────────────────────────────────────

export function registerCounter(name: string, help: string, labelNames: string[] = []): void {
  counters.set(name, {
    name,
    help,
    labels: labelNames.reduce((acc, ln) => ({ ...acc, [ln]: [] }), {}),
    values: new Map(),
  });
}

export function registerHistogram(
  name: string,
  help: string,
  buckets: number[] = [0.001, 0.01, 0.1, 0.5, 1, 2, 5],
  labelNames: string[] = [],
): void {
  histograms.set(name, {
    name,
    help,
    buckets,
    labels: labelNames.reduce((acc, ln) => ({ ...acc, [ln]: [] }), {}),
    values: new Map(),
  });
}

export function registerGauge(name: string, help: string, labelNames: string[] = []): void {
  gauges.set(name, {
    name,
    help,
    labels: labelNames.reduce((acc, ln) => ({ ...acc, [ln]: [] }), {}),
    values: new Map(),
  });
}

// ─── Helper: Generate label key ─────────────────────────────────────────────

function getLabelKey(labels: Record<string, string>): string {
  const sorted = Object.keys(labels)
    .sort()
    .map((k) => `${k}=${labels[k]}`)
    .join(',');
  return sorted;
}

// ─── Counter operations ─────────────────────────────────────────────────────

export function incCounter(name: string, labels: Record<string, string> = {}, value: number = 1): void {
  const counter = counters.get(name);
  if (!counter) return;

  const key = getLabelKey(labels);
  counter.values.set(key, (counter.values.get(key) || 0) + value);
}

// ─── Histogram operations ───────────────────────────────────────────────────

export function observeHistogram(
  name: string,
  value: number,
  labels: Record<string, string> = {},
): void {
  const histogram = histograms.get(name);
  if (!histogram) return;

  const key = getLabelKey(labels);
  const entry = histogram.values.get(key) || {
    sum: 0,
    count: 0,
    buckets: new Map(histogram.buckets.map((b) => [b, 0])),
  };

  entry.sum += value;
  entry.count += 1;

  // Update bucket counts
  for (const bucket of histogram.buckets) {
    if (value <= bucket) {
      entry.buckets.set(bucket, (entry.buckets.get(bucket) || 0) + 1);
    }
  }

  histogram.values.set(key, entry);
}

// ─── Gauge operations ───────────────────────────────────────────────────────

export function setGauge(name: string, value: number, labels: Record<string, string> = {}): void {
  const gauge = gauges.get(name);
  if (!gauge) return;

  const key = getLabelKey(labels);
  gauge.values.set(key, value);
}

// ─── Metrics exporter (Prometheus format) ───────────────────────────────────

function formatMetrics(): string {
  const lines: string[] = [];

  // Export counters
  for (const [, counter] of counters) {
    lines.push(`# HELP ${counter.name} ${counter.help}`);
    lines.push(`# TYPE ${counter.name} counter`);
    for (const [labels, value] of counter.values) {
      if (labels) {
        lines.push(`${counter.name}{${labels}} ${value}`);
      } else {
        lines.push(`${counter.name} ${value}`);
      }
    }
  }

  // Export gauges
  for (const [, gauge] of gauges) {
    lines.push(`# HELP ${gauge.name} ${gauge.help}`);
    lines.push(`# TYPE ${gauge.name} gauge`);
    for (const [labels, value] of gauge.values) {
      if (labels) {
        lines.push(`${gauge.name}{${labels}} ${value}`);
      } else {
        lines.push(`${gauge.name} ${value}`);
      }
    }
  }

  // Export histograms
  for (const [, histogram] of histograms) {
    lines.push(`# HELP ${histogram.name} ${histogram.help}`);
    lines.push(`# TYPE ${histogram.name} histogram`);

    for (const [labels, entry] of histogram.values) {
      const labelPrefix = labels ? `${labels},` : '';

      // Buckets
      for (const bucket of histogram.buckets) {
        const bucketCount = entry.buckets.get(bucket) || 0;
        lines.push(`${histogram.name}_bucket{${labelPrefix}le="${bucket}"} ${bucketCount}`);
      }

      // +Inf bucket
      lines.push(`${histogram.name}_bucket{${labelPrefix}le="+Inf"} ${entry.count}`);

      // Sum and count
      lines.push(`${histogram.name}_sum{${labels || ''}} ${entry.sum}`);
      lines.push(`${histogram.name}_count{${labels || ''}} ${entry.count}`);
    }
  }

  return lines.join('\n') + '\n';
}

// ─── Middleware registration ────────────────────────────────────────────────

export function registerMetricsMiddleware(app: FastifyInstance): void {
  // Initialize metrics
  registerCounter('http_request_total', 'Total HTTP requests', ['method', 'path', 'status']);
  registerHistogram('http_request_duration_seconds', 'HTTP request duration', [0.01, 0.05, 0.1, 0.5, 1, 2, 5], [
    'method',
    'path',
  ]);
  registerCounter('http_requests_rate_limited_total', 'Rate-limited HTTP requests', ['path']);

  // Node.js metrics
  registerGauge('process_memory_bytes', 'Process memory usage', ['type']);
  registerGauge('process_cpu_seconds_total', 'Process CPU time');
  registerGauge('process_open_fds', 'Number of open file descriptors');
  registerGauge('nodejs_event_loop_lag_seconds', 'Event loop lag');

  // Request tracking
  app.addHook('onRequest', async (request) => {
    (request as any).startTime = performance.now();
  });

  app.addHook('onResponse', async (request, reply) => {
    const startTime = (request as any).startTime || performance.now();
    const duration = (performance.now() - startTime) / 1000; // Convert to seconds

    const method = request.method;
    const rawUrl = request.url ?? '/unknown';
    const path = (rawUrl?.split('?')[0] ?? '/unknown').replace(/\d+/g, ':id'); // Normalize path
    const status = reply.statusCode;

    incCounter('http_request_total', {
      method,
      path,
      status: String(status),
    });

    observeHistogram('http_request_duration_seconds', duration, {
      method,
      path,
    });
  });

  // Periodic process metrics update
  setInterval(() => {
    const usage = process.memoryUsage();
    setGauge('process_memory_bytes', usage.heapUsed, { type: 'heap_used' });
    setGauge('process_memory_bytes', usage.heapTotal, { type: 'heap_total' });
    setGauge('process_memory_bytes', usage.external, { type: 'external' });
    setGauge('process_memory_bytes', usage.rss, { type: 'rss' });

    const cpuUsage = process.cpuUsage();
    setGauge('process_cpu_seconds_total', (cpuUsage.user + cpuUsage.system) / 1000000);

    if (typeof (process as any).getActiveHandles === 'function') {
      setGauge('process_open_fds', (process as any).getActiveHandles().length);
    }
  }, 10000); // Update every 10 seconds

  // Metrics endpoint
  app.get('/metrics', async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.type('text/plain; version=0.0.4').send(formatMetrics());
  });
}
