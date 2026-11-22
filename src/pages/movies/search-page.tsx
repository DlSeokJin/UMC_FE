import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="max-w-[1300px] w-full mx-auto px-6 md:px-12 py-9 pb-16 flex-1">
      <h1 className="text-2xl md:text-[28px] font-extrabold mb-6 text-slate-900">
        영화 검색
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 max-w-xl">
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 입력해 주세요."
          className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-slate-500 py-8">검색어를 입력해 주세요.</p>
      ) : searchQuery.isLoading ? (
        <p className="text-slate-500 py-8">검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p className="text-red-600 py-8">{searchQuery.error.message}</p>
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              ‘{query}’ 검색 결과
            </h2>
            <p className="text-sm text-slate-500 mt-1">영화 0편</p>
          </div>
          <p className="text-slate-500 py-8">검색 결과가 없어요.</p>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              ‘{query}’ 검색 결과
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              영화 {searchResults.length}편
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);
              return (
                <li
                  key={movie.id}
                  className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm"
                >
                  <div className="w-28 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-slate-200">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {movie.original_title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {movie.release_date}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="mt-auto pt-3 flex items-center gap-3 text-sm">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        상세 보기
                      </Link>
                      <BookmarkButton movieId={movie.id} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
