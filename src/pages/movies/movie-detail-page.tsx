import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const isBookmarked = useBookmarkStore((state) =>
        movie ? state.bookmarkedMovieIds.includes(movie.id) : false,);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <main className="max-w-[1300px] mx-auto px-6 py-20 text-center">
        <p className="text-lg font-medium text-slate-700">영화를 찾을 수 없어요.</p>
        <Link to="/" className="inline-block mt-4 text-sm text-blue-600 hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 상단 백드롭 히어로 영역 */}
      <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden bg-black">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* 어두운 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />

        {/* 히어로 내부 컨텐츠 */}
        <div className="absolute inset-0 max-w-[1300px] mx-auto px-6 md:px-12 flex flex-col justify-between py-6 md:py-8">
          {/* 뒤로가기 링크 */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>영화 목록</span>
            </Link>
          </div>

          {/* 영화 타이틀 및 메타 정보 */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-white mb-2 leading-tight">
              {movie.title}
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-normal mb-3">
              {movie.originalTitle}
            </p>
            <div className="flex items-center gap-4 text-sm font-semibold text-white">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 상세 정보 영역 */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* 좌측: 포스터 */}
          <div className="md:col-span-3">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="w-full max-w-[260px] aspect-[2/3] object-cover rounded-2xl shadow-lg border border-slate-100"
            />
          </div>

          {/* 중앙: 한 줄 카피 및 줄거리, 즐겨찾기 버튼 */}
          <div className="md:col-span-5 flex flex-col items-start">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
              {movie.tagline}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 mb-6">
              {movie.overview}
            </p>
            <button
              type="button"
              onClick={() => {
                  if (movie) toggleBookmark(movie.id);
              }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer",
                isBookmarked
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white",
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
                <span>{isBookmarked ? "북마크 해제" : "북마크 추가"}</span>
            </button>
          </div>

          {/* 우측: 내 평점 카드 */}
          <div className="md:col-span-4 w-full">
            <h3 className="text-base font-bold text-slate-900">내 평점</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              별점은 필수, 후기는 선택이에요.
            </p>

            {/* 별점 5개 버튼 */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-base transition-colors hover:border-slate-400 cursor-pointer"
                  aria-label={`${star}점`}
                >
                  {star <= rating ? (
                    <span className="text-slate-900 text-lg">★</span>
                  ) : (
                    <span className="text-slate-300 text-lg">☆</span>
                  )}
                </button>
              ))}
            </div>

            {/* 후기 텍스트 영역 */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="w-full h-28 p-3 text-sm border border-slate-200 rounded-xl resize-none placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800"
            />

            {/* 평점 저장 버튼 */}
            <button
              type="button"
              className="w-full mt-4 py-3 bg-[#171717] hover:bg-black text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              평점 저장
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}