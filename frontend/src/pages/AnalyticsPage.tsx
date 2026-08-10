import { useEffect, useMemo, useState } from 'react';
import { createAnalyticsClient } from '../analytics/analytics-client';
import type { AnalyticsClient } from '../analytics/analytics-client';
import type { AnalyticsBundle, AnalyticsMetric, MetricSeries } from '../analytics/types';
import { METRIC_LABELS } from '../analytics/types';
import { AudienceBreakdown } from '../components/analytics/AudienceBreakdown';
import { MetricCard } from '../components/analytics/MetricCard';
import { TimeSeriesChart } from '../components/analytics/TimeSeriesChart';
import { TopVideosTable } from '../components/analytics/TopVideosTable';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface AnalyticsPageProps {
  client?: AnalyticsClient;
  /** Optional pre-supplied data for synchronous/server rendering; skips fetching. */
  initialData?: AnalyticsBundle;
}

const METRIC_TABS: AnalyticsMetric[] = ['subscribers', 'views', 'watchTime', 'ctr', 'revenue'];

export function AnalyticsPage({ client, initialData }: AnalyticsPageProps) {
  const [state, setState] = useState<AsyncState<AnalyticsBundle>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const [selectedMetric, setSelectedMetric] = useState<AnalyticsMetric>('views');
  const analyticsClient = useMemo(() => client ?? createAnalyticsClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    analyticsClient
      .loadBundle(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(
            errorState(error instanceof Error ? error.message : 'Unable to load analytics.'),
          );
        }
      });
    return () => controller.abort();
  }, [analyticsClient, hasInitialData]);

  return (
    <section className="analytics-page" aria-label="Creator Analytics Center">
      <header className="analytics-header">
        <div>
          <p className="section-kicker">Creator Workspace</p>
          <h2 className="analytics-title">Creator Analytics Center</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading creator analytics…" />}
      {state.status === 'empty' && <EmptyState message="No analytics data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load analytics.'} />
      )}
      {state.status === 'success' && state.data && (
        <AnalyticsContent data={state.data} selectedMetric={selectedMetric} onSelectMetric={setSelectedMetric} />
      )}
    </section>
  );
}

interface AnalyticsContentProps {
  data: AnalyticsBundle;
  selectedMetric: AnalyticsMetric;
  onSelectMetric: (metric: AnalyticsMetric) => void;
}

function AnalyticsContent({ data, selectedMetric, onSelectMetric }: AnalyticsContentProps) {
  const series =
    data.trends.series.find((s: MetricSeries) => s.metric === selectedMetric) ??
    data.trends.series[0] ?? null;

  return (
    <div className="analytics-columns">
      <section className="card analytics-metrics" aria-label="Key Metrics">
        <h3 className="card-title">Key Metrics (last 30 days)</h3>
        <div className="metric-grid">
          {data.summary.metrics.map((metric) => (
            <MetricCard key={metric.metric} summary={metric} />
          ))}
        </div>
      </section>

      <section className="card analytics-trends" aria-label="Trends">
        <h3 className="card-title">Trends</h3>
        <div className="metric-tabs" role="tablist" data-testid="metric-tabs">
          {METRIC_TABS.map((metric) => (
            <button
              key={metric}
              type="button"
              role="tab"
              aria-selected={metric === selectedMetric}
              className={
                metric === selectedMetric
                  ? 'metric-tab metric-tab--active'
                  : 'metric-tab'
              }
              onClick={() => onSelectMetric(metric)}
            >
              {METRIC_LABELS[metric]}
            </button>
          ))}
        </div>
        <p className="metric-subtitle">{series ? `${series.label} over the last 30 days` : 'No series selected.'}</p>
        {series ? <TimeSeriesChart series={series} /> : null}
      </section>

      <section className="card analytics-top-videos" aria-label="Top Performing Videos">
        <h3 className="card-title">Top Performing Videos</h3>
        <TopVideosTable videos={data.performance.topVideos} />
      </section>

      <section className="card analytics-audience" aria-label="Audience Breakdown">
        <h3 className="card-title">Audience Breakdown</h3>
        <AudienceBreakdown
          geography={data.performance.geography}
          devices={data.performance.devices}
        />
      </section>
    </div>
  );
}
