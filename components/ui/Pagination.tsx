"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="produce-totalPages">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition-colors cursor-pointer"
      >
        Previous
      </button>

      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
