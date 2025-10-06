import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Mail,
  CalendarCheck2,
  HandCoins,
  UserRoundPen,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import FixionLogo from "../assets/fixion-logo.svg";

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "My jobs",
    url: "#",
    icon: BriefcaseBusiness,
  },
  {
    title: "Messages",
    url: "#",
    icon: Mail,
  },
  {
    title: "Schedule",
    url: "#",
    icon: CalendarCheck2,
  },
  {
    title: "Earnings",
    url: "#",
    icon: HandCoins,
  },
  {
    title: "Profile",
    url: "#",
    icon: UserRoundPen,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function SideBar() {
  return (
    <Sidebar collapsible='icon' className='bg-white'>
      <SidebarHeader>
        <img src={FixionLogo} alt='Logo' width={150} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href='#'>
                <span>
                  <HelpCircle />
                </span>
                <p>Support</p>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href='#'>
                <span>
                  <LogOut />
                </span>
                <p>Log Out</p>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default SideBar;
