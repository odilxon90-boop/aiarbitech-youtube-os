import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import type { AdminService, AIConfiguration, ModerationStatus, UserStatus } from './admin-service.js';

function authorizeAdmin(request: FastifyRequest): void {
  requirePermission(request, 'admin:access');
}

export class AdminController {
  constructor(private readonly service: AdminService) {}

  users(request: FastifyRequest) { authorizeAdmin(request); return this.service.listUsers(); }
  updateUserStatus(request: FastifyRequest<{ Params: { id: string }; Body: { status: UserStatus } }>) {
    authorizeAdmin(request);
    return this.service.updateUserStatus(request.params.id, request.body.status);
  }
  channels(request: FastifyRequest) { authorizeAdmin(request); return this.service.listChannels(); }
  moderateChannel(request: FastifyRequest<{ Params: { id: string }; Body: { status: ModerationStatus } }>) {
    authorizeAdmin(request);
    return this.service.moderateChannel(request.params.id, request.body.status);
  }
  aiConfig(request: FastifyRequest) { authorizeAdmin(request); return this.service.getAIConfiguration(); }
  updateAIConfig(request: FastifyRequest<{ Body: AIConfiguration }>) {
    authorizeAdmin(request);
    return this.service.updateAIConfiguration(request.body);
  }
  auditLogs(request: FastifyRequest) { authorizeAdmin(request); return this.service.listAuditLogs(); }
  health(request: FastifyRequest) { authorizeAdmin(request); return this.service.getHealth(); }
}
