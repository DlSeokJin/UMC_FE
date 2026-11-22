import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { getFavorites } from "@/api/favorites/get-favorites";
import { getMemberRatings } from "@/api/members/get-member-ratings";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/auth/get-member-id-from-token";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const memberId = getMemberIdFromToken(accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });

  const ratingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(memberId),
  });

  const profileNickname = meQuery.data?.nickname ?? "사용자";
  const profileEmail = meQuery.data?.email ?? "-";
  const favorites = favoritesQuery.data ?? [];
  const ratings = ratingsQuery.data ?? [];

  const handleLogout = () => {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ["members", "me"] });
    queryClient.removeQueries({ queryKey: ["favorites"] });
    navigate({ to: "/login" });
  };

  return (
    <main className="max-w-[900px] w-full mx-auto px-6 py-12 flex-1">
      <h1 className="text-2xl md:text-[28px] font-extrabold text-slate-900 mb-6">
        내 정보
      </h1>

      {/* 프로필 카드 */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-700">
            {profileNickname.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {profileNickname}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{profileEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/mypage/edit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-colors"
          >
            <span>프로필 수정</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-semibold text-red-600 transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </section>

      {/* 내 즐겨찾기 목록 (GET /favorites) */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            내 즐겨찾기 ({favorites.length})
          </h2>
        </div>

        {favoritesQuery.isPending ? (
          <p className="py-8 text-center text-sm text-slate-500">
            즐겨찾기 목록을 불러오는 중이에요.
          </p>
        ) : favoritesQuery.isError ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-sm text-slate-500">
            즐겨찾기 목록을 불러오지 못했어요.
          </div>
        ) : favorites.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center text-sm text-slate-500">
            아직 즐겨찾기한 영화가 없어요.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map((item) => (
              <Link
                key={item.favoriteId}
                to="/movies/$movieId"
                params={{ movieId: String(item.movieId) }}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    영화 #{item.movieId}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {item.createdAt.slice(0, 10)}
                  </p>
                </div>
                <span className="text-blue-600 text-xs font-semibold">
                  상세 보기 →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 내가 남긴 평점 목록 (GET /members/{memberId}/ratings) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            내가 남긴 평점 ({ratings.length})
          </h2>
        </div>

        {ratingsQuery.isPending ? (
          <p className="py-12 text-center text-sm text-slate-500">
            평점 목록을 불러오는 중이에요.
          </p>
        ) : ratingsQuery.isError ? (
          <p className="py-12 text-center text-sm text-slate-500">
            평점 목록을 불러오지 못했어요.
          </p>
        ) : ratings.length === 0 ? (
          <div className="p-10 bg-slate-50 border border-slate-200 rounded-2xl text-center text-sm text-slate-500">
            아직 남긴 평점이 없어요.
          </div>
        ) : (
          <div className="grid gap-4">
            {ratings.map((item) => (
              <article
                key={item.ratingId}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(item.movieId) }}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline"
                  >
                    영화 #{item.movieId}
                  </Link>
                  <div className="text-amber-500 font-bold text-sm">
                    {"★".repeat(item.score)}
                    <span className="text-slate-300">
                      {"☆".repeat(Math.max(0, 5 - item.score))}
                    </span>
                    <span className="ml-1.5 text-slate-800">
                      {item.score}점
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mt-1">
                  {item.comment || "(작성된 후기가 없어요.)"}
                </p>
                <p className="text-xs text-slate-400 mt-1">{item.createdAt}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
