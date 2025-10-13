// import NavBar from "./NavBar";
// import SideBar from "./SideBar";
// import { SidebarProvider } from "./ui/sidebar";

// function Layout({ children }) {
//   return (
//     <SidebarProvider className=' min-h-screen grid grid-cols-1 md:grid-cols-[auto_1fr] w-[100%]'>
//       <SideBar />
//       <div>
//         <NavBar />
//         <main className='w-[95%] mx-auto min-h-screen'>{children}</main>
//       </div>
//     </SidebarProvider>
//   );
// }

// export default Layout;
import React, { useState } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

function Layout({ children }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#FAFAFA]">
      {/* Sidebar */}
      <SideBar isMinimized={isMinimized} setIsMinimized={setIsMinimized} />

      {/* Main Section */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          isMinimized ? "ml-20 w-[calc(100%-5rem)]" : "ml-64 w-[calc(100%-16rem)]"
        }`}
      >
        {/* Fixed Navbar */}
        <div className="fixed top-0 right-0 z-40 bg-white border-b border-gray-100 transition-all duration-300"
          style={{
            left: isMinimized ? "5rem" : "16rem",
            width: isMinimized ? "calc(100% - 5rem)" : "calc(100% - 16rem)",
          }}
        >
          <NavBar />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto mt-[80px] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
