import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
}: PaginationProps) {
  const maxVisiblePages = Math.min(totalPages, 5);
  const pages = Array.from({ length: maxVisiblePages }, (_, idx) => idx + 1);

  return (
    <nav className="flex justify-center gap-2" aria-label="페이지 네비게이션">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange?.(page)}
          className={cn(
            "w-9 h-9 rounded-md border text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center",
            page === currentPage
              ? "bg-slate-900 text-white border-slate-900"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100",
          )}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
