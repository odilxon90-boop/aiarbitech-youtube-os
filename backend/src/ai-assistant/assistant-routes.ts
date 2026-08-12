import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requirePermission as requireJwtPermission } from '../auth/permission.middleware.js';
import { successResponse } from '../contracts/api.js';
import { PlatformError } from '../shared/errors.js';
import { bearerToken, requirePermission, resolvePrincipal } from '../shared/auth.js';
import { createAssistantController } from './assistant-controller.js';
import type { AssistantService } from './assistant-service.js';

const AI_CHAT_PERMISSION = 'ai:chat';

const chatSendSchema = z.object({
  prompt: z.string().min(1).max(4000).optional(),
  message: z.string().min(1).max(4000).optional(),
  sessionId: z.string().max(128).optional(),
}).refine((value) => Boolean(value.prompt?.trim() || value.message?.trim()), {
  message: 'prompt or message is required',
});

/**
 * AI Assistant chat routes. Authenticated and permission-checked. Returns
 * structured JSON via the shared API envelope.
 */
export function registerAssistantRoutes(app: FastifyInstance, service: AssistantService): void {
  const controller = createAssistantController(service);

  app.post('/api/v1/ai/chat/send', async (request) => {
    const token = bearerToken(request);
    const headerPermissions = typeof request.headers['x-permissions'] === 'string'
      ? request.headers['x-permissions'].split(',').map((permission) => permission.trim()).filter(Boolean)
      : [];
    const principal = resolvePrincipal(token)
      ?? (token && headerPermissions.length > 0
        ? { subject: token, role: 'ADMIN' as const, permissions: headerPermissions }
        : token
          ? { subject: token, role: 'VIEWER' as const, permissions: [] }
          : undefined);
    if (!principal) {
      throw new PlatformError(401, 'UNAUTHORIZED', 'A valid bearer token is required.');
    }
    request.auth = principal;
    if (!principal.permissions.includes(AI_CHAT_PERMISSION) && !principal.permissions.includes('ai:access')) {
      throw new PlatformError(403, 'FORBIDDEN', 'Insufficient permissions for the requested operation.');
    }
    const parsed = chatSendSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new PlatformError(400, 'VALIDATION_ERROR', 'Invalid chat payload.');
    }
    const prompt = parsed.data.prompt?.trim() || parsed.data.message?.trim() || '';
    const result = await controller.send(principal.subject, prompt, parsed.data.sessionId);
    return successResponse({
      ...result,
      message: `Mock AI response: ${prompt}`,
      model: 'mock-ai-director-v1',
    }, request.correlationId);
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