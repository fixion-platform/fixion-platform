// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
// } from "./ui/sidebar";
// import {
//   LayoutDashboard,
//   BriefcaseBusiness,
//   Mail,
//   CalendarCheck2,
//   HandCoins,
//   UserRoundPen,
//   Settings,
//   HelpCircle,
//   LogOut,
// } from "lucide-react";
// import FixionLogo from "../assets/fixion-logo.svg";

// const items = [
//   {
//     title: "Dashboard",
//     url: "#",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "My jobs",
//     url: "#",
//     icon: BriefcaseBusiness,
//   },
//   {
//     title: "Messages",
//     url: "#",
//     icon: Mail,
//   },
//   {
//     title: "Schedule",
//     url: "#",
//     icon: CalendarCheck2,
//   },
//   {
//     title: "Earnings",
//     url: "#",
//     icon: HandCoins,
//   },
//   {
//     title: "Profile",
//     url: "#",
//     icon: UserRoundPen,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ];

// function SideBar() {
//   return (
//     <Sidebar collapsible='icon' className='bg-white'>
//       <SidebarHeader>
//         <img src={FixionLogo} alt='Logo' width={150} />
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarMenu>
//           {items.map((item) => (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton asChild>
//                 <a href={item.url}>
//                   <item.icon />
//                   <span>{item.title}</span>
//                 </a>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarContent>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <a href='#'>
//                 <span>
//                   <HelpCircle />
//                 </span>
//                 <p>Support</p>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <a href='#'>
//                 <span>
//                   <LogOut />
//                 </span>
//                 <p>Log Out</p>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// export default SideBar;
import React from "react";
import FixionLogo from "../assets/fixion-logo.svg";
import arrowLeft from "../assets/icons/arrow-left.svg";
import arrowRight from "../assets/icons/arrow-right.svg";

import dashboardIcon from "../assets/icons/element-4.svg";
import briefcaseIcon from "../assets/icons/briefcase 2.svg";
import messageIcon from "../assets/icons/sms.svg";
import calendarIcon from "../assets/icons/menu-board.svg";
import earningsIcon from "../assets/icons/coin.svg";
import profileIcon from "../assets/icons/user.svg";
import settingsIcon from "../assets/icons/setting-2.svg";
import helpIcon from "../assets/icons/message-question.svg";
import logoutIcon from "../assets/icons/logout.svg";

function SideBar({ isMinimized, setIsMinimized }) {
  const menuItems = [
    { title: "Dashboard", icon: dashboardIcon, path: "#" },
    { title: "My Jobs", icon: briefcaseIcon, path: "#" },
    { title: "Messages", icon: messageIcon, path: "#" },
    { title: "Schedule", icon: calendarIcon, path: "#" },
    { title: "Earnings", icon: earningsIcon, path: "#" },
    { title: "Profile", icon: profileIcon, path: "#" },
    { title: "Settings", icon: settingsIcon, path: "#" },
  ];

  return (
    <aside
      className={`${
        isMinimized ? "w-20" : "w-64"
      } h-screen bg-white border-r border-gray-100 flex flex-col justify-between transition-all duration-300 fixed left-0 top-0`}
    >
      {/* Top Section */}
      <div>
        <div className="flex items-center justify-between p-6">
          {!isMinimized && <img src={FixionLogo} alt="Fixion Logo" className="w-28" />}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <img
              src={isMinimized ? arrowRight : arrowLeft}
              alt="toggle sidebar"
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${
                    isMinimized ? "justify-center" : ""
                  }`}
                >
                  <img src={item.icon} alt={item.title} className="w-5 h-5" />
                  {!isMinimized && <span className="text-sm font-medium">{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-100">
        <ul>
          <li>
            <a
              href="#"
              className={`flex items-center gap-3 px-2 py-2 text-gray-700 hover:bg-gray-50 transition-colors ${
                isMinimized ? "justify-center" : ""
              }`}
            >
              <img src={helpIcon} alt="Help" className="w-5 h-5" />
              {!isMinimized && <span className="text-sm font-medium">Support</span>}
            </a>
          </li>
          <li className="mt-2">
            <a
              href="#"
              className={`flex items-center gap-3 px-2 py-2 text-gray-700 hover:bg-gray-50 transition-colors ${
                isMinimized ? "justify-center" : ""
              }`}
            >
              <img src={logoutIcon} alt="Logout" className="w-5 h-5" />
              {!isMinimized && <span className="text-sm font-medium">Log Out</span>}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;
