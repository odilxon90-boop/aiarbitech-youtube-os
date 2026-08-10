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
}
