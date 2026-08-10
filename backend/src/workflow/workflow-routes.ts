import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { WorkflowController } from './workflow-controller.js';
import { WorkflowService } from './workflow-service.js';
export function registerWorkflowRoutes(app: FastifyInstance, controller = new WorkflowController(new WorkflowService())): void {
  app.post<{ Body: { userId: string; title: string } }>('/api/v1/workflow/start', async (request) => successResponse(controller.start(request), request.correlationId));
  app.get<{ Params: { workflowId: string } }>('/api/v1/workflow/status/:workflowId', async (request) => successResponse(controller.status(request), request.correlationId));
  app.get<{ Querystring: { userId?: string } }>('/api/v1/workflow/history', async (request) => successResponse(controller.history(request), request.correlationId));
  app.post<{ Params: { workflowId: string } }>('/api/v1/workflow/pause/:workflowId', async (request) => successResponse(controller.pause(request), request.correlationId));
  app.post<{ Params: { workflowId: string } }>('/api/v1/workflow/resume/:workflowId', async (request) => successResponse(controller.resume(request), request.correlationId));
  app.post<{ Params: { workflowId: string } }>('/api/v1/workflow/cancel/:workflowId', async (request) => successResponse(controller.cancel(request), request.correlationId));
}
