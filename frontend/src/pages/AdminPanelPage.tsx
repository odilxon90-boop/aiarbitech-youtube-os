<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
import { createAdminClient, type AdminClient } from '../admin/admin-client';
import type { AdminSummary, AiConfig } from '../admin/types';
import { UserList } from '../components/admin/UserList';
import { ChannelModeration } from '../components/admin/ChannelModeration';
import { AIConfigForm } from '../components/admin/AIConfigForm';
import { AuditLogList } from '../components/admin/AuditLogList';
import { HealthCard } from '../components/admin/HealthCard';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface AdminPanelPageProps {
  client?: AdminClient;
  initialData?: AdminSummary;
}

export function AdminPanelPage({ client, initialData }: AdminPanelPageProps) {
  const [state, setState] = useState<AsyncState<AdminSummary>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const adminClient = useMemo(() => client ?? createAdminClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    adminClient
      .loadSummary(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load admin panel.'));
        }
      });
    return () => controller.abort();
  }, [adminClient, hasInitialData]);

  function handleSaveConfig(patch: Partial<AiConfig>) {
    if (state.status !== 'success' || !state.data) return;
    adminClient
      .updateAiConfig(patch)
      .then((updated) => {
        if (state.status === 'success' && state.data) {
          setState(successState({ ...state.data, aiConfig: updated }));
        }
      })
      .catch(() => {
        // Silent failure in mock environment
      });
  }

  return (
    <section className="admin-panel-page" aria-label="Admin Panel">
      <header className="admin-header">
        <div>
          <p className="section-kicker">Platform Administration</p>
          <h2 className="admin-title">Admin Panel</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading admin panel…" />}
      {state.status === 'empty' && <EmptyState message="No admin data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the admin panel.'} />
      )}
      {state.status === 'success' && state.data && (
        <AdminContent data={state.data} onSaveConfig={handleSaveConfig} />
      )}
    </section>
  );
}

function AdminContent({
  data,
  onSaveConfig,
}: {
  data: AdminSummary;
  onSaveConfig: (patch: Partial<AiConfig>) => void;
}) {
  return (
    <div className="admin-columns">
      <div className="admin-column">
        <HealthCard health={data.health} />
        <UserList users={data.users} />
        <ChannelModeration channels={data.channels} />
      </div>
      <div className="admin-column">
        <AIConfigForm config={data.aiConfig} onSave={onSaveConfig} />
        <AuditLogList entries={data.auditLogs} />
      </div>
    </div>
  );
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
