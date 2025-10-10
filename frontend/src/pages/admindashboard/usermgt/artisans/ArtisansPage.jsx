// src/pages/admindashboard/usermgt/artisans/ArtisansPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE = [
  { name: "Jane Moon", email: "janemoon@gmail.com", category: "Plumbing", location: "Abuja" },
  { name: "Obong Emma", email: "obongem@gmail.com", category: "Haircut", location: "Port-harcourt" },
  { name: "Femi Rachel", email: "femir@gmail.com", category: "Hairdressing", location: "Lagos" },
];

const STATUS = ["Active", "Pending", "Blocked", "Active", "Active", "Pending"];

const ROWS = Array.from({ length: 54 }).map((_, i) => {
  const b = BASE[i % BASE.length];
  return {
    id: i + 1,
    name: b.name,
    email: b.email,
    phone: "08098989898",
    category: b.category,
    location: b.location,
    status: STATUS[i % STATUS.length],
    avatar: `https://i.pravatar.cc/80?img=${(i % 70) + 1}`,
  };
});

const STATUS_STYLES = {
  Active: "text-green-700 bg-green-50",
  Pending: "text-amber-700 bg-amber-50",
  Blocked: "text-rose-700 bg-rose-50",
};

// TEMP mapping so clicks demo different statuses; swap to row.id when backend is ready
const toArtisanId = (row) => {
  if (row.name.toLowerCase().includes("femi")) return "2"; // Pending
  if (row.status === "Blocked") return "3";                // Blocked
  return "1";                                              // Active
};

export default function ArtisansPage() {
  const [rows, setRows] = useState(ROWS);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const navigate = useNavigate();

  useEffect(() => {
    function onUpdated(e) {
      const { id, status, patch } = e.detail || {};
      if (!id) return;
      setRows((curr) =>
        curr.map((r) =>
          String(r.id) === String(id)
            ? {
                ...r,
                ...(patch || {}),
                ...(status ? { status: status[0].toUpperCase() + status.slice(1) } : {}),
              }
            : r
        )
      );
    }
    window.addEventListener("artisan:updated", onUpdated);
    return () => window.removeEventListener("artisan:updated", onUpdated);
  }, []);

  const filtered = useMemo(() => {
    let r = rows;
    if (filter !== "All") r = r.filter((x) => x.status === filter);
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter(
        (x) =>
          x.name.toLowerCase().includes(s) ||
          x.email.toLowerCase().includes(s) ||
          x.phone.includes(s) ||
          x.category.toLowerCase().includes(s) ||
          x.location.toLowerCase().includes(s)
      );
    }
    return r;
  }, [rows, filter, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const go = (n) => setPage(Math.min(totalPages, Math.max(1, n)));

  const windowedPages = useMemo(() => {
    const pages = [];
    const add = (n) => pages.push(n);
    const left = Math.max(1, page - 1);
    const right = Math.min(totalPages, page + 1);

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) add(i);
    } else {
      add(1);
      if (left > 2) add("…");
      for (let i = left; i <= right; i++) add(i);
      if (right < totalPages - 1) add("…");
      add(totalPages);
    }
    return pages;
  }, [page, totalPages]);

  const openDetail = (row) => {
    const id = toArtisanId(row); // unchanged (your current behavior)
    navigate(`/admindashboard/user-mgt/artisans/${id}/profile`, { state: { artisan: row } });
  };

  return (
    <section className="min-w-0">
      {/* Title + controls */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Artisans</h1>
        <p className="text-sm text-gray-500">View and manage artisans</p>
      </div>

      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            id="table-search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search artisans"
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label htmlFor="status-filter" className="sr-only">Filter status</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      {/* List container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* MOBILE/TABLET header (same styling as desktop bar, but 2 cols) */}
        <div className="grid grid-cols-2 border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 lg:hidden">
          <div>Name</div>
          <div className="text-right">Category</div>
        </div>

        {/* DESKTOP header (lg+, full columns) */}
        <div className="hidden lg:grid grid-cols-12 border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone number</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Location</div>
          <div className="col-span-1">Status</div>
        </div>

        <ul className="divide-y">
          {current.map((r) => (
            <li
              key={r.id}
              className="
                grid cursor-pointer items-center px-4 py-3 hover:bg-gray-50
                grid-cols-2 gap-x-3
                lg:grid-cols-12 lg:gap-x-0
              "
              onClick={() => openDetail(r)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetail(r);
                }
              }}
              title={`Open ${r.name} profile`}
            >
              {/* Name + avatar (always) */}
              <div className="col-span-1 flex items-center gap-3 lg:col-span-3">
                <img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="truncate text-sm font-medium text-gray-900">{r.name}</span>
              </div>

              {/* Category on mobile+tablet (right side, matches header) */}
              <div className="col-span-1 justify-self-end text-sm text-gray-700 lg:hidden">
                {r.category}
              </div>

              {/* Desktop-only columns (lg+) */}
              <div className="hidden lg:block lg:col-span-3 truncate text-sm text-indigo-600 underline">
                {r.email}
              </div>
              <div className="hidden lg:block lg:col-span-2 text-sm text-gray-700">
                {r.phone}
              </div>
              <div className="hidden lg:block lg:col-span-2 text-sm text-gray-700">
                {r.category}
              </div>
              <div className="hidden lg:block lg:col-span-1 text-sm text-gray-700">
                {r.location}
              </div>
              <div className="hidden lg:block lg:col-span-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </li>
          ))}

          {current.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-gray-500">No artisans found.</li>
          )}
        </ul>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => go(page - 1)}
          className="h-8 w-8 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50"
          aria-label="Previous page"
        >
          ←
        </button>

        {windowedPages.map((n, i) =>
          n === "…" ? (
            <span key={`dots-${i}`} className="px-2 text-gray-500 select-none">…</span>
          ) : (
            <button
              key={n}
              onClick={() => go(n)}
              className={`h-8 w-8 rounded-md border text-sm ${
                page === n
                  ? "border-indigo-700 bg-indigo-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-current={page === n ? "page" : undefined}
            >
              {n}
            </button>
          )
        )}

        <button
          onClick={() => go(page + 1)}
          className="h-8 w-8 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </section>
  );
}
