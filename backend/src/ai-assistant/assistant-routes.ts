import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { successResponse } from '../contracts/api.js';
import { PlatformError } from '../shared/errors.js';
import { requirePermission } from '../shared/auth.js';
import { createAssistantController } from './assistant-controller.js';
import type { AssistantService } from './assistant-service.js';

const AI_CHAT_PERMISSION = 'ai:chat';

const chatSendSchema = z.object({
  prompt: z.string().min(1).max(4000),
  sessionId: z.string().max(128).optional(),
});

/**
 * AI Assistant chat routes. Authenticated and permission-checked. Returns
 * structured JSON via the shared API envelope.
 */
export function registerAssistantRoutes(app: FastifyInstance, service: AssistantService): void {
  const controller = createAssistantController(service);

  app.post('/api/v1/ai/chat/send', async (request) => {
    const principal = requirePermission(request, AI_CHAT_PERMISSION);
    const parsed = chatSendSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new PlatformError(400, 'VALIDATION_ERROR', 'Invalid chat payload.');
    }
    const { prompt, sessionId } = parsed.data;
    const result = await controller.send(principal.subject, prompt, sessionId);
    return successResponse(result, request.correlationId);
  });

  app.get('/api/v1/ai/chat/history', async (request) => {
    const principal = requirePermission(request, AI_CHAT_PERMISSION);
    return successResponse(
      { sessions: controller.history(principal.subject) },
      request.correlationId,
    );
  });

  app.get<{ Params: { sessionId: string } }>('/api/v1/ai/chat/:sessionId', async (request) => {
    const principal = requirePermission(request, AI_CHAT_PERMISSION);
    const session = controller.session(principal.subject, request.params.sessionId);
    return successResponse({ session }, request.correlationId);
  });
}