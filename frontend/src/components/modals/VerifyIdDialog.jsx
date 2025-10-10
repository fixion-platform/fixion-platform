import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCtx  from "../../pages/admindashboard/usermgt/artisans/ArtisanContext";

export default function VerifyIdDialog() {
  const { actions } = useContext(ArtisanCtx);
  const [search, setSearch] = useSearchParams();
  const [phase, setPhase] = useState("verifying");
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    let alive = true;
    (async () => {
      try {
        const result = await actions.verifyId();
        if (!alive) return;
        setPhase("done");
        setSearch((prev) => {
          const p = new URLSearchParams(prev);
          p.set("toast", result === "verified" ? "id-verified" : "id-failed");
          p.delete("modal");
          return p;
        }, { replace: true });
      } catch {
        setPhase("done");
        setSearch((prev) => {
          const p = new URLSearchParams(prev);
          p.set("toast", "id-failed");
          p.delete("modal");
          return p;
        }, { replace: true });
      }
    })();
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      alive = false;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () =>
    setSearch((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("modal");
      return p;
    }, { replace: true });

  return (
    <div className="fixed inset-0 z-10" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-200">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold">Verifying ID</h3>
            <button onClick={close} aria-label="Close" className="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <p className="mt-1 text-sm text-gray-600">Verifying identification details. This may take a moment…</p>
          <div className="mt-4 flex items-center justify-center">
            <span className="inline-block w-6 h-6 rounded-full border-[3px] border-gray-400 border-r-transparent animate-spin" />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              ref={cancelRef}
              onClick={close}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useEffect, useRef, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useArtisanContext } from "../../pages/admindashboard/usermgt/artisans/ArtisanContext";

// export default function VerifyIdDialog() {
//   const { actions } = useArtisanContext();
//   const [search, setSearch] = useSearchParams();
//   const [phase, setPhase] = useState("verifying"); // verifying | done
//   const cancelRef = useRef(null);

//   useEffect(() => {
//     cancelRef.current?.focus();
//     let alive = true;
//     (async () => {
//       try {
//         const result = await actions.verifyId();
//         if (!alive) return;
//         setPhase("done");
//         setSearch((prev) => {
//           const p = new URLSearchParams(prev);
//           p.set("toast", result === "verified" ? "id-verified" : "id-failed");
//           p.delete("modal");
//           return p;
//         }, { replace: true });
//       } catch {
//         setPhase("done");
//         setSearch((prev) => {
//           const p = new URLSearchParams(prev);
//           p.set("toast", "id-failed");
//           p.delete("modal");
//           return p;
//         }, { replace: true });
//       }
//     })();
//     return () => { alive = false; };
//   }, [actions, setSearch]);

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="w-[92%] max-w-sm rounded-2xl bg-white p-5 shadow-lg">
//         <div className="text-base font-semibold">Verifying ID</div>
//         <p className="mt-1 text-xs text-gray-600">Verifying identification details. This may take a moment…</p>
//         <div className="mt-4 flex items-center justify-center">
//           <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
//         </div>
//         <button ref={cancelRef} onClick={() => {}} className="sr-only">focus</button>
//       </div>
//     </div>
//   );
// }
