import { useEffect, useMemo, useState } from 'react';
import { createHeirClient, type HeirClient } from '../heir/heir-client';
import type { HeirDashboard } from '../heir/types';
import { HealthCard } from '../components/heir/HealthCard';
import { RevenueCard } from '../components/heir/RevenueCard';
import { ChannelList } from '../components/heir/ChannelList';
import { AIStatusList } from '../components/heir/AIStatusList';
import { RiskList } from '../components/heir/RiskList';
import { TrainingProgress } from '../components/heir/TrainingProgress';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface HeirPanelPageProps {
  client?: HeirClient;
  initialData?: HeirDashboard;
}

export function HeirPanelPage({ client, initialData }: HeirPanelPageProps) {
  const [state, setState] = useState<AsyncState<HeirDashboard>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const heirClient = useMemo(() => client ?? createHeirClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    heirClient
      .loadDashboard(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load heir panel.'));
        }
      });
    return () => controller.abort();
  }, [heirClient, hasInitialData]);

  return (
    <section className="heir-page" aria-label="Heir Panel">
      <header className="heir-header">
        <div>
          <p className="section-kicker">Executive</p>
          <h2 className="heir-title">Heir Panel</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading heir panel…" />}
      {state.status === 'empty' && <EmptyState message="No heir data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the heir panel.'} />
      )}
      {state.status === 'success' && state.data && <HeirContent data={state.data} />}
    </section>
  );
}

interface HeirContentProps {
  data: HeirDashboard;
}

function HeirContent({ data }: HeirContentProps) {
  return (
    <div className="heir-columns">
      <div className="heir-column">
        <HealthCard metrics={data.health} />
        <RevenueCard revenue={data.revenue} />
        <AIStatusList aiStatus={data.aiStatus} />
      </div>
      <div className="heir-column">
        <ChannelList channels={data.channels} />
        <RiskList risks={data.risks} />
        <TrainingProgress progress={data.training} />
      </div>
    </div>
  );
}
