<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
import { createDashboardClient, type DashboardClient } from '../dashboard/dashboard-client';
import type {
  AiChatShortcut,
  ChannelSummary,
  DashboardSummary,
  Kpi,
  MonetizationProgress,
  QuickAction,
  Recommendation,
  RevenueSeries,
} from '../dashboard/types';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { KPICard } from '../components/dashboard/KPICard';
import { StatusCard } from '../components/dashboard/StatusCard';
import { ChannelHealthCard } from '../components/dashboard/ChannelHealthCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface DashboardPageProps {
  client?: DashboardClient;
  initialData?: DashboardSummary;
}

export function DashboardPage({ client, initialData }: DashboardPageProps) {
  const [state, setState] = useState<AsyncState<DashboardSummary>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const dashboardClient = useMemo(() => client ?? createDashboardClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    dashboardClient
      .loadSummary(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unknown dashboard error'));
        }
      });
    return () => controller.abort();
  }, [dashboardClient, hasInitialData]);

  return (
    <section className="dashboard-page" aria-label="Creator Dashboard">
      <header className="dashboard-header">
        <div>
          <p className="section-kicker">Creator Workspace</p>
          <h2 className="dashboard-title">Creator Dashboard</h2>
        </div>
        {state.status === 'success' && state.data && <AiChatShortcut aiChat={state.data.aiChat} />}
      </header>

      {state.status === 'loading' && <LoadingState message="Loading creator dashboard…" />}
      {state.status === 'empty' && <EmptyState message="No dashboard data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the dashboard.'} />
      )}
      {state.status === 'success' && state.data && <DashboardContent data={state.data} />}
    </section>
  );
}

function AiChatShortcut({ aiChat }: { aiChat: AiChatShortcut }) {
  if (!aiChat.enabled) return null;
  return (
    <button type="button" className="ai-chat-shortcut" data-testid="ai-chat-shortcut">
      💬 <span>{aiChat.label}</span>
      <small>{aiChat.prompt}</small>
    </button>
  );
}

interface DashboardContentProps {
  data: DashboardSummary;
}

function DashboardContent({ data }: DashboardContentProps) {
  const monetizationPercent =
    data.monetization.goal > 0
      ? Math.min(100, Math.round((data.monetization.current / data.monetization.goal) * 100))
      : 0;
  return (
    <div className="dashboard-columns">
      <div className="dashboard-column">
        <StatusCard aiStatus={data.aiStatus} />
        <ChannelHealthCard health={data.channelHealth} />
        <MonetizationProgress data={data.monetization} percent={monetizationPercent} />
        <ChannelsList channels={data.channels} />
        <QuickActions actions={data.quickActions} />
      </div>
      <div className="dashboard-column">
        <KpiGrid kpis={data.kpis} />
        <RevenueChart series={data.revenueSeries} />
        <Recommendations items={data.recommendations} />
        <RecentActivityList items={data.recentActivity} />
      </div>
    </div>
  );
}

function MonetizationProgress({
  data,
  percent,
}: {
  data: MonetizationProgress;
  percent: number;
}) {
  return (
    <section className="card" aria-label="Monetization Progress">
      <h3 className="card-title">Monetization Progress</h3>
      <div className="monetization-meta">
        <span>
          ${data.current.toLocaleString()} / ${data.goal.toLocaleString()}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="monetization-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="monetization-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="muted">{data.note}</p>
    </section>
  );
}

function ChannelsList({ channels }: { channels: ChannelSummary[] }) {
  return (
    <section className="card" aria-label="Channel Overview">
      <h3 className="card-title">Channel Overview</h3>
      {channels.length === 0 ? (
        <p className="muted">No channels linked yet.</p>
      ) : (
        <ul className="channels-list">
          {channels.map((channel) => (
            <li key={channel.id}>
              <strong>{channel.title}</strong>
              <span>{channel.subscriberCount} subscribers · {channel.videoCount} videos</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section className="card" aria-label="Quick Actions">
      <h3 className="card-title">Quick Actions</h3>
      <div className="quick-actions">
        {actions.map((action) => (
          <button type="button" key={action.id} className="quick-action" data-testid={`quick-action-${action.id}`}>
            <span>{action.icon}</span> {action.label}
            <small>{action.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="card" aria-label="KPI Summary">
      <h3 className="card-title">KPI Summary</h3>
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </section>
  );
}

function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <section className="card" aria-label="AI Recommendations">
      <h3 className="card-title">AI Recommendations</h3>
      <div className="recommendations-list">
        {items.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    </section>
  );
}
=======
export function DashboardPage() { return <section className="card journey-page" aria-labelledby="dashboard-title"><p className="section-kicker">Mock dashboard</p><h2 id="dashboard-title">Creator dashboard</h2><div className="journey-kpis"><strong>72<br /><small>Success score</small></strong><strong>2<br /><small>Active workflows</small></strong><strong>91<br /><small>Quality score</small></strong><strong>+12%<br /><small>Views trend</small></strong></div></section>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
