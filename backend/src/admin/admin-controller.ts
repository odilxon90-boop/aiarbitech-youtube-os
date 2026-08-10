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
  logs(request: FastifyRequest) { return this.auditLogs(request); }
  platforms(request: FastifyRequest) {
    authorizeAdmin(request);
    return [
      { id: 'youtube-os', name: 'YouTube OS', status: 'ACTIVE', users: 184200 },
      { id: 'ai-arbitrage', name: 'AI Arbitrage', status: 'ACTIVE', users: 42100 },
      { id: 'market-pulse', name: 'AI Market Pulse Scalper', status: 'ACTIVE', users: 18700 },
      { id: 'video-creator', name: 'AI Video Creator Studio', status: 'ACTIVE', users: 63200 },
      { id: 'global-media', name: 'AIArbiTech TV Global Media', status: 'ACTIVE', users: 91500 },
    ];
  }
  health(request: FastifyRequest) { authorizeAdmin(request); return this.service.getHealth(); }
}
