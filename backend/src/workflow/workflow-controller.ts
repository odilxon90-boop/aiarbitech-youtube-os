import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { WorkflowService } from './workflow-service.js';

function authorizeWorkflow(request: FastifyRequest): void {
  requirePermission(request, 'workflow:access');
}
export class WorkflowController {
  constructor(private readonly service: WorkflowService) {}
  start(request: FastifyRequest<{ Body: { userId: string; title: string } }>) {
    authorizeWorkflow(request);
    const { userId, title } = request.body;
    if (typeof userId !== 'string' || userId.trim() === '' || typeof title !== 'string' || title.trim() === '') {
      throw new PlatformError(400, 'INVALID_WORKFLOW_INPUT', 'userId and title are required non-empty strings.');
    }
    return this.service.start(userId.trim(), title.trim());
  }
  status(request: FastifyRequest<{ Params: { workflowId: string } }>) { authorizeWorkflow(request); return this.service.status(request.params.workflowId); }
  history(request: FastifyRequest<{ Querystring: { userId?: string } }>) { authorizeWorkflow(request); return this.service.historyForUser(request.query.userId); }
  pause(request: FastifyRequest<{ Params: { workflowId: string } }>) { authorizeWorkflow(request); return this.service.pause(request.params.workflowId); }
  resume(request: FastifyRequest<{ Params: { workflowId: string } }>) { authorizeWorkflow(request); return this.service.resume(request.params.workflowId); }
  cancel(request: FastifyRequest<{ Params: { workflowId: string } }>) { authorizeWorkflow(request); return this.service.cancel(request.params.workflowId); }
}
