import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { AdminController } from './admin-controller.js';
import type { AIConfiguration, ModerationStatus, UserStatus } from './admin-service.js';
import { AdminService } from './admin-service.js';

export function registerAdminRoutes(app: FastifyInstance, controller = new AdminController(new AdminService())): void {
  app.get('/api/v1/admin/users', async (request) => successResponse(controller.users(request), request.correlationId));
  app.put<{ Params: { id: string }; Body: { status: UserStatus } }>('/api/v1/admin/users/:id/status', async (request) =>
    successResponse(controller.updateUserStatus(request), request.correlationId),
  );
  app.get('/api/v1/admin/channels', async (request) => successResponse(controller.channels(request), request.correlationId));
  app.put<{ Params: { id: string }; Body: { status: ModerationStatus } }>('/api/v1/admin/channels/:id/moderate', async (request) =>
    successResponse(controller.moderateChannel(request), request.correlationId),
  );
  app.get('/api/v1/admin/ai-config', async (request) => successResponse(controller.aiConfig(request), request.correlationId));
  app.put<{ Body: AIConfiguration }>('/api/v1/admin/ai-config', async (request) =>
    successResponse(controller.updateAIConfig(request), request.correlationId),
  );
  app.get('/api/v1/admin/audit-logs', async (request) => successResponse(controller.auditLogs(request), request.correlationId));
  app.get('/api/v1/admin/health', async (request) => successResponse(controller.health(request), request.correlationId));
}
