import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { AppShell } from './AppShell';
import { createPlatformFoundationClient, type PlatformFoundationClient } from '../platform/platform-client';
import type { PlatformFoundationStatus } from '../platform/types';
import { GlobalEcosystemStatusPage } from '../platform/GlobalEcosystemStatusPage';
import { HealthStatusPage } from '../platform/HealthStatusPage';
import { PlatformIdentityPage } from '../platform/PlatformIdentityPage';
import { DashboardPage } from '../pages/DashboardPage';
import { GlobalEcosystemHomePage } from '../pages/GlobalEcosystemHomePage';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

const AnalyticsPage = lazy(async () => ({ default: (await import('../pages/AnalyticsPage')).AnalyticsPage }));
const AIAssistantPage = lazy(async () => ({ default: (await import('../pages/AIAssistantPage')).AIAssistantPage }));
const QualityGatePage = lazy(async () => ({ default: (await import('../pages/QualityGatePage')).QualityGatePage }));
const AdminPanelPage = lazy(async () => ({ default: (await import('../pages/AdminPanelPage')).AdminPanelPage }));
const AISyncPage = lazy(async () => ({ default: (await import('../pages/AISyncPage')).AISyncPage }));
const WorkflowPage = lazy(async () => ({ default: (await import('../pages/WorkflowPage')).WorkflowPage }));
const PromptRegistryPage = lazy(async () => ({ default: (await import('../pages/PromptRegistryPage')).PromptRegistryPage }));
const OnboardingPage = lazy(async () => ({ default: (await import('../pages/OnboardingPage')).OnboardingPage }));
const SuccessScorePage = lazy(async () => ({ default: (await import('../pages/SuccessScorePage')).SuccessScorePage }));
const TwinPage = lazy(async () => ({ default: (await import('../pages/TwinPage')).TwinPage }));
const GatewayPage = lazy(async () => ({ default: (await import('../pages/GatewayPage')).GatewayPage }));
const GovernancePage = lazy(async () => ({ default: (await import('../pages/GovernancePage')).GovernancePage }));
const PresidentPanelPage = lazy(async () => ({ default: (await import('../pages/PresidentPanelPage')).PresidentPanelPage }));

export interface AppProps {
  client?: PlatformFoundationClient;
}

export function App({ client }: AppProps) {
  const platformClient = useMemo(() => client ?? createPlatformFoundationClient(), [client]);
  const [state, setState] = useState<AsyncState<PlatformFoundationStatus>>(loadingState());

  useEffect(() => {
    const controller = new AbortController();
    setState(loadingState());
    platformClient
      .loadFoundationStatus(controller.signal)
      .then((status) => setState(successState(status)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unknown platform status error'));
        }
      });
    return () => controller.abort();
  }, [platformClient]);

  return (
    <AppShell>
      <GlobalEcosystemHomePage />
      <DashboardPage />
      <Suspense fallback={<LoadingState />}>
        <AnalyticsPage />
        <AIAssistantPage />
      {state.status === 'loading' && <LoadingState />}
      {state.status === 'error' && <ErrorState message={state.error ?? 'Unknown error'} />}
      {state.status === 'empty' && <EmptyState />}
      {state.status === 'success' && state.data && (
        <div className="dashboard-grid">
          <PlatformIdentityPage manifest={state.data.manifest} />
          <HealthStatusPage health={state.data.health} />
          <GlobalEcosystemStatusPage
            status={{
              ...state.data.connection,
              capabilities: state.data.manifest.globalEcosystemCompatibility.capabilities,
            }}
          />
        </div>
      )}
        <QualityGatePage />
        <AdminPanelPage />
        <AISyncPage />
        <WorkflowPage />
        <PromptRegistryPage />
        <OnboardingPage />
        <SuccessScorePage />
        <TwinPage />
        <GatewayPage />
        <GovernancePage />
        <PresidentPanelPage />
      </Suspense>
    </AppShell>
  );
}
