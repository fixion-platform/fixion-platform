import { useMemo } from "react";
import { useArtisanContext } from "./ArtisanContext";

function ChipVerified() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-gray-300 px-2.5 py-1 text-xs text-gray-800">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-600">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
      Verified
    </span>
  );
}

export default function ArtisanProfile() {
  const { artisan, setSearch } = useArtisanContext();
  const idVerified = artisan?.kyc?.idStatus === "verified";
  const isPending = artisan?.status === "pending";

  const openVerify = () =>
    setSearch(prev => {
      const p = new URLSearchParams(prev);
      p.set("modal", "verify");
      return p;
    }, { replace: true });

  const rows = useMemo(() => ([
    {
      label: "Email",
      value: artisan?.email || "",
      right: <ChipVerified />
    },
    {
      label: "Phone number",
      value: artisan?.phone || "08098989898",
      right: <ChipVerified />
    },
    {
      label: "Location",
      value: artisan?.location || "",
      right: <ChipVerified />
    },
    {
      label: "ID verification",
      value: (
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=160&q=80&auto=format&fit=crop"
            alt="ID thumbnail"
            className="w-20 h-12 rounded object-cover ring-1 ring-gray-200"
          />
          <span>National Identity card</span>
        </div>
      ),
      right: isPending && !idVerified ? (
        <button
          type="button"
          onClick={openVerify}
          className="text-xs rounded-full px-3 py-1 ring-1 ring-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
        >
          Verify
        </button>
      ) : (
        <ChipVerified />
      )
    },
    {
      label: "Category",
      value: artisan?.category || ""
    }
  ]), [artisan, idVerified, isPending]);

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="rounded-2xl bg-gray-100 ring-1 ring-gray-100 px-4 py-3 mb-4">
        <div className="text-base font-semibold">Artisan Information</div>
        <div className="text-sm text-gray-500">Manage artisan profile</div>
      </div>

      <div className="grid gap-4">
        {rows.map((r, idx) => (
          <div key={idx} className="rounded-2xl bg-white ring-1 ring-gray-200 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-semibold">{r.label}</div>
                <div className="mt-1 text-sm text-gray-700 break-words">{r.value}</div>
              </div>
              {r.right}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
