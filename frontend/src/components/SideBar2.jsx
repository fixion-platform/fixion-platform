// Sidebar2.tsx
import { useState } from "react";
import {
  Home,
  MessageSquare,
  Heart,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

// import type { ReactNode } from "react";


// type NavItem = {
//   label: string;
//   icon: ReactNode;
//   active?: boolean;
//   children?: string[];
// };


const Sidebar2 = () => {
  const [openSettings, setOpenSettings] = useState(false);

  const navItems = [
    { label: "Home", icon: <Home size={18} /> },
    { label: "Find Artisans", icon: <Home size={18} />, active: true },
    { label: "Messages", icon: <MessageSquare size={18} /> },
    { label: "Favorites", icon: <Heart size={18} /> },
    { label: "Profile", icon: <User size={18} /> },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      children: ["Account", "Notifications", "Privacy"],
    },
  ];

  return (
    <aside className="w-56 h-screen   flex flex-col justify-between p-4">
      {/* Logo */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-lg text-indigo-900">FIXION</h1>
        <button className="text-gray-600 hover:text-black">⟵</button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        {navItems.map((item, index) => (
          <div key={index}>
            <button
              className={`flex items-center w-full gap-3 px-2 py-2 rounded-md text-sm transition-colors
                ${
                  item.active
                    ? "bg-indigo-900 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() =>
                item.label === "Settings" && setOpenSettings(!openSettings)
              }
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.label === "Settings" && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openSettings ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Dropdown for Settings */}
            {item.label === "Settings" && openSettings && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children?.map((child, i) => (
                  <button
                    key={i}
                    className="block text-gray-600 hover:text-indigo-900 text-sm"
                  >
                    {child}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="space-y-3">
        <button className="flex items-center gap-3 text-gray-700 hover:text-indigo-900 text-sm">
          <HelpCircle size={18} />
          Support
        </button>
        <button className="flex items-center gap-3 text-gray-700 hover:text-red-600 text-sm">
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar2;
