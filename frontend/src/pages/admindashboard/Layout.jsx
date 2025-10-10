import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Dashside";

import MenuIcon from "../../assets/icons/menu.svg";
import CollapseIcon from "../../assets/icons/arrow-left.svg";
import ExpandIcon from "../../assets/icons/arrow-right.svg";
import BellIcon from "../../assets/icons/notification.svg";
import SearchIcon from "../../assets/icons/search-normal.svg";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar:collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const topbarRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar:collapsed", String(collapsed));
    } catch {}
  }, [collapsed]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Dynamic CSS variable for sidebar width (minimized when collapsed)
  const sidebarWidth = collapsed ? "64px" : "18rem"; // 64px when minimized, up to ~288px expanded

  return (
    <div className="min-h-[100dvh] bg-gray-50 text-gray-900">
      {/* Center the whole dashboard */}
      <div
        className="mx-auto w-full max-w-[1600px]"
        style={{ ["--sbw"]: sidebarWidth }} // used by the grid below
      >
        {/* SIDE-BY-SIDE GRID: the left track is the sidebar, the right track is the content */}
        <div className="grid md:[grid-template-columns:var(--sbw)_1fr]">
          {/* Desktop Sidebar (in grid flow; width adapts with --sbw; stick on scroll) */}
          <aside className="hidden md:block">
            <div className="h-[100dvh] sticky top-0 overflow-y-auto border-r border-gray-200 bg-white">
              <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={false}
                onClose={() => {}}
              />
            </div>
          </aside>

          {/* Mobile Backdrop */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Mobile Drawer (slides over content on small screens) */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-200 md:hidden ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
              mobileOpen={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
          </aside>

          {/* CONTENT COLUMN */}
          <div className="min-w-0 overflow-x-hidden">
            {/* Topbar (NOT sticky; sits at top of content) */}
            <header
              ref={topbarRef}
              className="border-b border-gray-100 bg-white"
            >
              <div className="flex h-16 items-center gap-3 px-3 md:px-6">
                {/* Mobile: open drawer */}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 md:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <img src={MenuIcon} alt="" className="h-5 w-5" />
                </button>

                <div className="text-sm text-gray-500 shrink-0">Dashboard</div>

                {/* Search */}
                <div className="relative ml-auto flex-1 min-w-0 max-w-[520px]">
                  <input
                    className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <img
                    src={SearchIcon}
                    alt=""
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
                  />
                </div>

                {/* Collapse/Expand (desktop) toggles the sidebar width (64px ↔ 18rem) */}
                <button
                  className="hidden h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 md:flex"
                  onClick={() => setCollapsed((v) => !v)}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <img
                    src={collapsed ? ExpandIcon : CollapseIcon}
                    alt=""
                    className="h-5 w-5"
                  />
                </button>

                {/* Bell + Avatar */}
                <button className="relative hidden rounded-full p-2 hover:bg-gray-100 sm:block">
                  <img src={BellIcon} alt="Notifications" className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 inline-block h-2 w-2 rounded-full bg-red-500" />
                </button>
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                    <img
                      src="https://i.pravatar.cc/100?img=32"
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden text-sm md:block">Jane Moon</div>
                </div>
              </div>
            </header>

            {/* Scrollable page content */}
            <main className="min-w-0 px-4 py-5 md:px-8">
              <div className="mx-auto w-full max-w-[1400px]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
