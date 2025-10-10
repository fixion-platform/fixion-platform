// // // src/pages/userMgt/UserMgtLayout.jsx
// // import { Outlet, useLocation } from "react-router-dom";
// // import { useMemo } from "react";

// // export default function UserMgtLayout() {
// //   const { pathname } = useLocation();
// //   const title = useMemo(() => {
// //     if (pathname.includes("/user-mgt/artisans")) return "Artisans";
// //     if (pathname.includes("/user-mgt/clients")) return "Clients";
// //     return "User Mgt";
// //   }, [pathname]);

// //   return (
// //     <div className="min-h-screen w-full bg-gray-50 text-gray-900">
// //       {/* Top bar (not sticky) */}
// //       <header className="border-b bg-white">
// //         <div className="mx-auto w-full max-w-[1200px] px-3 md:px-6 h-14 flex items-center gap-3">
// //           {/* Breadcrumb */}
// //           <nav aria-label="Breadcrumb" className="text-sm">
// //             <ol className="flex items-center gap-2 text-gray-500">
// //               <li>User Mgt</li>
// //               <li aria-hidden="true">›</li>
// //               <li className="font-medium text-gray-900">{title}</li>
// //             </ol>
// //           </nav>

// //           {/* Centered search */}
// //           <div className="mx-auto w-full max-w-md">
// //             <label htmlFor="global-search" className="sr-only">Search</label>
// //             <div className="relative">
// //               <input
// //                 id="global-search"
// //                 type="search"
// //                 placeholder="Search"
// //                 className="w-full rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2 pe-10 text-sm outline-none focus:border-gray-300 focus:bg-white"
// //               />
// //               <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                 <circle cx="11" cy="11" r="8" /><path d="m21 21-3.5-3.5" />
// //               </svg>
// //             </div>
// //           </div>

// //           {/* Avatar */}
// //           <button className="ms-auto inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100" aria-label="Account">
// //             <img src="https://i.pravatar.cc/40?img=1" alt="" className="h-8 w-8 rounded-full object-cover" />
// //             <span className="hidden sm:inline text-sm font-medium text-gray-700">Jane Moon</span>
// //           </button>
// //         </div>
// //       </header>

// //       {/* Main content (sits to the right of your existing Sidebar) */}
// //       <main className="mx-auto w-full max-w-[1200px] px-3 md:px-6 pb-10 min-w-0">
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }
// // src/pages/userMgt/UserMgtLayout.jsx
// // src/pages/userMgt/UserMgtLayout.jsx
// // src/pages/userMgt/UserMgtLayout.jsx
// import { Outlet, useLocation } from "react-router-dom";
// import { useMemo, useState } from "react";
// import Sidebar from "../../../components/Dashside";

// export default function UserMgtLayout() {
//   const { pathname } = useLocation();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const title = useMemo(() => {
//     if (pathname.includes("/admindashboard/user-mgt/artisans")) return "Artisans";
//     if (pathname.includes("/admindashboard/user-mgt/clients")) return "Clients";
//     return "User Mgt";
//   }, [pathname]);

//   return (
//     <div className="min-h-[100dvh] w-full bg-gray-50 text-gray-900 flex justify-center">
//       {/* Centered container */}
//       <div className="flex w-full max-w-[1280px]">
//         {/* Sidebar (desktop) */}
//         <aside className="hidden md:block w-[264px] bg-white">
//           <div className="h-[100dvh] overflow-y-auto">
//             <Sidebar currentPath={pathname} />
//           </div>
//         </aside>

//         {/* Mobile drawer */}
//         {mobileOpen && (
//           <div className="md:hidden fixed inset-0 z-50">
//             <div
//               className="absolute inset-0 bg-black/40"
//               onClick={() => setMobileOpen(false)}
//               aria-hidden="true"
//             />
//             <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
//               <Sidebar currentPath={pathname} onNavigate={() => setMobileOpen(false)} />
//             </div>
//           </div>
//         )}

//         {/* Right column: header + content */}
//         <div className="flex-1 min-w-0 flex flex-col bg-gray-50">
//           {/* Header (non-sticky, no border) */}
//           <header className="bg-white shadow-sm">
//             <div className="mx-auto w-full max-w-[1200px] px-3 md:px-6 h-14 flex items-center gap-3">
//               {/* Mobile menu */}
//               <button
//                 type="button"
//                 onClick={() => setMobileOpen(true)}
//                 className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white"
//                 aria-label="Open menu"
//               >
//                 <svg
//                   className="h-5 w-5 text-gray-700"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>

//               {/* Breadcrumb */}
//               <nav aria-label="Breadcrumb" className="text-sm">
//                 <ol className="flex items-center gap-2 text-gray-500">
//                   <li>User Mgt</li>
//                   <li aria-hidden="true">›</li>
//                   <li className="font-medium text-gray-900">{title}</li>
//                 </ol>
//               </nav>

//               {/* Centered search */}
//               <div className="mx-auto w-full max-w-md">
//                 <label htmlFor="global-search" className="sr-only">
//                   Search
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="global-search"
//                     type="search"
//                     placeholder="Search"
//                     className="w-full rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2 pe-10 text-sm outline-none focus:border-gray-300 focus:bg-white"
//                   />
//                   <svg
//                     className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <circle cx="11" cy="11" r="8" />
//                     <path d="m21 21-3.5-3.5" />
//                   </svg>
//                 </div>
//               </div>

//               {/* Avatar */}
//               <button
//                 className="ms-auto inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100"
//                 aria-label="Account"
//               >
//                 <img
//                   src="https://i.pravatar.cc/40?img=1"
//                   alt="User avatar"
//                   className="h-8 w-8 rounded-full object-cover"
//                 />
//                 <span className="hidden sm:inline text-sm font-medium text-gray-700">
//                   Jane Moon
//                 </span>
//               </button>
//             </div>
//           </header>

//           {/* Scrollable main content */}
//           <main className="flex-1 overflow-y-auto">
//             <div className="mx-auto w-full max-w-[1200px] px-3 md:px-6 pb-10 min-w-0">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/admindashboard/usermgt/UserMgtLayout.jsx
import { Outlet } from "react-router-dom";

export default function UserMgtLayout() {
  // IMPORTANT: no Sidebar, no Navbar, no Layout here.
  return (
    <section className="min-w-0">
      <Outlet />
    </section>
  );
}
