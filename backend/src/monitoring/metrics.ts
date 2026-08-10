export interface RequestMetric {
  endpoint: string;
  count: number;
  averageLatencyMs: number;
  errorRatePercent: number;
}

interface MutableRequestMetric {
  count: number;
  totalLatencyMs: number;
  errorCount: number;
}

export class MetricsCollector {
  private static readonly maxTrackedEndpoints = 100;
  private totalRequests = 0;
  private totalLatencyMs = 0;
  private errors = 0;
  private readonly endpoints = new Map<string, MutableRequestMetric>();

  record(path: string, statusCode: number, latencyMs: number): void {
    this.totalRequests += 1;
    this.totalLatencyMs += latencyMs;
    if (statusCode >= 500) this.errors += 1;
    const endpoint = this.endpoints.get(path);
    if (!endpoint && this.endpoints.size >= MetricsCollector.maxTrackedEndpoints) return;
    const trackedEndpoint = endpoint ?? { count: 0, totalLatencyMs: 0, errorCount: 0 };
    trackedEndpoint.count += 1;
    trackedEndpoint.totalLatencyMs += latencyMs;
    if (statusCode >= 500) trackedEndpoint.errorCount += 1;
    this.endpoints.set(path, trackedEndpoint);
  }

  snapshot() {
    return {
      totalRequests: this.totalRequests,
      averageLatencyMs: this.totalRequests === 0 ? 0 : this.totalLatencyMs / this.totalRequests,
      errorRatePercent: this.totalRequests === 0 ? 0 : (this.errors / this.totalRequests) * 100,
      endpoints: [...this.endpoints.entries()].map(([endpoint, metric]): RequestMetric => ({
        endpoint,
        count: metric.count,
        averageLatencyMs: metric.totalLatencyMs / metric.count,
        errorRatePercent: (metric.errorCount / metric.count) * 100,
      })),
      alerts: [
        ...(this.totalRequests > 0 && this.errors / this.totalRequests > 0.05 ? ['HIGH_ERROR_RATE'] : []),
        ...(this.totalRequests > 0 && this.totalLatencyMs / this.totalRequests > 500 ? ['SLOW_RESPONSES'] : []),
      ],
    };
  }
}
