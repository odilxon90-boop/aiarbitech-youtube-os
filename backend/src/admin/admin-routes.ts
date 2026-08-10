import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { adminController } from './admin-controller.js';
import type { UpdateUserStatusRequest, ModerateChannelRequest } from './admin-service.js';

const ADMIN_ACCESS = 'admin:access';

export function registerAdminRoutes(app: FastifyInstance): void {
  // ── Users ──────────────────────────────────────────────────────────────────
  app.get('/api/v1/admin/users', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    return successResponse(await adminController.listUsers(), request.correlationId);
  });

  app.put('/api/v1/admin/users/:id/status', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    const { id } = request.params as { id: string };
    const body = request.body as UpdateUserStatusRequest;
    const result = await adminController.updateUserStatus(id, body);
    if (!result) throw new PlatformError(404, 'NOT_FOUND', `User '${id}' was not found.`);
    return successResponse(result, request.correlationId);
  });

  // ── Channels ───────────────────────────────────────────────────────────────
  app.get('/api/v1/admin/channels', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    return successResponse(await adminController.listChannels(), request.correlationId);
  });

  app.put('/api/v1/admin/channels/:id/moderate', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    const { id } = request.params as { id: string };
    const body = request.body as ModerateChannelRequest;
    const result = await adminController.moderateChannel(id, body);
    if (!result) throw new PlatformError(404, 'NOT_FOUND', `Channel '${id}' was not found.`);
    return successResponse(result, request.correlationId);
  });

  // ── AI Config ──────────────────────────────────────────────────────────────
  app.get('/api/v1/admin/ai-config', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    return successResponse(await adminController.getAiConfig(), request.correlationId);
  });

  app.put('/api/v1/admin/ai-config', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    const patch = request.body as Record<string, unknown>;
    const result = await adminController.updateAiConfig(patch);
    return successResponse(result, request.correlationId);
  });

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  app.get('/api/v1/admin/audit-logs', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    return successResponse(await adminController.getAuditLogs(), request.correlationId);
  });

  // ── Health ─────────────────────────────────────────────────────────────────
  app.get('/api/v1/admin/health', async (request) => {
    requirePermission(request, ADMIN_ACCESS);
    return successResponse(await adminController.getHealth(), request.correlationId);
  });
}
