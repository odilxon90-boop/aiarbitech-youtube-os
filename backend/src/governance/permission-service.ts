export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'execute';
export interface Role { id: string; name: 'President' | 'Heir' | 'Admin' | 'Creator' | 'Viewer' | string; description: string; permissionIds: string[]; }
export interface Permission { id: string; resource: 'users' | 'channels' | 'videos' | 'ai' | 'governance'; action: PermissionAction; }
export interface UserRoleAssignment { userId: string; userName: string; roleIds: string[]; }
const permissions: Permission[] = (['users', 'channels', 'videos', 'ai', 'governance'] as const).flatMap((resource) => (['create', 'read', 'update', 'delete', 'execute'] as const).map((action) => ({ id: `${resource}:${action}`, resource, action })));
const allPermissionIds = permissions.map((permission) => permission.id);
const roles: Role[] = [
  { id: 'role-president', name: 'President', description: 'Full platform governance authority.', permissionIds: [...allPermissionIds] },
  { id: 'role-heir', name: 'Heir', description: 'Delegated governance continuity authority.', permissionIds: allPermissionIds.filter((id) => !id.endsWith(':delete')) },
  { id: 'role-admin', name: 'Admin', description: 'Platform administration authority.', permissionIds: allPermissionIds.filter((id) => !id.startsWith('governance:') || id.endsWith(':read')) },
  { id: 'role-creator', name: 'Creator', description: 'Creator workspace authority.', permissionIds: permissions.filter((item) => ['channels', 'videos', 'ai'].includes(item.resource) && ['create', 'read', 'update', 'execute'].includes(item.action)).map((item) => item.id) },
  { id: 'role-viewer', name: 'Viewer', description: 'Read-only platform access.', permissionIds: permissions.filter((item) => item.action === 'read').map((item) => item.id) },
];
const users: readonly UserRoleAssignment[] = ['Amina', 'Bob', 'Chloe', 'Diyor', 'Elena', 'Farid', 'Grace', 'Hasan', 'Iris', 'Jasur'].map((userName, index) => ({ userId: `user-${String(index + 1).padStart(2, '0')}`, userName, roleIds: [roles[index % roles.length]!.id] }));
export class PermissionService {
  private counter = roles.length;
  roles(): readonly Role[] { return roles; }
  createRole(input: Pick<Role, 'name' | 'description' | 'permissionIds'>): Role { this.counter += 1; const role = { id: `role-custom-${this.counter}`, ...input, permissionIds: [...input.permissionIds] }; roles.push(role); return role; }
  updateRole(id: string, input: Pick<Role, 'name' | 'description' | 'permissionIds'>): Role { const role = this.findRole(id); Object.assign(role, input, { permissionIds: [...input.permissionIds] }); return role; }
  deleteRole(id: string): { id: string; deleted: true } {
    const index = roles.findIndex((role) => role.id === id);
    if (index < 0) throw new Error(`Role ${id} was not found.`);
    if (users.some((user) => user.roleIds.includes(id))) {
      throw new PlatformError(409, 'ROLE_ASSIGNED', `Role ${id} cannot be deleted while users are assigned to it.`);
    }
    roles.splice(index, 1);
    return { id, deleted: true };
  }
  permissions(): readonly Permission[] { return permissions; }
  assignPermissions(roleId: string, permissionIds: string[]): Role { const role = this.findRole(roleId); role.permissionIds = [...permissionIds]; return role; }
  userRoles(userId: string): UserRoleAssignment { const user = users.find((item) => item.userId === userId); if (!user) throw new Error(`User ${userId} was not found.`); return user; }
  canAccess(roleId: string, permissionId: string): boolean { return this.findRole(roleId).permissionIds.includes(permissionId); }
  private findRole(id: string): Role { const role = roles.find((item) => item.id === id); if (!role) throw new Error(`Role ${id} was not found.`); return role; }
}
import { PlatformError } from '../shared/errors.js';
