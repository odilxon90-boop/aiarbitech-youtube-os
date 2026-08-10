import type { GenreDetails } from '../../genre/types';

export interface GenreDetailsProps {
  genre: GenreDetails;
}

const DIRECTION_LABEL: Record<GenreDetails['trendDirection'], string> = {
  RISING: '📈 Rising',
  STABLE: '➡️ Stable',
  DECLINING: '📉 Declining',
};

export function GenreDetailsCard({ genre }: GenreDetailsProps) {
  return (
    <section className="card" aria-label={`Genre Details: ${genre.name}`}>
      <h3 className="card-title">{genre.name}</h3>
      <p className="genre-description">{genre.description}</p>
      <div className="genre-meta-row">
        <span>Popularity: <strong>{genre.popularityScore}/100</strong></span>
        <span>Trend: <strong>{DIRECTION_LABEL[genre.trendDirection]}</strong></span>
      </div>
      <div className="genre-meta-row">
        <span>Audience: <strong>{genre.audienceAgeRange}</strong></span>
        <span>Avg length: <strong>{genre.avgVideoLength}</strong></span>
      </div>
      <div className="genre-keywords">
        <p className="muted-label">Style keywords</p>
        <div className="genre-rec-tags">
          {genre.styleKeywords.map((kw) => (
            <span key={kw} className="genre-tag">{kw}</span>
          ))}
        </div>
      </div>
      <div className="genre-artists">
        <p className="muted-label">Trending Artists</p>
        <ul className="artist-list">
          {genre.trendingArtists.map((artist) => (
            <li key={artist.name}>
              <strong>{artist.name}</strong>
              <span>{artist.subscribers} subscribers</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
