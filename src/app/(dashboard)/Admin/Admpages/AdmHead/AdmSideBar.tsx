"use client";

import type { ElementType } from "react";
import {
  GraduationCap,
  Users,
  User,
  LayoutDashboard,
  User2,
  MessageCircle,
  LogOut,
  Settings,
  BookOpen,
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
import { useSession } from "next-auth/react";
import HandleLogout from "../../../../../components/reusable/Handle-logout";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  url: string;
  icon: ElementType;
};

const topNav: NavItem[] = [
  { title: "Dashboard", url: "/Admin", icon: LayoutDashboard },
  { title: "Students", url: "/Admin/AdminStu", icon: GraduationCap },
  { title: "Teachers", url: "/Admin/AdminTeach", icon: User },
  { title: "Team", url: "/Admin/AdminTeam", icon: Users },
  { title: "Messages", url: "/Message", icon: MessageCircle },
  { title: "Timetable", url: "/Comming-soon", icon: BookOpen },
  { title: "Profile", url: "/ViewProfile", icon: User2 },
];

export default function AdminSideBar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (url: string) =>
    url === "/Admin" ? pathname === url : pathname.startsWith(url);

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
              {topNav.map((nav) => (
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
                    <Link href={nav.url}>
                      <nav.icon className="h-[18px] w-[18px]" />
                      <span>{nav.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                      style={{ background: "var(--ax-purple)" }}
                    >
                      {session?.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="truncate text-[13px] font-semibold" style={{ color: "var(--ax-text)" }}>
                        {session?.user?.name ?? "Admin"}
                      </p>
                      <p className="truncate text-[10px]" style={{ color: "var(--ax-muted)" }}>
                        Administrator
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
