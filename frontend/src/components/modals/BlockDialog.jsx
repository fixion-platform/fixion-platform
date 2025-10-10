// BlockDialog.jsx
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { useArtisanContext } from "../../pages/admindashboard/usermgt/artisans/ArtisanContext";

export default function BlockDialog() {
  const { artisan, actions } = useArtisanContext();
  const [search, setSearch] = useSearchParams();
  const cancelRef = useRef(null);

  const close = () =>
    setSearch(prev => {
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

  const confirm = async () => {
    await actions.block();
    window.dispatchEvent(new CustomEvent("artisan:updated", { detail: { id: artisan?.id, status: "blocked" }}));
    setSearch(prev => {
      const p = new URLSearchParams(prev);
      p.set("toast", "blocked");
      p.delete("modal");
      return p;
    }, { replace: true });
  };

  // ---- PORTAL to body so no parent can clip it ----
  return createPortal(
    <>
      {/* full-screen backdrop */}
      <div
        className="fixed inset-0 z-[1000] w-screen h-screen bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={close}
      />
      {/* centered panel (bounded) */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg max-h-[85vh] overflow-auto">
          <div className="text-base font-semibold">Block user</div>
          <p className="mt-1 text-sm text-gray-600">
            You are about to block <span className="font-medium">{artisan?.name}</span> (artisan).
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button ref={cancelRef} onClick={close} className="rounded-full border px-4 py-1.5 text-sm">
              Cancel
            </button>
            <button onClick={confirm} className="rounded-full bg-rose-600 px-4 py-1.5 text-sm text-white">
              Block user
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
