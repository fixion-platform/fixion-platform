// src/pages/admindashboard/usermgt/clients/ClientsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Base data
const base = [
  { name: "Jane Moon",   email: "janemoon@gmail.com",  phone: "08098989898", location: "Abuja",         status: "Active",  avatar: "https://i.pravatar.cc/64?img=1"  },
  { name: "Obong Emma",  email: "obongem@gmail.com",   phone: "08098989898", location: "Port-harcourt", status: "Active",  avatar: "https://i.pravatar.cc/64?img=11" },
  { name: "Femi Rachel", email: "femir@gmail.com",     phone: "08098989898", location: "Lagos",         status: "Blocked", avatar: "https://i.pravatar.cc/64?img=5"  },
  { name: "Jane Moon",   email: "janemoon@gmail.com",  phone: "08098989898", location: "Abuja",         status: "Inactive",avatar: "https://i.pravatar.cc/64?img=2"  },
  { name: "Obong Emma",  email: "obongem@gmail.com",   phone: "08098989898", location: "Port-harcourt", status: "Active",  avatar: "https://i.pravatar.cc/64?img=12" },
  { name: "Femi Rachel", email: "femir@gmail.com",     phone: "08098989898", location: "Lagos",         status: "Active",  avatar: "https://i.pravatar.cc/64?img=6"  },
];

function makeLargeSeed(count = 150) {
  const rows = [];
  const statuses = ["Active", "Active", "Inactive", "Blocked", "Active", "Active"];
  for (let i = 0; i < count; i++) {
    const b = base[i % base.length];
    rows.push({ id: String(i + 1), ...b, status: statuses[i % statuses.length] });
  }
  return rows;
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [rows, setRows] = useState(() => {
    const cached = localStorage.getItem("fixion:clients");
    return cached ? JSON.parse(cached) : makeLargeSeed(150);
  });

  const syncFromStorage = () => {
    const cached = localStorage.getItem("fixion:clients");
    if (cached) setRows(JSON.parse(cached));
  };

  useEffect(() => {
    localStorage.setItem("fixion:clients", JSON.stringify(rows));
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filter !== "All") list = list.filter((r) => r.status.toLowerCase() === filter.toLowerCase());
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rows, filter, query]);

  // ---- Pagination: 15 rows per page, show 5 page buttons window ----
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const go = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // windowed buttons: groups of 5 (1–5, 6–10, …)
  const WINDOW = 5;
  const windowStart = Math.floor((page - 1) / WINDOW) * WINDOW + 1;
  const windowEnd = Math.min(windowStart + WINDOW - 1, totalPages);
  const pageButtons = [];
  for (let p = windowStart; p <= windowEnd; p++) pageButtons.push(p);

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500">View and manage clients</p>
      </div>

      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="sr-only">Filter</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      {/* Desktop table / Mobile compact list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="hidden grid-cols-12 border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 sm:grid">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone number</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Status</div>
        </div>

        <ul className="divide-y">
          {pageRows.map((row) => (
            <li
              key={row.id}
              onMouseEnter={syncFromStorage}
              onClick={() => navigate(`/admindashboard/user-mgt/clients/${row.id}`)}
              className="grid cursor-pointer items-center px-4 py-3 hover:bg-gray-50 grid-cols-2 gap-x-3 sm:grid-cols-12 sm:gap-x-0"
            >
              <div className="col-span-1 flex items-center gap-3 sm:col-span-3">
                <img src={row.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="truncate text-sm font-medium text-gray-900">{row.name}</span>
              </div>

              <div className="hidden truncate text-sm text-indigo-600 underline sm:block sm:col-span-3">
                {row.email}
              </div>

              <div className="hidden text-sm text-gray-700 md:block sm:col-span-2">{row.phone}</div>

              <div className="hidden text-sm text-gray-700 sm:block sm:col-span-2">{row.location}</div>

              <div className="col-span-1 sm:col-span-2 sm:justify-self-start">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    row.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : row.status === "Blocked"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            </li>
          ))}
          {pageRows.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-gray-500">No clients found.</li>
          )}
        </ul>
      </div>

      {/* Pagination: 5 buttons window */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className={`h-8 w-8 rounded-md border border-gray-200 ${page === 1 ? "text-gray-300" : "text-gray-700 bg-white"}`}
          aria-label="Previous"
        >
          ←
        </button>

        {pageButtons.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            className={`h-8 w-8 rounded-md text-sm border border-gray-200 ${
              p === page ? "bg-indigo-700 text-white" : "bg-white text-gray-700"
            }`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          className={`h-8 w-8 rounded-md border border-gray-200 ${page === totalPages ? "text-gray-300" : "text-gray-700 bg-white"}`}
          aria-label="Next"
        >
          →
        </button>
      </div>
    </div>
  );
}
