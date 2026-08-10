import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AIConfigForm } from '../../components/admin/AIConfigForm';
import { AuditLogList } from '../../components/admin/AuditLogList';
import { ChannelModeration } from '../../components/admin/ChannelModeration';
import { HealthCard } from '../../components/admin/HealthCard';
import { UserList } from '../../components/admin/UserList';

describe('Admin components', () => {
  it('renders users and channels', () => {
    expect(renderToStaticMarkup(<UserList users={[{ id: 'u1', name: 'Amina', role: 'admin', status: 'ACTIVE' }]} />)).toContain('Amina');
    expect(renderToStaticMarkup(<ChannelModeration channels={[{ id: 'c1', name: 'Aurora', status: 'APPROVED' }]} />)).toContain('Aurora');
  });
  it('renders AI configuration, audit logs, and health metrics', () => {
    expect(renderToStaticMarkup(<AIConfigForm initialConfig={{ model: 'mock', temperature: 0.7, maxTokens: 512 }} />)).toContain('Save mock configuration');
    expect(renderToStaticMarkup(<AuditLogList logs={[{ id: 'a1', timestamp: 'now', actor: 'admin', action: 'UPDATED' }]} />)).toContain('UPDATED');
    expect(renderToStaticMarkup(<HealthCard metrics={[{ name: 'API', status: 'GREEN', detail: 'Healthy' }]} />)).toContain('GREEN');
  });
});
