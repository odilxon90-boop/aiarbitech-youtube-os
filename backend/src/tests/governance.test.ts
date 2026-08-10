<<<<<<< HEAD
import { describe, expect, it } from 'vitest';
import { loadGovernanceArtifact, loadGovernanceBundle } from '../platform/governance-loader.js';
import { discoverContractCompatibility } from '../platform/contract-discovery.js';

describe('Gate 0B governance', () => {
  it('schema-validates every versioned repository-owned artifact', async () => {
    const bundle = await loadGovernanceBundle();
    expect(Object.keys(bundle)).toHaveLength(9);
    expect(bundle.passport.currentGate).toBe('GATE_0B');
    expect(bundle.registrationReadiness.sprint0Authorized).toBe(false);
  });
  it('loads artifacts as immutable read-only evidence', async () => {
    const passport = await loadGovernanceArtifact('passport');
    expect(Object.isFrozen(passport)).toBe(true);
    expect(Object.isFrozen(passport.evidence)).toBe(true);
  });
  it('discovers only local placeholders and does not invent authority', async () => {
    const report = await discoverContractCompatibility();
    expect(report.networkRequestPerformed).toBe(false);
    expect(report.overallCompatibility).toBe('NOT_VERIFIED');
    expect(report.matrix.every((item) => item.authoritativeContractStatus === 'AUTHORITATIVE CONTRACT NOT AVAILABLE')).toBe(true);
=======
import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' }); const headers = { authorization: 'Bearer mock-token', 'x-permissions': 'governance:access' }; const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close()))); async function createApp() { const app = await buildApp({ config, logger: new NoopLogger() }); apps.push(app); return app; }
const role = { name: 'Moderator', description: 'Mock moderation role.', permissionIds: ['channels:read', 'channels:update'] };
describe('Governance API', () => {
  it('requires authentication and governance:access', async () => { const app = await createApp(); expect((await app.inject({ method: 'GET', url: '/api/v1/governance/roles' })).statusCode).toBe(401); expect((await app.inject({ method: 'GET', url: '/api/v1/governance/roles', headers: { authorization: 'Bearer token' } })).statusCode).toBe(403); });
  it('returns roles, permissions, and user assignments', async () => { const app = await createApp(); const roles = await app.inject({ method: 'GET', url: '/api/v1/governance/roles', headers }); const permissions = await app.inject({ method: 'GET', url: '/api/v1/governance/permissions', headers }); const user = await app.inject({ method: 'GET', url: '/api/v1/governance/users/user-01/roles', headers }); expect(roles.json().data.length).toBeGreaterThanOrEqual(5); expect(permissions.json().data.length).toBeGreaterThanOrEqual(20); expect(user.json().data.roleIds).toHaveLength(1); });
  it('supports role CRUD and permission assignment', async () => { const app = await createApp(); const created = await app.inject({ method: 'POST', url: '/api/v1/governance/roles', headers, payload: role }); const id = created.json().data.id; const updated = await app.inject({ method: 'PUT', url: `/api/v1/governance/roles/${id}`, headers, payload: { ...role, name: 'Updated Moderator' } }); const assigned = await app.inject({ method: 'POST', url: '/api/v1/governance/permissions/assign', headers, payload: { roleId: id, permissionIds: ['users:read'] } }); const deleted = await app.inject({ method: 'DELETE', url: `/api/v1/governance/roles/${id}`, headers }); expect(updated.json().data.name).toBe('Updated Moderator'); expect(assigned.json().data.permissionIds).toEqual(['users:read']); expect(deleted.json().data.deleted).toBe(true); });
  it('does not delete roles that are still assigned to users', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'DELETE', url: '/api/v1/governance/roles/role-president', headers });

    expect(response.statusCode).toBe(409);
    expect(response.json().error.code).toBe('ROLE_ASSIGNED');
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
  });
});
