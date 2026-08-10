import Fastify, { type FastifyInstance } from 'fastify';
import 'dotenv/config';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { pathToFileURL } from 'node:url';
import { getBootstrapAdminCredentials, getJwtSecret, loadEnvironment, isGlobalEcosystemConfigured, type EnvironmentConfig } from '../config/environment.js';
import { AuthController } from '../auth/auth.controller.js';
import { registerJwtAuthentication } from '../auth/auth.middleware.js';
import { registerAuthRoutes } from '../auth/auth.routes.js';
import { JwtService } from '../auth/jwt.service.js';
import { registerAdminRoutes } from '../admin/admin-routes.js';
import { registerCreatorRoutes } from '../creator/creator-routes.js';
import { registerAISyncRoutes } from '../ai-sync/ai-sync-routes.js';
import { registerWorkflowRoutes } from '../workflow/workflow-routes.js';
import { registerPromptRoutes } from '../prompt-registry/prompt-routes.js';
import { registerOnboardingRoutes } from '../onboarding/onboarding-routes.js';
import { registerSuccessScoreRoutes } from '../success-score/success-routes.js';
import { registerTwinRoutes } from '../creator-twin/twin-routes.js';
import { registerGatewayRoutes } from '../integration-gateway/gateway-routes.js';
import { registerPermissionRoutes } from '../governance/permission-routes.js';
import { registerJourneyRoutes } from '../journey/routes.js';
import { registerYouTubeRoutes } from '../youtube/youtube-routes.js';
import { registerMonitoringHealthRoutes } from '../monitoring/healthcheck.js';
import { registerMonitoringMiddleware } from '../monitoring/monitoring-middleware.js';
import { MetricsCollector } from '../monitoring/metrics.js';
import { registerCacheMiddleware } from '../middleware/cache.middleware.js';
import { registerCompressionMiddleware } from '../middleware/compression.middleware.js';
import { getCacheWarmingConfig } from '../cache/warming.config.js';
import { CacheWarmingScheduler } from '../cache/warming.scheduler.js';
import { CacheWarmingService, RedisCacheStore } from '../cache/warming.service.js';
import { registerHealthRoutes } from '../health/routes.js';
import { MockGlobalEcosystemApiClient } from '../integrations/global-ecosystem/mock-adapter.js';
import { registerPlatformRoutes } from '../platform/routes.js';
import { registerQualityRoutes } from '../quality/quality-routes.js';
import { registerPresidentRoutes } from '../president/president-routes.js';
import { registerGoalsRoutes } from '../goals/goals-routes.js';
import { registerVideoRoutes } from '../video/video-routes.js';
import { registerMusicRoutes } from '../music/music-routes.js';
import { registerGenreRoutes } from '../genre/genre-routes.js';
import { registerCorrelationIds } from '../shared/correlation-id.js';
import { registerErrorHandler } from '../shared/errors.js';
import { NoopLogger, StructuredConsoleLogger, type PlatformLogger } from '../shared/logger.js';

export interface BuildAppOptions {
  config?: EnvironmentConfig;
  logger?: PlatformLogger;
  enableThrottle?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? loadEnvironment();
  const logger = options.logger ?? new StructuredConsoleLogger();
  const app = Fastify({
    logger: false,
    requestTimeout: config.REQUEST_TIMEOUT_MS,
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: false,
  });
  await registerCompressionMiddleware(app);
  registerCacheMiddleware(app);

  registerCorrelationIds(app);
  const jwtService = new JwtService(getJwtSecret(config), config.JWT_EXPIRES_IN, config.JWT_REFRESH_EXPIRES_IN);
  registerJwtAuthentication(app, jwtService, config.NODE_ENV === 'test');
  const metrics = new MetricsCollector();
  registerMonitoringMiddleware(app, logger, metrics);
  registerErrorHandler(app, logger);
  const cacheWarming = new CacheWarmingService(
    getCacheWarmingConfig(config),
    config.REDIS_URL ? new RedisCacheStore(config.REDIS_URL) : undefined,
    logger,
  );
  const cacheWarmingScheduler = new CacheWarmingScheduler(cacheWarming, config.CACHE_WARMING_INTERVAL_SECONDS, logger);
  app.addHook('onReady', async () => {
    await cacheWarming.warmOnStartup();
    cacheWarmingScheduler.start();
  });
  app.addHook('onClose', async () => {
    cacheWarmingScheduler.stop();
    await cacheWarming.close();
  });

  const globalEcosystemClient = new MockGlobalEcosystemApiClient(
    isGlobalEcosystemConfigured(config),
  );

  registerHealthRoutes(app, config);
  registerAuthRoutes(app, new AuthController(jwtService, getBootstrapAdminCredentials(config)));
  registerPlatformRoutes(app, config, globalEcosystemClient);
  registerQualityRoutes(app);
  registerPresidentRoutes(app);
  registerGoalsRoutes(app);
  registerVideoRoutes(app);
  registerMusicRoutes(app);
  registerGenreRoutes(app);
  registerAdminRoutes(app);
  registerCreatorRoutes(app);
  registerAISyncRoutes(app);
  registerWorkflowRoutes(app);
  registerPromptRoutes(app);
  registerOnboardingRoutes(app);
  registerSuccessScoreRoutes(app);
  registerTwinRoutes(app);
  registerGatewayRoutes(app);
  registerPermissionRoutes(app);
  registerJourneyRoutes(app);
  registerYouTubeRoutes(app);
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/api/health', async () => ({ status: 'ok' }));
  registerMonitoringHealthRoutes(app, metrics, cacheWarming);

  return app;
}

export async function startApp(): Promise<void> {
  const config = loadEnvironment();
  const logger = new StructuredConsoleLogger();
  const app = await buildApp({ config, logger });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info('Platform shutdown requested', { signal });
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
