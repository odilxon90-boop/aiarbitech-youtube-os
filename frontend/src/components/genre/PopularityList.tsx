import type { GenrePopularity } from '../../genre/types';

export interface PopularityListProps {
  genres: readonly GenrePopularity[];
}

const CHANGE_ICON: Record<GenrePopularity['change'], string> = {
  UP: '▲',
  DOWN: '▼',
  STABLE: '━',
};

export function PopularityList({ genres }: PopularityListProps) {
  return (
    <section className="card" aria-label="Genre Popularity">
      <h3 className="card-title">Genre Popularity Rankings</h3>
      {genres.length === 0 ? (
        <p className="muted">No popularity data available.</p>
      ) : (
        <ol className="popularity-list">
          {genres.map((genre) => (
            <li key={genre.id} className="popularity-item">
              <span className="popularity-rank">#{genre.rank}</span>
              <strong className="popularity-name">{genre.name}</strong>
              <span className="popularity-score">{genre.score}/100</span>
              <span
                className={`popularity-change popularity-change--${genre.change.toLowerCase()}`}
                aria-label={`Trend: ${genre.change}`}
              >
                {CHANGE_ICON[genre.change]}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
