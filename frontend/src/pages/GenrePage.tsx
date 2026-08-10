import { useEffect, useMemo, useState } from 'react';
import { createGenreClient, type GenreClient } from '../genre/genre-client';
import type { GenreSummary } from '../genre/types';
import { TrendChart } from '../components/genre/TrendChart';
import { RecommendationList } from '../components/genre/RecommendationList';
import { PopularityList } from '../components/genre/PopularityList';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface GenrePageProps {
  client?: GenreClient;
  initialData?: GenreSummary;
}

export function GenrePage({ client, initialData }: GenrePageProps) {
  const [state, setState] = useState<AsyncState<GenreSummary>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const genreClient = useMemo(() => client ?? createGenreClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    genreClient
      .loadSummary(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load genre data.'));
        }
      });
    return () => controller.abort();
  }, [genreClient, hasInitialData]);

  return (
    <section className="genre-page" aria-label="AI Music Genre Recommendation">
      <header className="genre-header">
        <div>
          <p className="section-kicker">AI Insights</p>
          <h2 className="genre-title">AI Music Genre Recommendation</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading genre data…" />}
      {state.status === 'empty' && <EmptyState message="No genre data is available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load genre data.'} />
      )}
      {state.status === 'success' && state.data && <GenreContent data={state.data} />}
    </section>
  );
}

function GenreContent({ data }: { data: GenreSummary }) {
  return (
    <div className="genre-columns">
      <div className="genre-column">
        <TrendChart trends={data.trends} />
        <PopularityList genres={data.popularity} />
      </div>
      <div className="genre-column">
        <RecommendationList recommendations={data.recommendations} />
      </div>
    </div>
  );
}
