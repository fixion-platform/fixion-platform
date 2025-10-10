// src/components/Toast.jsx
import { useEffect, useMemo, useRef, useState } from "react";

export default function Toast({ type, onClose, onAction }) {
  const [open, setOpen] = useState(Boolean(type));
  const timerRef = useRef(null);

  useEffect(() => {
    setOpen(Boolean(type));
    if (type) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, 4000);
    }
    return () => clearTimeout(timerRef.current);
  }, [type, onClose]);

  const content = useMemo(() => {
    switch (type) {
      case "blocked":
        return { text: "You blocked this user.", tone: "red" };
      case "unblocked":
        return { text: "User unblocked.", tone: "green" };
      case "id-verified":
        return { text: "ID verified — You can approve artisan now.", tone: "green" };
      case "id-failed":
        return {
          text: "ID verification unsuccessful",
          tone: "amber",
          action: "Send reupload request",
        };
      case "reupload-sent":
        return { text: "Reupload request sent.", tone: "indigo" };
      case "approved":
        return { text: "Artisan approved.", tone: "indigo" };
      default:
        return null;
    }
  }, [type]);

  if (!open || !content) return null;

  const toneMap = {
    red: "bg-red-600",
    green: "bg-green-600",
    amber: "bg-amber-600",
    indigo: "bg-indigo-700",
  };

  return (
    <div
      className="fixed top-4 right-4 z-40"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`flex items-center gap-3 text-white rounded-xl shadow-lg ${toneMap[content.tone]} px-4 py-3`}>
        <span className="text-sm">{content.text}</span>
        {content.action && (
          <button
            onClick={onAction}
            className="text-sm underline underline-offset-2 decoration-white/70 hover:decoration-white"
          >
            {content.action}
          </button>
        )}
        <button
          onClick={() => {
            setOpen(false);
            onClose?.();
          }}
          aria-label="Close notification"
          className="ml-2/ -mr-1 opacity-90 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
