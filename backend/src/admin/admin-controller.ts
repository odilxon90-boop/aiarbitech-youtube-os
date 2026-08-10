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
