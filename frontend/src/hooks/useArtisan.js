// // src/hooks/useArtisan.js
// import { useCallback, useEffect, useState } from "react";
// import {
//   getArtisan,
//   blockArtisan,
//   unblockArtisan,
//   approveArtisan,
//   verifyId,
//   requestIdReupload,
// } from "../api/artisans";

// export function useArtisan(artisanId) {
//   const [artisan, setArtisan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const refresh = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getArtisan(artisanId);
//       setArtisan(data);
//     } catch (e) {
//       setError(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [artisanId]);

//   useEffect(() => {
//     refresh();
//   }, [refresh]);

//   // action wrappers (optimistic)
//   const actions = {
//     async block() {
//       if (!artisan) return;
//       const prev = artisan;
//       setArtisan({ ...artisan, status: "blocked" });
//       try {
//         await blockArtisan(artisan.id);
//       } catch (e) {
//         setArtisan(prev);
//         throw e;
//       }
//     },
//     async unblock() {
//       if (!artisan) return;
//       const prev = artisan;
//       setArtisan({ ...artisan, status: "active" });
//       try {
//         await unblockArtisan(artisan.id);
//       } catch (e) {
//         setArtisan(prev);
//         throw e;
//       }
//     },
//     async approve() {
//       if (!artisan) return;
//       const prev = artisan;
//       setArtisan({ ...artisan, status: "active", kyc: { ...artisan.kyc, idStatus: "verified" } });
//       try {
//         await approveArtisan(artisan.id);
//       } catch (e) {
//         setArtisan(prev);
//         throw e;
//       }
//     },
//     async verifyId(opts) {
//       if (!artisan) return;
//       const prev = artisan;
//       setArtisan({ ...artisan, kyc: { ...artisan.kyc, idStatus: "verifying" } });
//       try {
//         const { kyc } = await verifyId(artisan.id, opts);
//         setArtisan((a) => ({ ...a, kyc }));
//         return kyc.idStatus;
//       } catch (e) {
//         setArtisan(prev);
//         throw e;
//       }
//     },
//     async requestReupload() {
//       if (!artisan) return;
//       const prev = artisan;
//       try {
//         await requestIdReupload(artisan.id);
//         // keep status pending but reset idStatus to unverified
//         setArtisan({ ...prev, kyc: { ...prev.kyc, idStatus: "unverified" } });
//       } catch (e) {
//         setArtisan(prev);
//         throw e;
//       }
//     },
//     setArtisan, // expose for rare manual tweaks
//   };

//   return { artisan, loading, error, refresh, ...actions };
// }
import { useEffect, useMemo, useState, useCallback } from "react";

/**
 * Seeded demo data so screens behave by status:
 * - id "1" = existing ACTIVE artisan with activity (shows Activity + working toggle)
 * - id "2" = PENDING artisan (no activity, needs ID verify -> approve)
 * - id "3" = BLOCKED artisan (no activity, can be unblocked)
 */
const SEED = {
  "1": {
    id: "1",
    name: "Jane Moon",
    email: "janemoon@gmail.com",
    phone: "08098989898",
    category: "Plumbing",
    location: "Abuja",
    status: "active",
    kyc: { idStatus: "verified" },
    stats: {
      hasActivity: true,
      bookings: { completed: 12, ongoing: 2 },
      rejected: 3,
      complaints: 3,
      reviews: { count: 9, flagged: 2 },
      disputes: 1,
    },
  },
  "2": {
    id: "2",
    name: "Femi Rachel",
    email: "femir@gmail.com",
    phone: "08098989898",
    category: "Hairdressing",
    location: "Lagos",
    status: "pending",
    kyc: { idStatus: "unverified" },
    stats: { hasActivity: false },
  },
  "3": {
    id: "3",
    name: "Obong Emma",
    email: "obongem@gmail.com",
    phone: "08098989898",
    category: "Haircut",
    location: "Port-harcourt",
    status: "blocked",
    kyc: { idStatus: "unverified" },
    stats: { hasActivity: false },
  },
};

/**
 * Local in-memory “DB” for the demo.
 * (When you wire APIs, remove this and call your backend.)
 */
let DB = { ...SEED };

export function useArtisan(artisanId) {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  // load
  useEffect(() => {
    setLoading(true);
    setErr(null);
    const timer = setTimeout(() => {
      const a = DB[artisanId];
      if (!a) {
        setErr(new Error("Not found"));
        setArtisan(null);
      } else {
        setArtisan({ ...a });
      }
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [artisanId]);

  const refresh = useCallback(async () => {
    setArtisan(DB[artisanId] ? { ...DB[artisanId] } : null);
  }, [artisanId]);

  const update = useCallback(
    (mutator) => {
      DB[artisanId] = typeof mutator === "function" ? mutator(DB[artisanId]) : mutator;
      setArtisan({ ...DB[artisanId] });
      // Tell the list page to live-update its status chip if it listens
      window.dispatchEvent(new CustomEvent("artisan:updated", {
        detail: { id: artisanId, status: DB[artisanId]?.status }
      }));
    },
    [artisanId]
  );

  // actions
  const block = useCallback(async () => {
    update((prev) => ({ ...prev, status: "blocked" }));
  }, [update]);

  const unblock = useCallback(async () => {
    // Keep hasActivity as-is; a previously active artisan likely had history
    update((prev) => ({ ...prev, status: "active" }));
  }, [update]);

  const approve = useCallback(async () => {
    // When approving from pending -> active, we mark as newly active with no activity yet
    update((prev) => ({
      ...prev,
      status: "active",
      stats: { ...(prev?.stats || {}), hasActivity: false },
      kyc: { ...(prev?.kyc || {}), idStatus: "verified" },
    }));
  }, [update]);

  const verifyId = useCallback(async () => {
    // Deterministic behavior for demo: id "2" verifies successfully, id "3" fails
    const willPass = artisanId !== "3";
    if (willPass) {
      update((prev) => ({ ...prev, kyc: { ...(prev?.kyc || {}), idStatus: "verified" } }));
      return "verified";
    }
    return "failed";
  }, [update, artisanId]);

  const requestReupload = useCallback(async () => {
    // no-op in demo
    return true;
  }, []);

  const value = useMemo(
    () => ({
      artisan,
      loading,
      error,
      refresh,
      block,
      unblock,
      approve,
      verifyId,
      requestReupload,
      setArtisan: (updater) => {
        if (typeof updater === "function") {
          update(updater);
        } else {
          update(updater);
        }
      },
    }),
    [artisan, loading, error, refresh, block, unblock, approve, verifyId, requestReupload, update]
  );

  return value;
}
