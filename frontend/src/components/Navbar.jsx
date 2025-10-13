// import { Bell, Search } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { SidebarTrigger } from "./ui/sidebar";

// function NavBar() {
//   return (
//     <nav className='flex justify-between items-center w-[95%] mx-auto py-5  border-b-2'>
//       <div className='flex gap-2'>
//         <SidebarTrigger />
//       </div>
//       <form className='hidden lg:flex border border-[#C2C2C2] items-center gap-2 p-[10px] rounded-md'>
//         <Search />
//         <input
//           type='text'
//           placeholder='Search'
//           className='outline-none w-[350px]'
//         />
//       </form>
//       <div className='flex items-center gap-[1rem]'>
//         <Bell />
//         <Avatar>
//           <AvatarImage src='https://github.com/shadcn.png' />
//           <AvatarFallback>JN</AvatarFallback>
//         </Avatar>
//         Jane Moon
//       </div>
//     </nav>
//   );
// }

// export default NavBar;
import { useState } from "react";
import NotificationModal from "./NotificationModal";
import bell from "../assets/icons/notification.svg";
import search from "../assets/icons/search-normal.svg";
import menu from "../assets/icons/menu.svg"; // ⚙️ Add a menu icon to toggle sidebar later
import profilePic from "../assets/image.png"; // You can replace this with a user image

function NavBar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      name: "Richie Bryan",
      message: "sent a new job request",
      time: "10 mins ago",
      date: "Thursday 26, 2025",
      actionText: "View Details",
      phone: "+234 804 567 8901",
      jobTitle: "Studio Wiring Project",
      location: "7 Looney Lane, Aberdeen.",
      description:
        "I need you to wire a small recording/production studio space. The job involves setting up audio, electrical and data cables neatly and professionally — including connecting mixers, speakers, microphones, power outlets, patch panels and network points. You must ensure clean signal flow, proper labeling, cable management (trunking/ties), and a tidy finish. Experience with studio or audiovisual installations is required.",
      rating: 3,
      unread: true,
    },
    {
      name: "Mercy Lee",
      message: "sent you a message",
      time: "10 mins ago",
      date: "Thursday 26, 2025",
      actionText: "View Message",
      phone: "+234 804 567 8902",
      unread: true,
    },
    {
      name: "Kelvin",
      message: "sent a new job request",
      time: "21 mins ago",
      date: "Thursday 26, 2025",
      actionText: "View Details",
      phone: "+234 804 567 8903",
      unread: false,
    },
  ]);

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleCloseNotifications = () => {
    setIsNotificationOpen(false);
  };

  const handleMarkAllRead = (updatedNotifications) => {
    setNotifications(updatedNotifications);
  };

  return (
    <nav className="flex justify-between items-center w-[95%] mx-auto py-5 border-b-2 relative bg-white">
      {/* Left section with menu + title */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button for mobile */}
        <button
          className="block md:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle Sidebar"
        >
          <img src={menu} alt="Menu" className="w-[20px] h-[20px]" />
        </button>

        <h1 className="font-poppins text-[24px] font-semibold leading-[36px] text-[#1A1A1A]">
          Dashboard
        </h1>
      </div>

      {/* Search bar (center, visible on larger screens) */}
      <form className="hidden lg:flex border border-[#C2C2C2] items-center gap-2 p-[10px] rounded-md">
        <img src={search} alt="Search" className="w-[16px] h-[16px]" />
        <input
          type="text"
          placeholder="Search"
          className="outline-none w-[350px]"
        />
      </form>

      {/* Right section with notifications and profile */}
      <div className="flex items-center gap-[1rem]">
        {/* Notification icon */}
        <div className="relative">
          <img
            src={bell}
            alt="Notifications"
            className="w-[24px] h-[24px] cursor-pointer hover:opacity-75 transition-opacity"
            onClick={toggleNotifications}
          />

          {/* Unread count badge */}
          {notifications.filter((n) => n.unread).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#050150] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter((n) => n.unread).length}
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="w-[36px] h-[36px] rounded-full overflow-hidden border border-gray-300">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <span className="font-medium text-gray-800">Jane Moon</span>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        open={isNotificationOpen}
        onClose={handleCloseNotifications}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </nav>
  );
}

export default NavBar;
