import { useEffect, useMemo, useState } from 'react';
import { createMemoryClient, type MemoryClient } from '../memory/memory-client';
import type {
  DecisionRecord,
  LearningEntry,
  MemorySummary,
  PreferencesPayload,
  StylePreference,
} from '../memory/types';
import { PreferenceList } from '../components/memory/PreferenceList';
import { DecisionHistory } from '../components/memory/DecisionHistory';
import { LearningSummary } from '../components/memory/LearningSummary';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface MemoryPageProps {
  client?: MemoryClient;
  initialData?: MemorySummary;
}

export function MemoryPage({ client, initialData }: MemoryPageProps) {
  const [state, setState] = useState<AsyncState<MemorySummary>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const memoryClient = useMemo(() => client ?? createMemoryClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    memoryClient
      .loadSummary(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load memory.'));
        }
      });
    return () => controller.abort();
  }, [memoryClient, hasInitialData]);

  return (
    <section className="memory-page" aria-label="Creator Memory Center">
      <header className="memory-header">
        <div>
          <p className="section-kicker">AI Memory</p>
          <h2 className="memory-title">Creator Memory Center</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading memory…" />}
      {state.status === 'empty' && <EmptyState message="No memory data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the memory center.'} />
      )}
      {state.status === 'success' && state.data && <MemoryContent data={state.data} />}
    </section>
  );
}

interface MemoryContentProps {
  data: MemorySummary;
}

function MemoryContent({ data }: MemoryContentProps) {
  return (
    <div className="memory-columns">
      <div className="memory-column">
        <PreferenceList
          stylePreferences={data.stylePreferences}
          contentPreferences={data.contentPreferences}
        />
      </div>
      <div className="memory-column">
        <DecisionHistory decisions={data.recentDecisions} />
        <LearningSummary items={data.learningHistory} />
      </div>
    </div>
  );
}
