import {
  GraduationCap,
  LayoutDashboard,
  LogOutIcon,
  LucideChevronsUpDown,
  User2,
  Inbox,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
//import { signOut } from "next-auth/react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};



const topNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/Teacher",
    icon: LayoutDashboard,
  },
    {
    title: "Profile",
    url: "/ViewProfile",
    icon: User2,
  },
    {
    title: "Inbox",
    url: "/Inbox",
    icon: Inbox,
  },
    {
    title: "Materials",
    url: "/Message",
    icon: MessageCircle,
  },
   {
    title: "Student",
    url: "/Teacher/TeachStu",
    icon: GraduationCap,
  },
      {
    title: "Courses",
    url: "/Teacher/TeachCourses",
    icon: MessageCircle,
  },



];

export default function TeacherSidebar() {
  return (
    <Sidebar collapsible="icon" className='mt-2'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/Teacher'>
                <Image src='/images/logo.png' width={30} height={30} alt="logo img" />
                <span>Teacher Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {topNav.map((nav) => (
                  <SidebarMenuItem key={nav.title}>
                    <SidebarMenuButton asChild>
                      <a href={nav.url}>
                        <nav.icon className="mr-2 h-5 w-5" />
                        <span>{nav.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

      
      </>

      <SidebarFooter>
   <SidebarMenu>
    <SidebarMenuButton >
      <div className="flex w-full justify-between">
        <div className="flex gap-2">
                <Image src='/images/logo.png' width={30} height={30} alt="logo img" />
                <span>username</span>
        </div>
<DropdownMenu >

  <DropdownMenuTrigger asChild>
<LucideChevronsUpDown/>
  </DropdownMenuTrigger>

  <DropdownMenuContent>

    <DropdownMenuSeparator/>
    <DropdownMenuItem> <User2/> Profile</DropdownMenuItem>
    <DropdownMenuItem> <LogOutIcon/>  Logout</DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
      </div>
              

             



    </SidebarMenuButton>
   </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
