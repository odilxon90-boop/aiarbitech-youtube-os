import { AIConfigForm } from '../components/admin/AIConfigForm';
import { AuditLogList } from '../components/admin/AuditLogList';
import { ChannelModeration } from '../components/admin/ChannelModeration';
import { HealthCard } from '../components/admin/HealthCard';
import { UserList } from '../components/admin/UserList';

const users = ['Amina Karimova', 'Bob Davis', 'Chloe Martin', 'Diyor Tursunov', 'Elena Ruiz', 'Farid Ahmed', 'Grace Kim', 'Hasan Aliyev', 'Iris Chen', 'Jasur Mirzaev'].map((name, index) => ({ id: `user-${index}`, name, role: (['creator', 'viewer', 'admin'][index % 3] as 'creator' | 'viewer' | 'admin'), status: 'ACTIVE' }));
const channels = ['Aurora Stories', 'Byte Sized', 'Creator Lab', 'Daily Focus', 'Explore Atlas', 'Future Frame', 'Game Craft', 'Home Studio', 'Insight Loop', 'Journey Notes'].map((name, index) => ({ id: `channel-${index}`, name, status: index % 3 === 0 ? 'PENDING_REVIEW' : 'APPROVED' }));
const auditLogs = Array.from({ length: 15 }, (_, index) => ({ id: `audit-${index}`, timestamp: `2026-08-09T12:${String(index).padStart(2, '0')}:00Z`, actor: index % 2 ? 'system' : 'admin.chloe', action: index % 2 ? 'CHANNEL_REVIEWED' : 'USER_STATUS_UPDATED' }));
const health = [{ name: 'API', status: 'GREEN', detail: '42ms' }, { name: 'Database', status: 'GREEN', detail: 'Healthy' }, { name: 'AI Core', status: 'YELLOW', detail: '74% queue' }, { name: 'YouTube', status: 'RED', detail: 'Unavailable' }] as const;

export function AdminPanelPage() {
  return <section className="admin-panel" aria-labelledby="admin-panel-title"><div className="admin-panel__header"><div><p className="eyebrow">Mock data only</p><h2 id="admin-panel-title">Administration</h2></div><span className="foundation-badge">admin:access</span></div><div className="admin-grid"><UserList users={users} /><ChannelModeration channels={channels} /><AIConfigForm initialConfig={{ model: 'aiarbitech-director-mock-v1', temperature: 0.7, maxTokens: 2048 }} /><HealthCard metrics={health} /><AuditLogList logs={auditLogs} /></div></section>;
}
