// src/components/shared/Pagination.jsx
export default function Pagination({ page = 1, pageCount = 1, onPageChange }) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const go = (p) => () => onPageChange?.(p);

  const Btn = ({ children, active, disabled, onClick, ariaLabel }) => (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[
        "mx-1 h-9 min-w-9 px-3 inline-flex items-center justify-center rounded-md border",
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <nav className="flex items-center" aria-label="Pagination">
      <Btn ariaLabel="Previous page" disabled={page <= 1} onClick={go(Math.max(1, page - 1))}>
        ←
      </Btn>
      {pages.map((p) => (
        <Btn key={p} active={p === page} onClick={go(p)} ariaLabel={`Page ${p}`}>
          {p}
        </Btn>
      ))}
      <Btn ariaLabel="Next page" disabled={page >= pageCount} onClick={go(Math.min(pageCount, page + 1))}>
        →
      </Btn>
    </nav>
  );
}
