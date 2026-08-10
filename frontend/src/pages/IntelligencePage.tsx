import { useEffect, useMemo, useState } from 'react';
import { createIntelligenceClient, type IntelligenceClient } from '../intelligence/intelligence-client';
import type { IntelligenceSummary } from '../intelligence/types';
import { ProfileCard } from '../components/intelligence/ProfileCard';
import { SkillList } from '../components/intelligence/SkillList';
import { StrengthList } from '../components/intelligence/StrengthList';
import { WeaknessList } from '../components/intelligence/WeaknessList';
import { RecommendationList } from '../components/intelligence/RecommendationList';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface IntelligencePageProps {
  client?: IntelligenceClient;
  initialData?: IntelligenceSummary;
}

export function IntelligencePage({ client, initialData }: IntelligencePageProps) {
  const [state, setState] = useState<AsyncState<IntelligenceSummary>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const intelligenceClient = useMemo(() => client ?? createIntelligenceClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    intelligenceClient
      .loadSummary(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load intelligence.'));
        }
      });
    return () => controller.abort();
  }, [intelligenceClient, hasInitialData]);

  return (
    <section className="intelligence-page" aria-label="Creator Intelligence Center">
      <header className="intelligence-header">
        <div>
          <p className="section-kicker">AI Insights</p>
          <h2 className="intelligence-title">Creator Intelligence Center</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading intelligence…" />}
      {state.status === 'empty' && <EmptyState message="No intelligence data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the intelligence center.'} />
      )}
      {state.status === 'success' && state.data && <IntelligenceContent data={state.data} />}
    </section>
  );
}

interface IntelligenceContentProps {
  data: IntelligenceSummary;
}

function IntelligenceContent({ data }: IntelligenceContentProps) {
  return (
    <div className="intelligence-columns">
      <div className="intelligence-column">
        <ProfileCard profile={data.profile} />
        <SkillList skills={data.skills} />
      </div>
      <div className="intelligence-column">
        <StrengthList strengths={data.strengths} />
        <WeaknessList weaknesses={data.weaknesses} />
        <RecommendationList recommendations={data.recommendations} />
      </div>
    </div>
  );
}
