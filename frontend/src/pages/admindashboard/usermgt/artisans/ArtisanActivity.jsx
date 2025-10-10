// // // // src/pages/admindashboard/usermgt/artisans/ArtisanActivity.jsx
// // import { useContext } from "react";
// // import { Link } from "react-router-dom";
// // import { ArtisanCtx } from "./ArtisanContext";

// // function RowCard({ title, subtitle, href = "#" }) {
// //   return (
// //     <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4">
// //       <div className="flex items-start justify-between gap-4">
// //         <div>
// //           <div className="text-sm font-semibold text-gray-900">{title}</div>
// //           <div className="text-sm text-gray-500">{subtitle}</div>
// //         </div>
// //         <Link to={href} className="text-sm text-amber-600 hover:underline whitespace-nowrap">
// //           Browse full list
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function ArtisanActivity() {
// //   const { artisan } = useContext(ArtisanCtx);
// //   const hasActivity = !!artisan?.stats?.hasActivity;

// //   return (
// //     <div className="min-w-0">
// //       <div className="rounded-2xl bg-gray-100 ring-1 ring-gray-100 px-4 py-3 mb-4">
// //         <div className="text-base font-semibold text-gray-900">Activity Log</div>
// //         <div className="text-sm text-gray-500">View artisan activity history</div>
// //       </div>

// //       {!hasActivity ? (
// //         <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 text-center text-gray-600">
// //           No activity yet.
// //         </div>
// //       ) : (
// //         <div className="grid gap-3">
// //           <RowCard title="Bookings"          subtitle="12 completed bookings, 2 ongoing" />
// //           <RowCard title="Rejected requests" subtitle="3 service request declined" />
// //           <RowCard title="Complaints"        subtitle="3 complaints filed by 2 clients" />
// //           <RowCard title="Reviews"           subtitle="9 clients reviews, 2 reviews flagged for follow-up" />
// //           <RowCard title="Disputes"          subtitle="1 active dispute" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import { ArtisanCtx } from "./ArtisanContext";

// function RowCard({ title, subtitle, href = "#" }) {
//   return (
//     <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-4">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <div className="text-sm font-semibold text-gray-900">{title}</div>
//           <div className="text-sm text-gray-500">{subtitle}</div>
//         </div>
//         <Link to={href} className="text-sm text-amber-600 hover:underline whitespace-nowrap">
//           Browse full list
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default function ArtisanActivity() {
//   const { artisan } = useContext(ArtisanCtx);
//   const hasActivity = !!artisan?.stats?.hasActivity;

//   return (
//     <div className="min-w-0">
//       <div className="rounded-2xl bg-gray-100 ring-1 ring-gray-100 px-4 py-3 mb-4">
//         <div className="text-base font-semibold text-gray-900">Activity Log</div>
//         <div className="text-sm text-gray-500">View artisan activity history</div>
//       </div>

//       {!hasActivity ? (
//         <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 text-center text-gray-600">
//           No activity yet.
//         </div>
//       ) : (
//         <div className="grid gap-3">
//           <RowCard title="Bookings"          subtitle="12 completed bookings, 2 ongoing" />
//           <RowCard title="Rejected requests" subtitle="3 service request declined" />
//           <RowCard title="Complaints"        subtitle="3 complaints filed by 2 clients" />
//           <RowCard title="Reviews"           subtitle="9 clients reviews, 2 reviews flagged for follow-up" />
//           <RowCard title="Disputes"          subtitle="1 active dispute" />
//         </div>
//       )}
//     </div>
//   );
// }

import { useMemo } from "react";
import { useArtisanContext } from "./ArtisanContext";

export default function ArtisanActivity() {
  const { artisan } = useArtisanContext();
  const s = artisan?.stats || {};

  const rows = useMemo(() => {
    if (!s.hasActivity) return [];
    return [
      {
        title: "Bookings",
        sub: `${s.bookings?.completed ?? 0} completed bookings, ${s.bookings?.ongoing ?? 0} ongoing`,
      },
      { title: "Rejected requests", sub: `${s.rejected ?? 0} service request declined` },
      { title: "Complaints", sub: `${s.complaints ?? 0} complaints filed by ${Math.min(s.complaints ?? 0, 2)} clients` },
      {
        title: "Reviews",
        sub: `${s.reviews?.count ?? 0} clients reviews, ${s.reviews?.flagged ?? 0} reviews flagged for follow-up`,
      },
      { title: "Disputes", sub: `${s.disputes ?? 0} active dispute${(s.disputes ?? 0) === 1 ? "" : "s"}` },
    ];
  }, [s]);

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="rounded-2xl bg-gray-100 ring-1 ring-gray-100 px-4 py-3 mb-4">
        <div className="text-base font-semibold">Activity Log</div>
        <div className="text-sm text-gray-500">View artisan activity history</div>
      </div>

      {s.hasActivity ? (
        <div className="grid gap-4">
          {rows.map((r, idx) => (
            <div key={idx} className="rounded-2xl bg-white ring-1 ring-gray-200 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-600 mt-1">{r.sub}</div>
              </div>
              <button className="text-sm text-amber-600 hover:text-amber-700">Browse full list</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-10 text-center text-gray-500">
          No activity yet.
        </div>
      )}
    </div>
  );
}
