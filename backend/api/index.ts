import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildApp } from '../src/app/server.js';
import { loadEnvironment } from '../src/config/environment.js';
import { NoopLogger } from '../src/shared/logger.js';

type VercelRequest = IncomingMessage & { method?: string; url?: string };
type VercelResponse = ServerResponse;

let appPromise: ReturnType<typeof createApp>;

async function createApp() {
  const app = await buildApp({
    config: loadEnvironment(),
    logger: new NoopLogger(),
  });
  await app.ready();
  return app;
}

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  appPromise ??= createApp();
  const app = await appPromise;
  app.server.emit('request', request, response);
}
