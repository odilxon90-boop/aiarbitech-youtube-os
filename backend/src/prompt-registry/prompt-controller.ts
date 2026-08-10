import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import type { PromptInput, PromptService } from './prompt-service.js';
function authorizePrompts(request: FastifyRequest): void {
  requirePermission(request, 'prompts:access');
}
export class PromptController {
  constructor(private readonly service: PromptService) {}
  list(request: FastifyRequest) { authorizePrompts(request); return this.service.list(); }
  get(request: FastifyRequest<{ Params: { id: string } }>) { authorizePrompts(request); return this.service.get(request.params.id); }
  create(request: FastifyRequest<{ Body: PromptInput }>) { authorizePrompts(request); return this.service.create(request.body); }
  update(request: FastifyRequest<{ Params: { id: string }; Body: PromptInput }>) { authorizePrompts(request); return this.service.update(request.params.id, request.body); }
  delete(request: FastifyRequest<{ Params: { id: string } }>) { authorizePrompts(request); return this.service.delete(request.params.id); }
  performance(request: FastifyRequest) { authorizePrompts(request); return this.service.performance(); }
}
