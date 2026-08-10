import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { PermissionController } from './permission-controller.js';
import type { Role } from './permission-service.js';
import { PermissionService } from './permission-service.js';
type RoleInput = Pick<Role, 'name' | 'description' | 'permissionIds'>;
export function registerPermissionRoutes(app: FastifyInstance, controller = new PermissionController(new PermissionService())): void {
  app.get('/api/v1/governance/roles', async (request) => successResponse(controller.roles(request), request.correlationId));
  app.post<{ Body: RoleInput }>('/api/v1/governance/roles', async (request) => successResponse(controller.createRole(request), request.correlationId));
  app.put<{ Params: { id: string }; Body: RoleInput }>('/api/v1/governance/roles/:id', async (request) => successResponse(controller.updateRole(request), request.correlationId));
  app.delete<{ Params: { id: string } }>('/api/v1/governance/roles/:id', async (request) => successResponse(controller.deleteRole(request), request.correlationId));
  app.get('/api/v1/governance/permissions', async (request) => successResponse(controller.permissions(request), request.correlationId));
  app.post<{ Body: { roleId: string; permissionIds: string[] } }>('/api/v1/governance/permissions/assign', async (request) => successResponse(controller.assign(request), request.correlationId));
  app.get<{ Params: { userId: string } }>('/api/v1/governance/users/:userId/roles', async (request) => successResponse(controller.userRoles(request), request.correlationId));
}
