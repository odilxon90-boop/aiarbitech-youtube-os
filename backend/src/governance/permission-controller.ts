import type { FastifyRequest } from 'fastify';
import { requireGovernanceAccess } from './permission-middleware.js';
import type { PermissionService, Role } from './permission-service.js';
type RoleInput = Pick<Role, 'name' | 'description' | 'permissionIds'>;
export class PermissionController {
  constructor(private readonly service: PermissionService) {}
  roles(request: FastifyRequest) { requireGovernanceAccess(request); return this.service.roles(); }
  createRole(request: FastifyRequest<{ Body: RoleInput }>) { requireGovernanceAccess(request); return this.service.createRole(request.body); }
  updateRole(request: FastifyRequest<{ Params: { id: string }; Body: RoleInput }>) { requireGovernanceAccess(request); return this.service.updateRole(request.params.id, request.body); }
  deleteRole(request: FastifyRequest<{ Params: { id: string } }>) { requireGovernanceAccess(request); return this.service.deleteRole(request.params.id); }
  permissions(request: FastifyRequest) { requireGovernanceAccess(request); return this.service.permissions(); }
  assign(request: FastifyRequest<{ Body: { roleId: string; permissionIds: string[] } }>) { requireGovernanceAccess(request); return this.service.assignPermissions(request.body.roleId, request.body.permissionIds); }
  userRoles(request: FastifyRequest<{ Params: { userId: string } }>) { requireGovernanceAccess(request); return this.service.userRoles(request.params.userId); }
}
