import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark?: (movieId: number) => void;
}

export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="text-center py-12 text-slate-500">표시할 영화가 없어요.</p>;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}