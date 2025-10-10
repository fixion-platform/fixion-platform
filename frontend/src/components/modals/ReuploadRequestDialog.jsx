// import { useEffect, useRef } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useArtisanContext } from "../../pages/admindashboard/usermgt/artisans/ArtisanContext.js";

// export default function ReuploadRequestDialog() {
//   const { actions } = useArtisanContext();
//   const [search, setSearch] = useSearchParams();
//   const cancelRef = useRef(null);

//   useEffect(() => {
//     cancelRef.current?.focus();
//     const onKey = (e) => e.key === "Escape" && close();
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, []);

//   const close = () =>
//     setSearch((prev) => {
//       const p = new URLSearchParams(prev);
//       p.delete("modal");
//       return p;
//     }, { replace: true });

//   const send = async () => {
//     await actions.requestReupload();
//     setSearch((prev) => {
//       const p = new URLSearchParams(prev);
//       p.delete("modal");
//       p.set("toast", "reupload-sent");
//       return p;
//     }, { replace: true });
//   };

//   return (
//     <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
//       <div className="absolute inset-0 bg-black/40" onClick={close} />
//       <div className="absolute inset-0 flex items-center justify-center p-4">
//         <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-200">
//           <div className="flex items-start justify-between">
//             <h3 className="text-sm font-semibold">Send notification</h3>
//             <button onClick={close} aria-label="Close" className="text-gray-500">×</button>
//           </div>
//           <p className="mt-2 text-sm text-gray-600">You are sending a request to reupload a valid ID.</p>
//           <div className="mt-4 flex justify-end gap-2">
//             <button
//               ref={cancelRef}
//               onClick={close}
//               className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={send}
//               className="rounded-full bg-indigo-900 text-white px-3 py-1.5 text-sm"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useArtisanContext } from "../../pages/admindashboard/usermgt/artisans/ArtisanContext";

export default function ReuploadRequestDialog() {
  const { actions } = useArtisanContext();
  const [search, setSearch] = useSearchParams();
  const cancelRef = useRef(null);

  const close = () =>
    setSearch((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("modal");
      return p;
    }, { replace: true });

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const send = async () => {
    await actions.requestReupload();
    setSearch((prev) => {
      const p = new URLSearchParams(prev);
      p.set("toast", "reupload-sent");
      p.delete("modal");
      return p;
    }, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[10] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[92%] max-w-sm rounded-2xl bg-white p-5 shadow-lg">
        <div className="text-base font-semibold">Send notification</div>
        <p className="mt-1 text-sm text-gray-600">
          You are sending a request to reupload a valid ID.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button ref={cancelRef} onClick={close} className="rounded-full border px-4 py-1.5 text-sm">
            Cancel
          </button>
          <button onClick={send} className="rounded-full bg-indigo-900 px-4 py-1.5 text-sm text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
