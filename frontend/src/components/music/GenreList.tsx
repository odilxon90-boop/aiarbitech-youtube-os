export function GenreList({ genres, selectedGenre, onSelect }: { genres: readonly string[]; selectedGenre?: string | undefined; onSelect: (genre?: string) => void }) {
  return <nav className="music-genres" aria-label="Music genres"><button type="button" aria-pressed={!selectedGenre} onClick={() => onSelect(undefined)}>All genres</button>{genres.map((genre) => <button key={genre} type="button" aria-pressed={selectedGenre === genre} onClick={() => onSelect(genre)}>{genre}</button>)}</nav>;
}
