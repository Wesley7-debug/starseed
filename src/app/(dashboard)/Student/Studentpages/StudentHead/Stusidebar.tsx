"use client";

import {
  LayoutDashboard,
  LogOutIcon,
  LucideChevronsUpDown,
  User2,
  Inbox,
  BookCopyIcon,
  BookOpen,
  BookUserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

const topNav: NavItem[] = [
  {
    title: "Dashboard",
    url: "/Student",
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
    title: "Courses",
    url: "/",
    icon: BookCopyIcon,
  },
  {
    title: "TimeTable",
    url: "/",
    icon: BookOpen,
  },
  {
    title: "Grades",
    url: "/",
    icon: BookUserIcon,
  },
];

export default function StuSidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread inbox messages count
    fetch("/api/inbox/unread-count")
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count || 0));
  }, []);

  return (
    <Sidebar collapsible="icon" className="mt-2">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/Teacher">
                <Image
                  src="/images/logo.png"
                  width={30}
                  height={30}
                  alt="logo img"
                />
                <span>Student Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNav.map((nav) => {
                const isInbox = nav.title === "Inbox";

                return (
                  <SidebarMenuItem key={nav.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={nav.url}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                          <nav.icon className="h-5 w-5" />
                          <span>{nav.title}</span>
                        </div>
                        {isInbox && unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="text-xs rounded-full px-1.5 py-0.5"
                          >
                            {unreadCount}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton>
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
    <DropdownMenuItem> <User2/> Switch Profile</DropdownMenuItem>
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
