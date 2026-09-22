"use client";

import {
  GraduationCap,
  LayoutDashboard,
  User2,
  Inbox,
  MessageCircle,
  BookCopy,
  LogOut,
  Settings,
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
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import HandleLogout from "@/components/reusable/Handle-logout";

const topNav = [
  { title: "Dashboard", url: "/Teacher", icon: LayoutDashboard },
  { title: "Students", url: "/Teacher/TeachStu", icon: GraduationCap },
  { title: "Courses", url: "/Teacher/TeachCourses", icon: BookCopy },
  { title: "Materials", url: "/Message", icon: MessageCircle },
  { title: "Inbox", url: "/Inbox", icon: Inbox },
  { title: "Profile", url: "/ViewProfile", icon: User2 },
];

export default function TeacherSidebar() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const fetchUnread = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/materials/Inbox");
      const data = await res.json();
      if (!Array.isArray(data)) {
        setUnreadCount(0);
        return;
      }
      const readIds = (() => {
        if (typeof window === "undefined") return [];
        try {
          const stored = localStorage.getItem(`readMessages_${session.user.id}`);
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      })();
      const unreadMessages = data.filter(
        (msg: { _id: string }) => !readIds.includes(msg._id)
      );
      setUnreadCount(unreadMessages.length);
    } catch {
      setUnreadCount(0);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);
  }, [session?.user?.id, fetchUnread]);

  useEffect(() => {
    if (pathname === "/Inbox") fetchUnread();
  }, [pathname, fetchUnread]);

  useEffect(() => {
    window.addEventListener("messageRead", fetchUnread);
    return () => window.removeEventListener("messageRead", fetchUnread);
  }, [fetchUnread]);

  const isActive = (url: string) =>
    url === "/Teacher" ? pathname === url : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="mt-2">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/images/logo.png"
                  width={28}
                  height={28}
                  alt="logo"
                  className="rounded-lg"
                />
                <span className="text-[15px] font-bold tracking-wide" style={{ color: "var(--ax-text)" }}>
                  Starseed
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="sidebar-scroll">
        <SidebarGroup>
          <SidebarGroupLabel
            className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--ax-faint)" }}
          >
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNav.map((nav) => {
                const isInbox = nav.title === "Inbox";
                return (
                  <SidebarMenuItem key={nav.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(nav.url)}
                      className="rounded-lg px-3 py-2 text-[13px] font-medium transition-all"
                      style={{
                        color: isActive(nav.url) ? "var(--ax-purple)" : "var(--ax-muted)",
                        background: isActive(nav.url) ? "var(--ax-surface-hover)" : "transparent",
                      }}
                    >
                      <Link href={nav.url} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <nav.icon className="h-[18px] w-[18px]" />
                          <span>{nav.title}</span>
                        </div>
                        {isInbox && unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-auto h-5 min-w-5 rounded-full px-1 text-[10px]"
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
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="rounded-lg py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="ax-avatar"
                      style={{ background: "#5d9dec" }}
                    >
                      {session?.user?.name?.charAt(0)?.toUpperCase() ?? "T"}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate text-[13px] font-semibold" style={{ color: "var(--ax-text)" }}>
                        {session?.user?.name ?? "Teacher"}
                      </p>
                      <p className="truncate text-[10px]" style={{ color: "var(--ax-muted)" }}>
                        Teacher
                      </p>
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56" style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)" }}>
                <DropdownMenuItem asChild>
                  <Link href="/ViewProfile" className="flex items-center gap-2" style={{ color: "var(--ax-text)" }}>
                    <User2 className="h-4 w-4" style={{ color: "var(--ax-muted)" }} />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2" style={{ color: "var(--ax-text)" }}>
                    <Settings className="h-4 w-4" style={{ color: "var(--ax-muted)" }} />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ borderColor: "var(--ax-border)" }} />
                <DropdownMenuItem className="flex items-center gap-2" style={{ color: "#ef4444" }}>
                  <LogOut className="h-4 w-4" />
                  <HandleLogout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
