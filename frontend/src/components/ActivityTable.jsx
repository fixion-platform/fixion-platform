export default function ActivityTable({ rows = [] }) {
  const toneToClass = (tone) => {
    switch (tone) {
      case "primary":
        return "text-white bg-[#2D3BFD] hover:bg-[#1C28D9]";
      case "danger":
        return "text-white bg-red-500 hover:bg-red-600";
      default:
        return "text-gray-900 bg-gray-100 hover:bg-gray-200";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white">
      <div className="px-5 pt-5 pb-3 text-[13px] font-semibold text-gray-800">
        Activity Log
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-50">
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Activity</th>
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id} className="bg-white">
                <td className="px-5 py-4">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: r.statusColor }}
                  />
                </td>
                <td className="px-5 py-4 text-gray-800">{r.activity}</td>
                <td className="px-5 py-4 text-gray-600">{r.time}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {r.actions?.map((a, i) => (
                      <button
                        key={i}
                        onClick={a.onClick || (() => {})}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${toneToClass(
                          a.tone
                        )}`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* “Browse full list” link */}
      <div className="px-5 py-3 text-right">
        <button className="text-[13px] font-medium text-[#F59E0B] hover:underline">
          Browse full list
        </button>
      </div>
    </div>
  );
}