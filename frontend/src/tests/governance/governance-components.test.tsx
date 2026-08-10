import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PermissionList } from '../../components/governance/PermissionList';
import { RoleList } from '../../components/governance/RoleList';
import { UserRoleTable } from '../../components/governance/UserRoleTable';
describe('Governance components', () => {
  it('renders roles and permissions', () => { expect(renderToStaticMarkup(<RoleList roles={[{ id: 'r1', name: 'Admin', description: 'Mock' }]} />)).toContain('Admin'); expect(renderToStaticMarkup(<PermissionList permissions={[{ id: 'p1', resource: 'users', action: 'read' }]} />)).toContain('users'); });
  it('renders user role assignments', () => expect(renderToStaticMarkup(<UserRoleTable users={[{ userId: 'u1', userName: 'Amina', role: 'Creator' }]} />)).toContain('Creator'));
});
