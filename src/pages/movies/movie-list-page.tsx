import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="max-w-[1300px] w-full mx-auto px-6 md:px-12 py-9 pb-16 flex-1">
      <h2 className="text-2xl md:text-[28px] font-extrabold mb-7 text-slate-900">
        영화 목록
      </h2>
      {moviesQuery.isPending ? (
        <p className="text-center py-12 text-slate-500">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="text-center py-12 text-red-600">
          {moviesQuery.error.message}
        </p>
      ) : movies.length === 0 ? (
        <p className="text-center py-12 text-slate-500">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
