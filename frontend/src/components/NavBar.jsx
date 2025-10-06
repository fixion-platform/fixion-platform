import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

function NavBar() {
  return (
    <nav className='flex justify-between items-center w-[95%] mx-auto py-5  border-b-2'>
      <div className='flex gap-2'>
        <SidebarTrigger />
      </div>
      <form className='hidden lg:flex border border-[#C2C2C2] items-center gap-2 p-[10px] rounded-md'>
        <Search />
        <input
          type='text'
          placeholder='Search'
          className='outline-none w-[350px]'
        />
      </form>
      <div className='flex items-center gap-[1rem]'>
        <Bell />
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>JN</AvatarFallback>
        </Avatar>
        Jane Moon
      </div>
    </nav>
  );
}

export default NavBar;
