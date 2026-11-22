import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLoginMutation } from "@/hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_LOGIN_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_LOGIN_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_LOGIN_FORM);
  const loginMutation = useLoginMutation();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length >= 8;
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;

  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="max-w-[440px] w-full mx-auto px-6 py-16 flex-1">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">로그인</h1>
        <p className="text-sm text-slate-500 mt-1.5">
          계정에 로그인하고 나만의 영화 기록을 관리해 보세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChangeField("email", e.target.value)}
            placeholder="이메일을 입력해 주세요."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-500">
              올바른 이메일 형식을 입력해 주세요.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            placeholder="비밀번호를 입력해 주세요."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showPasswordError && (
            <p className="mt-1.5 text-xs text-red-500">
              비밀번호는 8자 이상 입력해 주세요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          아직 계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
