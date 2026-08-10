import { useEffect, useMemo, useState } from 'react';
import { createPresidentClient, type PresidentClient } from '../president/president-client';
import type { PresidentDashboard } from '../president/types';
import { HealthCard } from '../components/president/HealthCard';
import { RevenueCard } from '../components/president/RevenueCard';
import { ChannelList } from '../components/president/ChannelList';
import { AIStatusList } from '../components/president/AIStatusList';
import { RiskList } from '../components/president/RiskList';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface PresidentPanelPageProps {
  client?: PresidentClient;
  initialData?: PresidentDashboard;
}

export function PresidentPanelPage({ client, initialData }: PresidentPanelPageProps) {
  const [state, setState] = useState<AsyncState<PresidentDashboard>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const presidentClient = useMemo(() => client ?? createPresidentClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    presidentClient
      .loadDashboard(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load president panel.'));
        }
      });
    return () => controller.abort();
  }, [presidentClient, hasInitialData]);

  return (
    <section className="president-page" aria-label="President Panel">
      <header className="president-header">
        <div>
          <p className="section-kicker">Executive</p>
          <h2 className="president-title">President Panel</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading president panel…" />}
      {state.status === 'empty' && <EmptyState message="No president data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the president panel.'} />
      )}
      {state.status === 'success' && state.data && <PresidentContent data={state.data} />}
    </section>
  );
}

interface PresidentContentProps {
  data: PresidentDashboard;
}

function PresidentContent({ data }: PresidentContentProps) {
  return (
    <div className="president-columns">
      <div className="president-column">
        <HealthCard metrics={data.health} />
        <RevenueCard revenue={data.revenue} />
        <AIStatusList aiStatus={data.aiStatus} />
      </div>
      <div className="president-column">
        <ChannelList channels={data.channels} />
        <RiskList risks={data.risks} />
      </div>
    </div>
  );
}
