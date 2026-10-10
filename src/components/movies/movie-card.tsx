import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store"; // 1. import 추가

interface MovieCardProps {
    movie: Movie;
    onToggleBookmark?: (movieId: number) => void;
}

export default function MovieCard({ movie }: MovieCardProps) {
    // 2. 전역 스토어에서 해당 영화의 북마크 여부와 토글 액션 가져오기
    const isBookmarked = useBookmarkStore((state) =>
        state.bookmarkedMovieIds.includes(movie.id),
    );
    const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

    return (
        <article className="flex flex-col group">
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-200">
                <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="block w-full h-full"
                >
                    <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-105"
                    />
                </Link>
                {/* 북마크 여부에 따라 클래스 분기 */}
                <button
                    type="button"
                    className={cn(
                        "absolute top-2.5 right-2.5 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all",
                        isBookmarked
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-900/65 hover:bg-slate-900/80",
                    )}
                    aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
                    onClick={() => toggleBookmark(movie.id)} // 3. 전역 toggleBookmark 호출
                >
                    {isBookmarked ? (
                        /* 활성 상태: 채워진 북마크 아이콘 */
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    ) : (
                        /* 비활성 상태: 테두리 북마크 아이콘 */
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="mt-2.5 flex flex-col gap-0.5">
                <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="text-slate-900 hover:text-blue-600 transition-colors"
                >
                    <h3 className="text-sm font-bold truncate" title={movie.title}>
                        {movie.title}
                    </h3>
                </Link>
                <p className="text-xs text-slate-400">{movie.releaseDate}</p>
            </div>
        </article>
    );
}