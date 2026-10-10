import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1300px] h-16 mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* 좌측: 로고 및 탭 네비게이션 */}
        <div className="flex items-center gap-9">
          <Link
            to="/"
            className="flex items-center gap-2 border-[1.5px] border-slate-900 rounded-lg px-2.5 py-1 text-slate-900 font-extrabold text-decoration-none"
          >
            <span className="text-lg">🎞️</span>
            <span className="text-lg tracking-tight">UMCine</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm md:text-[15px]">
            <Link
              to="/"
              activeProps={{ className: "font-bold text-slate-900" }}
              inactiveProps={{ className: "text-slate-500 hover:text-slate-800" }}
              className="py-1.5 transition-colors"
            >
              영화
            </Link>
            <Link
              to="/search"
              activeProps={{ className: "font-bold text-slate-900" }}
              inactiveProps={{ className: "text-slate-500 hover:text-slate-800" }}
              className="py-1.5 transition-colors"
            >
              검색
            </Link>
            <button
              type="button"
              className="text-slate-500 hover:text-slate-800 py-1.5 transition-colors cursor-pointer"
            >
              내 정보
            </button>
          </nav>
        </div>

        {/* 우측: 검색 아이콘 및 로그인 버튼 */}
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="검색"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;