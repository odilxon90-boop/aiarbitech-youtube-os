<<<<<<< HEAD
import type {
  UserListResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  ChannelListResponse,
  ModerateChannelRequest,
  ModerateChannelResponse,
  AiConfig,
  AuditLogResponse,
  AdminHealthResponse,
} from './admin-service.js';
import {
  listUsers,
  updateUserStatus,
  listChannels,
  moderateChannel,
  getAiConfig,
  updateAiConfig,
  getAuditLogs,
  getAdminHealth,
} from './admin-service.js';

export interface AdminController {
  listUsers(): Promise<UserListResponse>;
  updateUserStatus(id: string, req: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse | null>;
  listChannels(): Promise<ChannelListResponse>;
  moderateChannel(id: string, req: ModerateChannelRequest): Promise<ModerateChannelResponse | null>;
  getAiConfig(): Promise<AiConfig>;
  updateAiConfig(patch: Partial<AiConfig>): Promise<AiConfig>;
  getAuditLogs(): Promise<AuditLogResponse>;
  getHealth(): Promise<AdminHealthResponse>;
}

export const adminController: AdminController = {
  listUsers: () => listUsers(),
  updateUserStatus: (id, req) => updateUserStatus(id, req),
  listChannels: () => listChannels(),
  moderateChannel: (id, req) => moderateChannel(id, req),
  getAiConfig: () => getAiConfig(),
  updateAiConfig: (patch) => updateAiConfig(patch),
  getAuditLogs: () => getAuditLogs(),
  getHealth: () => getAdminHealth(),
};
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
