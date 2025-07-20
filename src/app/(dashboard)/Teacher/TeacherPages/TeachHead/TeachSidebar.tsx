"use client";

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
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

const topNav: NavItem[] = [
  { title: "Dashboard", url: "/Teacher", icon: LayoutDashboard },
  { title: "Profile", url: "/ViewProfile", icon: User2 },
  { title: "Inbox", url: "/Inbox", icon: Inbox },
  { title: "Materials", url: "/Message", icon: MessageCircle },
  { title: "Student", url: "/Teacher/TeachStu", icon: GraduationCap },
  { title: "Courses", url: "/Teacher/TeachCourses", icon: MessageCircle },
];

export default function TeacherSidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/materials/Inbox");
        const data = await res.json();

        if (!Array.isArray(data)) {
          setUnreadCount(0);
          return;
        }

        // Use a unique key for teacher messages in localStorage
        const readIds = (() => {
          if (typeof window === "undefined") return [];
          try {
            const stored = localStorage.getItem("readMessagesTeacher");
            return stored ? JSON.parse(stored) : [];
          } catch {
            return [];
          }
        })();

        // Filter messages to get unread ones
        const unreadMessages = data.filter(
          (msg: { _id: string }) => !readIds.includes(msg._id)
        );

        setUnreadCount(unreadMessages.length);
      } catch {
        setUnreadCount(0);
      }
    }

    fetchUnread();

    // Optional: Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnread, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar collapsible="icon" className="mt-2">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/Teacher" className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  width={30}
                  height={30}
                  alt="logo img"
                />
                <span>Teacher Dashboard</span>
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
              {topNav.map((nav) => {
                const isInbox = nav.title === "Inbox";
                return (
                  <SidebarMenuItem key={nav.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={nav.url}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                          <nav.icon className="mr-2 h-5 w-5" />
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
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton>
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <Image
                  src="/images/logo.png"
                  width={30}
                  height={30}
                  alt="logo img"
                />
                <span>username</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <LucideChevronsUpDown />
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User2 /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOutIcon /> Logout
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
