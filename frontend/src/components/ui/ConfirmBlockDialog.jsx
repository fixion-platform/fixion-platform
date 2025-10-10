import { useEffect } from "react";

export default function ConfirmBlockDialog({ open, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-[81] w-[min(92vw,420px)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Block user</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-gray-100">✕</button>
        </div>
        <p className="mb-4 text-sm text-gray-700">
          You are about to block this client.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Block user
          </button>
        </div>
      </div>
    </div>
  );
}
