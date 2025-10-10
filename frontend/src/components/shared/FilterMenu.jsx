// src/components/shared/FilterMenu.jsx
import { useId } from "react";

export default function FilterMenu({ value = "All", onChange, options = ["All", "Active", "Pending", "Blocked"] }) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">Filter status</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
