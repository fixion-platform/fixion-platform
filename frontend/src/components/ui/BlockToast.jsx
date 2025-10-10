import { useEffect, useState } from "react";

export default function BlockToast({ show, message, onDone }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (!show) return;
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2800);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-[90]">
      <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-lg">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-300 text-red-600">⛔</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <p className="text-xs text-gray-500">You can unblock user at any time</p>
        </div>
      </div>
    </div>
  );
}
