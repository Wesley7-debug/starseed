"use client";

import { memo, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Home,
  PanelLeft,
  Settings,
  Users,
  X,
  GraduationCap,
  User,
  Inbox,
  BookCopy,
  BookUser,
  MessageCircle,
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";
import HandleLogout from "@/components/reusable/Handle-logout";
import useInterval from "@/hooks/useInterval";

export type SidebarRole = "admin" | "student" | "teacher";

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home;
  showBadge?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navByRole: Record<SidebarRole, { overview: NavItem; groups: NavGroup[] }> = {
  admin: {
    overview: { title: "Overview", url: "/Admin", icon: Home },
    groups: [
      { label: "People", items: [
        { title: "Students", url: "/Admin/AdminStu", icon: GraduationCap },
        { title: "Teachers", url: "/Admin/AdminTeach", icon: User },
        { title: "Team", url: "/Admin/AdminTeam", icon: Users },
      ]},
      { label: "Communication", items: [
        { title: "Messages", url: "/Message", icon: MessageCircle },
        { title: "Timetable", url: "/Comming-soon", icon: BookOpen },
      ]},
    ],
  },
  student: {
    overview: { title: "Overview", url: "/Student", icon: Home },
    groups: [
      { label: "Learning", items: [
        { title: "Courses", url: "/Student/StuCourses", icon: BookCopy },
        { title: "Timetable", url: "/Comming-soon", icon: BookOpen },
        { title: "Grades", url: "/Comming-soon", icon: BookUser },
      ]},
      { label: "Communication", items: [
        { title: "Inbox", url: "/Inbox", icon: Inbox, showBadge: true },
      ]},
    ],
  },
  teacher: {
    overview: { title: "Overview", url: "/Teacher", icon: Home },
    groups: [
      { label: "Teaching", items: [
        { title: "Students", url: "/Teacher/TeachStu", icon: GraduationCap },
        { title: "Courses", url: "/Teacher/TeachCourses", icon: BookCopy },
        { title: "Materials", url: "/Message", icon: MessageCircle },
      ]},
      { label: "Communication", items: [
        { title: "Inbox", url: "/Inbox", icon: Inbox, showBadge: true },
      ]},
    ],
  },
};

interface AppSidebarProps {
  role: SidebarRole;
  userName: string;
  userInitial: string;
  userId: string;
}

const SidebarNavItem = memo(function SidebarNavItem({
  navItem,
  compact,
  isActive,
  unreadCount,
}: {
  navItem: NavItem;
  compact: boolean;
  isActive: boolean;
  unreadCount: number;
}) {
  return (
    <Link
      href={navItem.url}
      title={compact ? navItem.title : undefined}
      className="sidebar-nav-item group flex items-center rounded-xl transition-all duration-150"
      data-active={isActive}
    >
      <navItem.icon className="size-[18px] shrink-0 sidebar-nav-icon" data-active={isActive} />
      {!compact && <span className="text-sm">{navItem.title}</span>}
      {!compact && navItem.showBadge && unreadCount > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full sidebar-badge px-1.5 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
});

export default function AppSidebar({ role, userName, userInitial, userId }: AppSidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebarStore();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  const { overview, groups } = navByRole[role];
  const showInboxBadge = role === "student" || role === "teacher";
  const compact = collapsed;

  const isActive = useCallback(
    (href: string) =>
      href === "/Admin" || href === "/Student" || href === "/Teacher"
        ? pathname === href
        : pathname.startsWith(href),
    [pathname]
  );

  const fetchUnread = useCallback(async () => {
    if (!userId || !showInboxBadge) return;
    try {
      const res = await fetch("/api/materials/Inbox");
      const data = await res.json();
      if (!Array.isArray(data)) { setUnreadCount(0); return; }
      const readIds = (() => {
        if (typeof window === "undefined") return [];
        try {
          const stored = localStorage.getItem(`readMessages_${userId}`);
          return stored ? JSON.parse(stored) : [];
        } catch { return []; }
      })();
      setUnreadCount(data.filter((msg: { _id: string }) => !readIds.includes(msg._id)).length);
    } catch { setUnreadCount(0); }
  }, [userId, showInboxBadge]);

  useInterval(fetchUnread, userId && showInboxBadge ? 60_000 : null);

  return (
    <>
      <style>{`
        .sidebar-nav-item {
          padding: 0.625rem 0.75rem;
          gap: 0.75rem;
          color: var(--ax-muted);
        }
        .sidebar-nav-item[data-active="true"] {
          background: var(--ax-purple-soft);
          color: var(--ax-active);
          font-weight: 500;
        }
        .sidebar-nav-item:not([data-active="true"]):hover {
          background: var(--ax-surface-soft);
          color: var(--ax-text);
        }
        .sidebar-nav-icon { color: var(--ax-faint); }
        .sidebar-nav-icon[data-active="true"] { color: var(--ax-purple); }
        .sidebar-nav-item:not([data-active="true"]):hover .sidebar-nav-icon { color: var(--ax-purple); }
        .sidebar-badge { background: var(--ax-purple); }
        .sidebar-footer-btn {
          grid place-items: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          color: var(--ax-faint);
          transition: all 0.15s;
        }
        .sidebar-footer-btn:hover {
          background: var(--ax-purple-soft);
          color: var(--ax-purple);
        }
      `}</style>

      {/* Desktop Sidebar */}
      <div
        className={`relative hidden shrink-0 transition-all duration-300 lg:block ${
          collapsed ? "w-[70px]" : "w-[260px]"
        }`}
      >
        <SidebarContent
          compact={compact}
          overview={overview}
          groups={groups}
          isActive={isActive}
          open={open}
          setOpen={setOpen}
          userName={userName}
          userInitial={userInitial}
          unreadCount={unreadCount}
          onFetchUnread={fetchUnread}
          onSetMobileOpen={setMobileOpen}
        />

        <button
          onClick={toggle}
          className="absolute -right-3 top-5 z-30 grid size-6 place-items-center rounded-full border shadow-md transition sidebar-footer-btn"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className={`size-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[260px] shadow-2xl lg:hidden">
            <SidebarContent
              compact={false}
              overview={overview}
              groups={groups}
              isActive={isActive}
              open={open}
              setOpen={setOpen}
              userName={userName}
              userInitial={userInitial}
              unreadCount={unreadCount}
              onFetchUnread={fetchUnread}
              onSetMobileOpen={setMobileOpen}
              forceOpen
            />
          </aside>
        </>
      )}
    </>
  );
}

const SidebarContent = memo(function SidebarContent({
  compact,
  overview,
  groups,
  isActive,
  open,
  setOpen,
  userName,
  userInitial,
  unreadCount,
  onFetchUnread: _onFetchUnread,
  onSetMobileOpen,
  forceOpen,
}: {
  compact: boolean;
  overview: NavItem;
  groups: NavGroup[];
  isActive: (href: string) => boolean;
  open: Record<string, boolean>;
  setOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  userName: string;
  userInitial: string;
  unreadCount: number;
  onFetchUnread: () => void;
  onSetMobileOpen: (v: boolean) => void;
  forceOpen?: boolean;
}) {
  return (
    <div
      className="flex flex-col border-r h-full"
      style={{
        borderColor: "var(--ax-border)",
        background: "var(--ax-surface)",
        color: "var(--ax-text)",
        width: forceOpen ? "100%" : undefined,
      }}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b ${
          compact ? "justify-center px-2" : "justify-between px-5"
        }`}
        style={{ borderColor: "color-mix(in srgb, var(--ax-border) 60%, transparent)" }}
      >
        <Link href="/" className="flex items-center gap-3" title="Go to homepage">
          <Image src="/images/logo.png" alt="StarSeed" width={36} height={36} className="size-9 object-contain" />
          {!compact && (
            <span className="text-xl font-bold tracking-tight" style={{ color: "var(--ax-text)" }}>
              StarSeed
            </span>
          )}
        </Link>
        {forceOpen && (
          <button onClick={() => onSetMobileOpen(false)} className="sidebar-footer-btn">
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* User */}
      {!compact && (
        <div className="p-3">
          <div
            className="flex w-full items-center rounded-xl border p-2.5"
            style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)" }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{ background: "var(--ax-purple)" }}
              >
                {userInitial}
              </div>
              <span className="truncate text-sm font-medium" style={{ color: "var(--ax-text)" }}>
                {userName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <SidebarNavItem navItem={overview} compact={compact} isActive={isActive(overview.url)} unreadCount={unreadCount} />

        {groups.map((group) => {
          const expanded = open[group.label] ?? true;
          return (
            <div key={group.label} className="pt-4">
              {!compact && (
                <button
                  onClick={() => setOpen((v) => ({ ...v, [group.label]: !expanded }))}
                  className="flex w-full items-center justify-between px-2 pb-1.5"
                  style={{ color: "var(--ax-faint)" }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{group.label}</span>
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`} />
                </button>
              )}
              {(expanded || compact) && (
                <div className="space-y-0.5">
                  {group.items.map((navItem) => (
                    <SidebarNavItem key={navItem.url} navItem={navItem} compact={compact} isActive={isActive(navItem.url)} unreadCount={unreadCount} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="my-3 border-t" style={{ borderColor: "color-mix(in srgb, var(--ax-border) 60%, transparent)" }} />
        <SidebarNavItem navItem={{ title: "Settings", url: "/settings", icon: Settings }} compact={compact} isActive={isActive("/settings")} unreadCount={0} />
      </nav>

      {/* Footer */}
      <div className="border-t p-3" style={{ borderColor: "color-mix(in srgb, var(--ax-border) 60%, transparent)" }}>
        {!compact && (
          <div
            className="flex items-center justify-between rounded-xl p-1 border"
            style={{ background: "var(--ax-surface-soft)", borderColor: "color-mix(in srgb, var(--ax-border) 50%, transparent)" }}
          >
            <Link href="/Inbox" className="sidebar-footer-btn relative" aria-label="Inbox">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full sidebar-badge text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link href="/Comming-soon" className="sidebar-footer-btn" aria-label="Docs">
              <BookOpen className="size-4" />
            </Link>
            <button onClick={() => {}} className="sidebar-footer-btn" aria-label="Log out">
              <HandleLogout />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
