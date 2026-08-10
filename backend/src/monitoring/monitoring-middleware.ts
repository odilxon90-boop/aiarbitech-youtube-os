import type { FastifyInstance } from 'fastify';
import { requestLogContext, type PlatformLogger } from '../shared/logger.js';
import { MonitoringLogger } from './logger.js';
import type { MetricsCollector } from './metrics.js';

export function registerMonitoringMiddleware(app: FastifyInstance, logger: PlatformLogger, metrics: MetricsCollector): void {
  const monitoringLogger = new MonitoringLogger(logger);
  app.addHook('onResponse', async (request, reply) => {
    const context = { ...requestLogContext(request), statusCode: reply.statusCode, latencyMs: reply.elapsedTime };
    metrics.record(request.routeOptions.url ?? request.url.split('?')[0]!, reply.statusCode, reply.elapsedTime);
    monitoringLogger.request(context);
    if (reply.elapsedTime > 500) monitoringLogger.slowRequest(context);
  });
}
