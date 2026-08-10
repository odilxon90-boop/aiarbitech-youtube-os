import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { PromptController } from './prompt-controller.js';
import type { PromptInput } from './prompt-service.js';
import { PromptService } from './prompt-service.js';
export function registerPromptRoutes(app: FastifyInstance, controller = new PromptController(new PromptService())): void {
  app.get('/api/v1/prompts', async (request) => successResponse(controller.list(request), request.correlationId));
  app.get<{ Params: { id: string } }>('/api/v1/prompts/:id', async (request) => successResponse(controller.get(request), request.correlationId));
  app.post<{ Body: PromptInput }>('/api/v1/prompts', async (request) => successResponse(controller.create(request), request.correlationId));
  app.put<{ Params: { id: string }; Body: PromptInput }>('/api/v1/prompts/:id', async (request) => successResponse(controller.update(request), request.correlationId));
  app.delete<{ Params: { id: string } }>('/api/v1/prompts/:id', async (request) => successResponse(controller.delete(request), request.correlationId));
  app.get('/api/v1/prompts/performance', async (request) => successResponse(controller.performance(request), request.correlationId));
}
