// src/components/shared/SearchInput.jsx
import { useId } from "react";

export default function SearchInput({ value, onChange, placeholder = "Search", ariaLabel }) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{ariaLabel || "Search"}</label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 rounded-full border border-gray-300 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
