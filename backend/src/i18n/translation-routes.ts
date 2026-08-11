import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { EnvironmentConfig } from '../config/environment.js';
import { successResponse } from '../contracts/api.js';
import { TranslationService } from './translation-service.js';

const autoTranslateSchema = z.object({
  text: z.string().min(1),
  targetLanguages: z.array(z.string().min(2)).min(1),
  sourceLanguage: z.string().min(2).optional(),
});

const translateBatchSchema = z.object({
  texts: z.array(z.string().min(1)).min(1),
  targetLanguage: z.string().min(2),
  sourceLanguage: z.string().min(2).optional(),
});

export function registerTranslationRoutes(app: FastifyInstance, config: EnvironmentConfig): void {
  const service = new TranslationService(config);

  app.post('/api/v1/i18n/auto-translate', async (request) => {
    const body = autoTranslateSchema.parse(request.body ?? {});
    const result = await service.autoTranslateNewText(
      body.text,
      body.targetLanguages,
      body.sourceLanguage ?? 'auto',
    );
    return successResponse(result, request.correlationId);
  });

  app.post('/api/v1/i18n/translate', async (request) => {
    const body = translateBatchSchema.parse(request.body ?? {});
    const result = await service.translateBatch(
      body.texts,
      body.targetLanguage,
      body.sourceLanguage ?? 'auto',
    );
    return successResponse(result, request.correlationId);
  });

  app.get('/api/v1/i18n/health', async (request) =>
    successResponse(
      {
        status: 'READY',
        provider: config.TRANSLATION_PROVIDER,
        cacheEntries: service.cacheSize(),
        cacheTtlSeconds: config.TRANSLATION_CACHE_TTL_SECONDS,
      },
      request.correlationId,
    ),
  );
}
