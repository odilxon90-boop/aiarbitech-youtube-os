import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { pathToFileURL } from 'node:url';
import { loadEnvironment, isGlobalEcosystemConfigured, type EnvironmentConfig } from '../config/environment.js';
import { registerHealthRoutes } from '../health/routes.js';
import { MockGlobalEcosystemApiClient } from '../integrations/global-ecosystem/mock-adapter.js';
import { registerPlatformRoutes } from '../platform/routes.js';
import { registerCorrelationIds } from '../shared/correlation-id.js';
import { registerErrorHandler } from '../shared/errors.js';
import { NoopLogger, StructuredConsoleLogger, type PlatformLogger } from '../shared/logger.js';
import { registerRequestLogging } from '../shared/request-logging.js';

export interface BuildAppOptions {
  config?: EnvironmentConfig;
  logger?: PlatformLogger;
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

  registerCorrelationIds(app);
  registerRequestLogging(app, logger);
  registerErrorHandler(app, logger);

  const globalEcosystemClient = new MockGlobalEcosystemApiClient(
    isGlobalEcosystemConfigured(config),
  );

  registerHealthRoutes(app, config);
  registerPlatformRoutes(app, config, globalEcosystemClient);

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
