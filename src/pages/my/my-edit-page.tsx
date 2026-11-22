import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMe } from "@/api/members/me";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { useAuthStore } from "@/stores/auth-store";

export function MyEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const [form, setForm] = useState({
    nickname: meQuery.data?.nickname ?? "",
  });

  useEffect(() => {
    if (meQuery.data?.nickname) {
      setForm({ nickname: meQuery.data.nickname });
    }
  }, [meQuery.data?.nickname]);

  const updateMeMutation = useUpdateMeMutation();
  const nickname = form.nickname.trim();
  const canSubmit = nickname.length >= 2 && nickname.length <= 12;
  const showNicknameError = form.nickname.length > 0 && !canSubmit;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname });
  };

  return (
    <main className="max-w-[480px] w-full mx-auto px-6 py-14 flex-1">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          내 정보 수정
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          닉네임을 수정할 수 있어요.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* 이메일 (읽기 전용) */}
        <div>
          <label
            htmlFor="edit-email"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            이메일
          </label>
          <input
            id="edit-email"
            type="email"
            value={meQuery.data?.email ?? ""}
            disabled
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label
            htmlFor="edit-nickname"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            닉네임
          </label>
          <input
            id="edit-nickname"
            type="text"
            value={form.nickname}
            onChange={(e) => setForm({ nickname: e.target.value })}
            placeholder="닉네임 (2~12자)"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showNicknameError && (
            <p className="mt-1.5 text-xs text-red-500">
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            to="/mypage"
            className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg text-center transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {updateMeMutation.isPending ? "저장 중" : "저장"}
          </button>
        </div>
      </form>
    </main>
  );
}
