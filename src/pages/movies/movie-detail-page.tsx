import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getFavoriteStatus } from "@/api/favorites/get-favorite-status";
import { getMemberRatings } from "@/api/members/get-member-ratings";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/hooks/use-favorite-mutations";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "@/hooks/use-rating-mutations";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/auth/get-member-id-from-token";
import { cn } from "@/utils/cn";
import { getMovieDetailErrorMessage } from "@/utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "@/utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  // 즐겨찾기 여부 조회 (GET /favorites/{movieId})
  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
    retry: false,
  });

  // 내 평점 목록 조회 후 현재 영화의 평점 찾기 (GET /members/{memberId}/ratings)
  const memberRatingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(memberId) && isValidMovieId,
  });

  const myRating = memberRatingsQuery.data?.find(
    (item) => item.movieId === movieId,
  );

  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (myRating) {
      setRating(myRating.score);
      setReview(myRating.comment ?? "");
    } else {
      setRating(4);
      setReview("");
    }
  }, [myRating?.ratingId, myRating?.score, myRating?.comment]);

  const addFavoriteMutation = useAddFavoriteMutation(movieId);
  const removeFavoriteMutation = useRemoveFavoriteMutation(movieId);

  const createRatingMutation = useCreateRatingMutation(memberId);
  const updateRatingMutation = useUpdateRatingMutation(memberId);
  const deleteRatingMutation = useDeleteRatingMutation(memberId);

  const isFavorite = favoriteStatusQuery.data?.isFavorite ?? false;
  const isFavoritePending =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleToggleFavorite = () => {
    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      return;
    }
    if (isFavoritePending) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const handleSaveRating = () => {
    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      return;
    }

    const trimmedComment = review.trim();

    if (myRating) {
      if (updateRatingMutation.isPending) return;
      updateRatingMutation.mutate({
        ratingId: myRating.ratingId,
        score: rating,
        comment: trimmedComment || undefined,
      });
    } else {
      if (createRatingMutation.isPending) return;
      createRatingMutation.mutate({
        movieId,
        score: rating,
        comment: trimmedComment || undefined,
      });
    }
  };

  const handleDeleteRating = () => {
    if (!myRating || deleteRatingMutation.isPending) return;
    deleteRatingMutation.mutate(myRating.ratingId);
  };

  const movie = movieDetailQuery.data;

  if (!isValidMovieId) {
    return (
      <main className="max-w-[1300px] mx-auto px-6 py-20 text-center flex-1">
        <p className="text-lg font-medium text-slate-700">
          올바르지 않은 영화 번호예요.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="max-w-[1300px] mx-auto px-6 py-20 text-center flex-1">
        <p className="text-lg font-medium text-slate-500">
          영화 상세 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (movieDetailQuery.isError || !movie) {
    return (
      <main className="max-w-[1300px] mx-auto px-6 py-20 text-center flex-1">
        <p className="text-lg font-medium text-slate-700">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");
  const runtimeText = formatRuntime(movie.runtime);

  return (
    <main className="min-h-screen bg-white flex-1">
      {/* 상단 백드롭 히어로 영역 */}
      <section className="relative w-full h-[380px] md:h-[420px] overflow-hidden bg-slate-200">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-slate-300 flex items-center justify-center text-sm text-slate-600">
            이미지 없음
          </div>
        )}
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
              {movie.original_title}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-white">
              <span>{movie.release_date}</span>
              {genreText && <span>{genreText}</span>}
              <span>{runtimeText}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 상세 정보 영역 */}
      <section className="max-w-[1300px] mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* 좌측: 포스터 */}
          <div className="md:col-span-3">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                className="w-full max-w-[260px] aspect-[2/3] object-cover rounded-2xl shadow-lg border border-slate-100"
              />
            ) : (
              <div className="w-full max-w-[260px] aspect-[2/3] rounded-2xl bg-slate-200 flex items-center justify-center text-sm text-slate-500 border border-slate-100">
                이미지 없음
              </div>
            )}
          </div>

          {/* 중앙: 한 줄 카피 및 줄거리, 즐겨찾기 버튼 */}
          <div className="md:col-span-5 flex flex-col items-start">
            {movie.tagline && (
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3">
                {movie.tagline}
              </h2>
            )}
            <p className="text-sm leading-relaxed text-slate-600 mb-6">
              {movie.overview}
            </p>
            <button
              type="button"
              disabled={isFavoritePending}
              onClick={handleToggleFavorite}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-60",
                isFavorite
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
              <span>
                {isFavoritePending
                  ? "처리 중..."
                  : isFavorite
                    ? "즐겨찾기 해제"
                    : "즐겨찾기 추가"}
              </span>
            </button>
          </div>

          {/* 우측: 내 평점 카드 */}
          <div className="md:col-span-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">내 평점</h3>
              {myRating && (
                <span className="text-xs font-semibold text-blue-600">
                  등록된 평점 있음
                </span>
              )}
            </div>
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

            {/* 평점 등록 / 수정 / 삭제 버튼 */}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                disabled={
                  createRatingMutation.isPending ||
                  updateRatingMutation.isPending
                }
                onClick={handleSaveRating}
                className="flex-1 py-3 bg-[#171717] hover:bg-black disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                {myRating
                  ? updateRatingMutation.isPending
                    ? "수정 중..."
                    : "평점 수정"
                  : createRatingMutation.isPending
                    ? "등록 중..."
                    : "평점 저장"}
              </button>

              {myRating && (
                <button
                  type="button"
                  disabled={deleteRatingMutation.isPending}
                  onClick={handleDeleteRating}
                  className="px-4 py-3 border border-red-200 hover:bg-red-50 disabled:opacity-50 text-red-600 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  {deleteRatingMutation.isPending ? "삭제 중..." : "삭제"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
