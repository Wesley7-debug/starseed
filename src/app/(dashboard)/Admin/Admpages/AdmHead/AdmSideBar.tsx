'use client';
import {
  GraduationCap,
  Users,
  User,
  LayoutDashboard,
  
  LogOutIcon,
  LucideChevronsUpDown,
  User2,
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
import {  useSession } from "next-auth/react";
import HandleLogout from "../../../../../components/reusable/Handle-logout";

type NavItem = {
  title: string;
  url: string;
  // eslint-disable-next-line no-undef
  icon: React.ElementType;
};



const topNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/Admin",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/ViewProfile",
    icon: User2,
  },
    {
    title: "Messages",
    url: "/Message",
    icon: MessageCircle,
  },
    {
    title: "Student",
    url: "/Admin/AdminStu",
    icon: GraduationCap,
  },
  {
    title: "Teacher",
    url: "/Admin/AdminTeach",
    icon: User,
  },
  {
    title: "Team",
    url: "/Admin/AdminTeam",
    icon: Users,
  },

];


export default function AdminSideBar() {


const {data: session} = useSession();
  return (
    <Sidebar collapsible="icon" className='mt-2'>
      <SidebarHeader>
            <SidebarMenu >
              <SidebarMenuItem >
                <SidebarMenuButton asChild>
                <Link href='/'>
                <Image src='/images/logo.png' width={30} height={30} alt="logo img"/>
                 <span >Admin Dashboard</span>
                </Link>
                </SidebarMenuButton>

              </SidebarMenuItem>
            </SidebarMenu>
    
      </SidebarHeader>

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



      <SidebarFooter>
   <SidebarMenu>
    <SidebarMenuButton >
      <div className="flex w-full justify-between">
        <div className="flex gap-2">
                <Image src='/images/logo.png' width={30} height={30} alt="logo img" />
                <span>{session?.user?.name}</span>
        </div>
<DropdownMenu >

  <DropdownMenuTrigger asChild>
<LucideChevronsUpDown/>
  </DropdownMenuTrigger>

  <DropdownMenuContent>

    <DropdownMenuSeparator/>
    <DropdownMenuItem> <User2/> Profile</DropdownMenuItem>
    <DropdownMenuItem> <LogOutIcon/>  
 <HandleLogout/>
 </DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
      </div>
              

             



    </SidebarMenuButton>
   </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
