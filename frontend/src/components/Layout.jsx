import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { SidebarProvider } from "./ui/sidebar";

function Layout({ children }) {
  return (
    <SidebarProvider className=' min-h-screen grid grid-cols-1 md:grid-cols-[auto_1fr] w-[100%]'>
      <SideBar />
      <div>
        <NavBar />
        <main className='w-[95%] mx-auto min-h-screen'>{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
