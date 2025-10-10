// src/components/Dashside.jsx (updated)
// - Hover/Focus use dark blue text (no bg highlight).
// - Pointers show cursor + focus ring.
// - "User Mgt" header row navigates to /user-mgt when clicked.
// - Caret toggles open/close without hijacking navigation.

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, Fragment } from "react";

import LogoIcon from "../assets/images/fixion-log.svg";
import DashboardIcon from "../assets/icons/Component.svg";
import UsersIcon from "../assets/icons/Frame 2147227313.svg";
import BriefcaseIcon from "../assets/icons/Frame 2147227313-1.svg";
import PaymentsIcon from "../assets/icons/Frame 2147227313-2.svg";
import ReviewsIcon from "../assets/icons/Frame 2147227313-3.svg";
import ReportsIcon from "../assets/icons/Frame 2147227313-4.svg";
import MessagesIcon from "../assets/icons/Frame 2147227313-5.svg";
import SettingsIcon from "../assets/icons/Frame 2147227313-6.svg";
import TicketIcon from "../assets/icons/Frame 2147227313-7.svg";
import LogsIcon from "../assets/icons/Frame 2147227313-8.svg";
import CloseIcon from "../assets/icons/add.svg";

const BLUE = "#0b0b5f";

function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

const itemsTop = [
  { type: "link", to: "/admindashboard", label: "Dashboard", icon: DashboardIcon, end: true },
  {
    type: "group",
    base: "/admindashboard/user-mgt",
    label: "User Mgt",
    icon: UsersIcon,
    children: [
      { to: "/admindashboard/user-mgt/artisans", label: "Artisans" },
      { to: "/admindashboard/user-mgt/clients", label: "Clients" },
    ],
  },
  { type: "link", to: "/job-requests", label: "Job requests", icon: BriefcaseIcon },
  { type: "link", to: "/payments", label: "Payments", icon: PaymentsIcon },
  { type: "link", to: "/reviews", label: "Reviews", icon: ReviewsIcon },
  { type: "link", to: "/reports", label: "Reports", icon: ReportsIcon },
  { type: "link", to: "/messages", label: "Messages", icon: MessagesIcon },
  { type: "link", to: "/settings", label: "Settings", icon: SettingsIcon },
];

const itemsBottom = [
  { type: "link", to: "/tickets", label: "Tickets", icon: TicketIcon },
  { type: "link", to: "/system-logs", label: "System Logs", icon: LogsIcon },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, onClose }) {
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!mobileOpen) return;
    closeBtnRef.current?.focus();
    function onKeyDown(e) {
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll(
        'button, a, input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    const node = panelRef.current;
    node?.addEventListener("keydown", onKeyDown);
    return () => node?.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const W = collapsed ? "w-16" : "w-64";

  return (
    <div
      ref={panelRef}
      className={cx(
        "flex h-full flex-col border-r border-gray-100 bg-white sticky top-0",
        W,
        "transition-[width] duration-200 ease-in-out"
      )}
      aria-label="Sidebar navigation"
    >
      {/* Brand */}
      <div className="flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <img src={LogoIcon} alt="" className="h-6 w-6" />
          {!collapsed && (
            <div className="text-lg font-extrabold tracking-tight">
              FIXI<span className="text-[#2D3BFD]">N</span>
            </div>
          )}
        </div>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close menu"
          className={cx("rounded-md p-2 hover:bg-gray-100 md:hidden", mobileOpen ? "block" : "hidden")}
        >
          <img src={CloseIcon} alt="" className="h-5 w-5" />
        </button>
        {collapsed && <div className="md:hidden" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {itemsTop.map((it) => (
          <Fragment key={it.label}>
            {it.type === "link" ? (
              <NavItem item={it} collapsed={collapsed} />
            ) : (
              <NavGroup item={it} collapsed={collapsed} pathname={pathname} />
            )}
          </Fragment>
        ))}

        <div className="my-4 border-t border-gray-100" />

        {itemsBottom.map((it) => (
          <NavItem key={it.label} item={it} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="hidden md:block p-2">
        <button
          onClick={() => setCollapsed?.((v) => !v)}
          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-600 hover:bg-gray-50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
    </div>
  );
}

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cx(
          "group flex items-center gap-3 rounded-xl px-2 py-2 text-[14px] font-medium transition cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          `focus-visible:ring-[${BLUE}]`,
          isActive
            ? `text-[${BLUE}] font-semibold`
            : `text-gray-700 hover:text-[${BLUE}]`
        )
      }
    >
      <img src={item.icon} alt="" className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

function NavGroup({ item, collapsed, pathname }) {
  const navigate = useNavigate();
  const initiallyOpen = pathname.startsWith(item.base);
  const [open, setOpen] = useState(initiallyOpen);
  const groupActive = pathname.startsWith(item.base);

  return (
    <div>
      {/* Entire header row navigates to /user-mgt; caret toggles only */}
      <div
        className={cx(
          "flex items-center justify-between rounded-xl px-2 py-2 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          `focus-visible:ring-[${BLUE}]`,
          groupActive ? `text-[${BLUE}] font-semibold` : "text-gray-700 hover:text-[#0b0b5f]"
        )}
        tabIndex={0}
        onClick={() => navigate(item.base)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(item.base);
          }
        }}
        aria-current={groupActive ? "page" : undefined}
      >
        <div className="flex min-w-0 items-center gap-3">
          <img src={item.icon} alt="" className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate text-[14px] font-medium">{item.label}</span>}
        </div>

        {!collapsed && (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={(e) => {
              e.stopPropagation(); // don’t navigate when toggling
              setOpen((v) => !v);
            }}
            className="ml-2 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ focusRingColor: BLUE }}
          >
            <svg
              className={cx("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0", groupActive ? `text-[${BLUE}]` : "text-gray-600")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Sub-links */}
      {open && !collapsed && (
        <div className="mt-1 space-y-1 pl-8">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              className={({ isActive }) =>
                cx(
                  "block rounded-lg px-2 py-1.5 text-[14px] cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  `focus-visible:ring-[${BLUE}]`,
                  isActive ? `font-semibold text-[${BLUE}]` : `text-gray-600 hover:text-[${BLUE}]`
                )
              }
            >
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
