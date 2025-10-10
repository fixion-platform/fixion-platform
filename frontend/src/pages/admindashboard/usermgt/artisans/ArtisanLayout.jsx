// src/pages/admindashboard/usermgt/artisans/ArtisanLayout.jsx
import { useMemo } from "react";
import {
  Outlet,
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
  generatePath,
} from "react-router-dom";
import { useArtisan } from "../../../../hooks/useArtisan";
import Toast from "../../../../components/Toast";
import BlockDialog from "../../../../components/modals/BlockDialog";
import VerifyIdDialog from "../../../../components/modals/VerifyIdDialog";
import ReuploadRequestDialog from "../../../../components/modals/ReuploadRequestDialog";
import { ArtisanCtx } from "./ArtisanContext";

function StatusBadge({ status }) {
  const map = {
    active: "text-green-600 bg-green-50 ring-green-200",
    pending: "text-amber-700 bg-amber-50 ring-amber-200",
    blocked: "text-rose-700 bg-rose-50 ring-rose-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 capitalize ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

const norm = (s) => (s ?? "").toString().trim().toLowerCase();

export default function ArtisanLayout() {
  const { artisanId } = useParams();
  const [search, setSearch] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Hook data
  const hook = useArtisan(artisanId);
  const {
    artisan: hookArtisan,
    loading,
    error,
    refresh,
    block,
    unblock,
    approve,
    verifyId,
    requestReupload,
    setArtisan,
  } = hook;

  // Row we passed from the table
  const seeded = location.state?.artisan;

  // ✅ Prefer the row you clicked (seed) and normalize status to lowercase,
  // then let user actions (setArtisan) update it later.
  const artisan = useMemo(() => {
    if (!hookArtisan && !seeded) return null;
    const seed = seeded ?? {};
    const api = hookArtisan ?? {};
    const merged = { ...api, ...seed }; // seed wins on conflicts (incl. status)
    merged.status = norm(seed.status ?? api.status);
    // carry any seeded id so list updates target the correct row
    if (seed.id && !merged.id) merged.id = seed.id;
    return merged;
  }, [hookArtisan, seeded]);

  const modal = search.get("modal"); // block | verify | reupload
  const toast = search.get("toast"); // unblocked | id-verified | id-failed | reupload-sent | approved

  const status = artisan?.status; // 'active' | 'pending' | 'blocked' (normalized)
  const idVerified = artisan?.kyc?.idStatus === "verified";

  // Existing actives: default to toggle enabled; newly approved: stats.hasActivity === false → disabled
  const hasActivity =
    status === "active"
      ? (artisan?.stats?.hasActivity ?? true)
      : !!artisan?.stats?.hasActivity;

  const profileUrl = generatePath("/admindashboard/user-mgt/artisans/:artisanId/profile", { artisanId });
  const activityUrl = generatePath("/admindashboard/user-mgt/artisans/:artisanId/activity", { artisanId });

  const openModal = (name) =>
    setSearch((prev) => {
      const p = new URLSearchParams(prev);
      p.set("modal", name);
      return p;
    }, { replace: true });

  const avatarUrl =
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80&auto=format&fit=crop";

  return (
    <ArtisanCtx.Provider
      value={useMemo(
        () => ({
          artisan,
          loading,
          error,
          refresh,
          actions: { block, unblock, approve, verifyId, requestReupload, setArtisan },
          setSearch,
        }),
        [artisan, loading, error, refresh, block, unblock, approve, verifyId, requestReupload, setArtisan, setSearch]
      )}
    >
      <div className="w-full min-h-[100dvh] flex items-center justify-center">
        <div className="w-full max-w-[1240px] xl:max-w-[1360px] px-4 lg:px-6 min-w-0 -translate-y-8 md:-translate-y-10">
          {loading && !artisan ? (
            <div className="py-24 text-center text-gray-500">Loading artisan…</div>
          ) : error ? (
            <div className="py-24 text-center text-rose-600">Failed to load artisan.</div>
          ) : artisan ? (
            <div className="flex flex-col lg:flex-row gap-10 min-w-0">
              {/* LEFT column */}
              <aside className="min-w-0 lg:basis-[320px] lg:flex-none lg:shrink-0">
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <img className="w-20 h-20 rounded-full object-cover" src={avatarUrl} alt={`${artisan.name} avatar`} />
                    <div className="min-w-0">
                      <div className="text-xl lg:text-2xl font-semibold truncate">{artisan.name}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge status={status} />
                        <span className="text-sm text-gray-500">Last signed in 5 mins ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Email row + copy */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm">
                        <span className="font-semibold">Email: </span>
                        <span className="text-gray-700 break-all">{artisan.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(artisan.email)}
                        className="rounded-full border border-gray-300 px-4 py-1 text-xs hover:bg-gray-50 whitespace-nowrap"
                      >
                        copy
                      </button>
                    </div>
                  </div>

                  {/* Primary toggle + actions */}
                  <div className="mt-5 space-y-2">
                    {/* ACTIVE */}
                    {status === "active" && (
                      <>
                        <button
                          type="button"
                          onClick={() => (hasActivity ? navigate(location.pathname.endsWith("/profile") ? activityUrl : profileUrl) : null)}
                          disabled={!hasActivity}
                          className={`w-full rounded-full px-4 py-2 text-sm font-medium ${
                            hasActivity ? "bg-indigo-900 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {location.pathname.endsWith("/profile") ? "View activity" : "Artisan Profile"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openModal("block")}
                          className="w-full rounded-full px-4 py-2 text-sm border border-rose-300 text-rose-600 hover:bg-rose-50"
                        >
                          Block user
                        </button>
                      </>
                    )}

                    {/* BLOCKED */}
                    {status === "blocked" && (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            await (hook.actions?.unblock ?? unblock)();
                            setArtisan?.((prev) => ({ ...prev, status: "active" }));
                            window.dispatchEvent(
                              new CustomEvent("artisan:updated", {
                                detail: { id: artisan?.id ?? artisanId, status: "active" },
                              })
                            );
                            setSearch((prev) => {
                              const p = new URLSearchParams(prev);
                              p.set("toast", "unblocked");
                              p.delete("modal");
                              return p;
                            }, { replace: true });
                          }}
                          className="w-full rounded-full px-4 py-2 text-sm border border-rose-300 text-rose-600 hover:bg-rose-50"
                        >
                          Unblock user
                        </button>
                        <button
                          type="button"
                          disabled
                          className="w-full rounded-full px-4 py-2 text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                          View activity
                        </button>
                      </>
                    )}

                    {/* PENDING */}
                    {status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={artisan?.kyc?.idStatus !== "verified"}
                          onClick={async () => {
                            await (hook.actions?.approve ?? approve)();
                            setArtisan?.((prev) => ({
                              ...prev,
                              status: "active",
                              kyc: { ...(prev?.kyc || {}), idStatus: "verified" },
                              stats: { ...(prev?.stats || {}), hasActivity: false },
                            }));
                            window.dispatchEvent(
                              new CustomEvent("artisan:updated", {
                                detail: { id: artisan?.id ?? artisanId, status: "active", patch: { stats: { hasActivity: false } } },
                              })
                            );
                            setSearch((prev) => {
                              const p = new URLSearchParams(prev);
                              p.set("toast", "approved");
                              return p;
                            }, { replace: true });
                          }}
                          className={`w-full rounded-full px-4 py-2 text-sm ${
                            artisan?.kyc?.idStatus === "verified"
                              ? "bg-indigo-900 text-white"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Approve artisan
                        </button>

                        {artisan?.kyc?.idStatus === "verified" ? (
                          <span className="inline-flex w-full items-center justify-center rounded-full ring-1 ring-green-200 bg-green-50 text-green-700 px-3 py-2 text-xs">
                            ID verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openModal("verify")}
                            className="w-full rounded-full px-4 py-2 text-sm ring-1 ring-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                          >
                            Unverified
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <hr className="my-5 border-gray-200" />
                  <div className="text-xs text-gray-500">
                    Joined: <span className="font-medium">July 1st, 2025</span>
                  </div>
                </div>

                {status === "blocked" && (
                  <div className="mt-4 rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-200 p-3 text-sm">
                    You blocked {artisan.name}. You can unblock user at any time.
                  </div>
                )}
              </aside>

              {/* RIGHT column */}
              <section className="min-w-0 flex-1">
                <Outlet />
              </section>
            </div>
          ) : null}

          {/* Modals */}
          {modal === "block" && <BlockDialog />}
          {modal === "verify" && <VerifyIdDialog />}
          {modal === "reupload" && <ReuploadRequestDialog />}

          {/* Toasts */}
          <Toast
            type={toast}
            onClose={() =>
              setSearch((prev) => {
                const p = new URLSearchParams(prev);
                p.delete("toast");
                return p;
              }, { replace: true })
            }
            onAction={() => {
              setSearch((prev) => {
                const p = new URLSearchParams(prev);
                p.set("modal", "reupload");
                p.delete("toast");
                return p;
              }, { replace: true });
            }}
          />
        </div>
      </div>
    </ArtisanCtx.Provider>
  );
}
