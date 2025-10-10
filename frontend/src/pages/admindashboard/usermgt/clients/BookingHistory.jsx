// src/pages/admindashboard/usermgt/clients/BookingHistory.jsx
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

/** Mock data across all categories — swap with API later */
function makeBookings(clientId) {
  const n = Number(clientId ?? 1);

  const completed = [
    { service: "Haircut",         artisan: "Obong Emmanuel", date: "July 20, 2025", total: "₦25,500", payment: "Mastercard********1234" },
    { service: "Beard Trim",      artisan: "Obong Emmanuel", date: "July 22, 2025", total: "₦8,000",  payment: "Visa********8842" },
    { service: "Haircut",         artisan: "Obong Emmanuel", date: "Aug 02, 2025",  total: "₦25,500", payment: "Mastercard********1234" },
    { service: "Deluxe Package",  artisan: "Obong Emmanuel", date: "Aug 15, 2025",  total: "₦42,000", payment: "Verve********5521" },
    { service: "Haircut",         artisan: "Obong Emmanuel", date: "Aug 29, 2025",  total: "₦25,500", payment: "Mastercard********1234" },
  ];

  const ongoing = [
    { service: "Home Service – Haircut", artisan: "Obong Emmanuel", date: "Sept 03, 2025", total: "₦30,000", payment: "Mastercard********1234" },
    { service: "Hair Coloring",          artisan: "Obong Emmanuel", date: "Sept 05, 2025", total: "₦35,000", payment: "Visa********8842" },
  ];

  const complaints = [
    { service: "Haircut", artisan: "Obong Emmanuel", date: "Sept 01, 2025", total: "₦25,500", payment: "Mastercard********1234" },
  ];

  if (n % 2 === 0) ongoing.push({ service: "Kids Cut", artisan: "Obong Emmanuel", date: "Sept 06, 2025", total: "₦10,500", payment: "Verve********5521" });
  if (n % 3 === 0) complaints.push({ service: "Beard Trim", artisan: "Obong Emmanuel", date: "Sept 02, 2025", total: "₦8,000",  payment: "Visa********8842" });

  let id = 1;
  return [
    ...completed.map(r  => ({ id: String(id++), ...r, status: "Completed" })),
    ...ongoing.map(r    => ({ id: String(id++), ...r, status: "Ongoing" })),
    ...complaints.map(r => ({ id: String(id++), ...r, status: "Complaints" })),
  ];
}

export default function BookingHistory() {
  const { id } = useParams();
  const allRows = useMemo(() => makeBookings(id), [id]);

  // live counts
  const counts = useMemo(
    () =>
      allRows.reduce(
        (acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        },
        { Completed: 0, Ongoing: 0, Complaints: 0 }
      ),
    [allRows]
  );

  const defaultTab =
    (counts.Completed && "Completed") ||
    (counts.Ongoing && "Ongoing") ||
    (counts.Complaints && "Complaints") ||
    "Completed";

  const [tab, setTab] = useState(defaultTab);
  const rows = useMemo(() => allRows.filter((r) => r.status === tab), [allRows, tab]);

  return (
    <div className="min-w-0">
      <nav className="mb-4 text-xs text-gray-500">
        <Link to="/admindashboard/usermgt/clients" className="hover:underline">User Mgt</Link> <span>›</span>{" "}
        <Link to={`/admindashboard/usermgt/clients/${id}`} className="hover:underline">Client</Link> <span>›</span>{" "}
        <span className="text-gray-600">Booking History</span>
      </nav>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Booking History</h1>
          <p className="text-sm text-gray-500">View client booking history</p>
        </div>

        {/* Mobile & Tablet (≤ lg-1): dropdown */}
        <div className="lg:hidden">
          <label className="sr-only">Status</label>
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="Completed">Completed ({counts.Completed})</option>
            <option value="Ongoing">Ongoing ({counts.Ongoing})</option>
            <option value="Complaints">Complaints ({counts.Complaints})</option>
          </select>
        </div>
      </div>

      {/* Desktop (lg+): tabs */}
      <div className="mb-4 hidden gap-6 border-b lg:flex">
        {[
          { k: "Completed", n: counts.Completed },
          { k: "Ongoing", n: counts.Ongoing },
          { k: "Complaints", n: counts.Complaints },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`-mb-px border-b-2 px-1 pb-2 text-sm ${
              tab === t.k ? "border-gray-900 font-semibold text-gray-900" : "border-transparent text-gray-500"
            }`}
          >
            {t.k} ({t.n})
          </button>
        ))}
      </div>

      {/* Responsive table: 
          - Mobile & Tablet (lg-):  Service | Artisan | Total Price (smaller font, looser spacing)
          - Desktop (lg+): adds Date | Payment type
      */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* header */}
        <div className="grid grid-cols-12 border-b bg-gray-50 px-4 py-3 text-[11px] font-medium text-gray-500 sm:text-xs">
          <div className="col-span-5 md:col-span-5 lg:col-span-3">Service</div>
          <div className="col-span-5 md:col-span-5 lg:col-span-3">Artisan</div>
          <div className="col-span-2 text-right md:col-span-2 lg:col-span-2 lg:text-left">Total Price</div>
          <div className="hidden lg:block lg:col-span-2">Date</div>
          <div className="hidden lg:block lg:col-span-2">Payment type</div>
        </div>

        {rows.length ? (
          <ul className="divide-y">
            {rows.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-12 items-center px-4 py-4 text-[13px] sm:text-sm lg:text-[15px]"
              >
                <div className="col-span-5 truncate text-gray-800 md:col-span-5 lg:col-span-3">
                  {r.service}
                </div>
                <div className="col-span-5 truncate text-gray-700 md:col-span-5 lg:col-span-3">
                  {r.artisan}
                </div>
                <div className="col-span-2 text-right font-medium text-gray-900 md:col-span-2 lg:col-span-2 lg:text-left">
                  {r.total}
                </div>
                <div className="hidden text-gray-700 lg:block lg:col-span-2">{r.date}</div>
                <div className="hidden text-gray-700 lg:block lg:col-span-2">{r.payment}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No bookings in this category.</div>
        )}
      </div>
    </div>
  );
}
