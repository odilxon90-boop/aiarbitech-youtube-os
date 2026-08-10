import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { pathToFileURL } from 'node:url';
import { loadEnvironment, isGlobalEcosystemConfigured, type EnvironmentConfig } from '../config/environment.js';
import { registerHealthRoutes } from '../health/routes.js';
import { MockGlobalEcosystemApiClient } from '../integrations/global-ecosystem/mock-adapter.js';
import { registerPlatformRoutes } from '../platform/routes.js';
import { registerRegistrationRoutes } from '../registration/routes.js';
import { registerDashboardRoutes } from '../dashboard/dashboard-routes.js';
import { registerAnalyticsRoutes } from '../analytics/analytics-routes.js';
import { registerGoalsRoutes } from '../goals/goals-routes.js';
import { AssistantService } from '../ai-assistant/assistant-service.js';
import { registerAssistantRoutes } from '../ai-assistant/assistant-routes.js';
import { registerMemoryRoutes } from '../memory/memory-routes.js';
import { registerIntelligenceRoutes } from '../intelligence/intelligence-routes.js';
import { registerVideoRoutes } from '../video/video-routes.js';
import { registerGenreRoutes } from '../genre/genre-routes.js';
import { registerPresidentRoutes } from '../president/president-routes.js';
import { registerAdminRoutes } from '../admin/admin-routes.js';
import { registerGatewayRoutes } from '../integration-gateway/gateway-routes.js';
import { registerGatewayMiddleware } from '../integration-gateway/gateway-middleware.js';
import { registerCorrelationIds } from '../shared/correlation-id.js';
import { registerHeirRoutes } from '../heir/heir-routes.js';
import { registerAiSyncRoutes } from '../ai-sync/ai-sync-routes.js';
import { registerAiSyncMiddleware } from '../ai-sync/ai-sync-middleware.js';
import { registerSecurityMiddleware } from '../middleware/security.middleware.js';
import { registerRateLimitMiddleware } from '../middleware/rate-limit.middleware.js';
import { registerThrottleMiddleware } from '../middleware/throttle.middleware.js';
import { registerErrorHandler } from '../shared/errors.js';
import { NoopLogger, StructuredConsoleLogger, type PlatformLogger } from '../shared/logger.js';
import { registerRequestLogging } from '../shared/request-logging.js';
import { initializeRedis, closeRedis, pruneInMemoryCache } from '../cache/redis-client.js';
import { registerCacheMiddleware } from '../cache/cache-middleware.js';
import { registerMetricsMiddleware } from '../middleware/metrics.middleware.js';

export interface BuildAppOptions {
  config?: EnvironmentConfig;
  logger?: PlatformLogger;
  enableThrottle?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? loadEnvironment();
  const logger = options.logger ?? new StructuredConsoleLogger();
  const enableThrottle = options.enableThrottle ?? (process.env.NODE_ENV !== 'test');
  const app = Fastify({
    logger: false,
    requestTimeout: config.REQUEST_TIMEOUT_MS,
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });
  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
  });

  registerCorrelationIds(app);
  registerRequestLogging(app, logger);
  registerErrorHandler(app, logger);
  registerSecurityMiddleware(app);
  registerRateLimitMiddleware(app);
  
  // Initialize Redis cache layer
  await initializeRedis();
  registerCacheMiddleware(app);
  
  // Register metrics middleware for Prometheus
  registerMetricsMiddleware(app);
  
  // Register throttle middleware only if enabled
  if (enableThrottle) {
    registerThrottleMiddleware(app);
  }
  
  registerAiSyncMiddleware(app);
  registerGatewayMiddleware(app);

  const globalEcosystemClient = new MockGlobalEcosystemApiClient(
    isGlobalEcosystemConfigured(config),
  );

  registerHealthRoutes(app, config);
  registerPlatformRoutes(app, config, globalEcosystemClient);
  registerRegistrationRoutes(app);
    registerDashboardRoutes(app);
    registerAnalyticsRoutes(app);
  registerGoalsRoutes(app);
  registerMemoryRoutes(app);
  registerIntelligenceRoutes(app);
  registerVideoRoutes(app);
  registerGenreRoutes(app);
  registerPresidentRoutes(app);
  registerHeirRoutes(app);
  registerAiSyncRoutes(app);
  registerAdminRoutes(app);
  registerGatewayRoutes(app);

  const assistantService = new AssistantService();
  registerAssistantRoutes(app, assistantService);

  return app;
}

export async function startApp(): Promise<void> {
  const config = loadEnvironment();
  const logger = new StructuredConsoleLogger();
  const app = await buildApp({ config, logger });

  // Setup periodic pruning of in-memory cache (every 5 minutes)
  const pruneInterval = setInterval(() => pruneInMemoryCache(), 5 * 60 * 1000);

  const shutdown = async (signal: string): Promise<void> => {
    logger.info('Platform shutdown requested', { signal });
    clearInterval(pruneInterval);
    await closeRedis();
    await app.close();
  };

  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));

  await app.listen({ host: config.HOST, port: config.PORT });
  logger.info('AIArbiTech YouTube OS backend started', {
    platformId: 'PLATFORM_YOUTUBE_OS',
    version: '0.1.0',
    host: config.HOST,
    port: config.PORT,
  });
}

const entrypoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;
if (entrypoint === import.meta.url && process.env.NODE_ENV !== 'test') {
  startApp().catch((error: unknown) => {
    const logger = new StructuredConsoleLogger();
    logger.error('Platform startup failed', {
      error: error instanceof Error ? error.message : 'Unknown startup error',
    });
    process.exitCode = 1;
  });
}

export { NoopLogger };
