"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebarStore } from "@/store/sidebar-store";
import { Menu } from "lucide-react";

export default function DashboardHeader() {
  const { setMobileOpen } = useSidebarStore();

  return (
    <header
      className="sticky top-0 z-30 flex items-center border-b backdrop-blur-md px-4 py-3 sm:px-6 lg:hidden"
      style={{ borderColor: "color-mix(in srgb, var(--ax-border) 60%, transparent)", background: "color-mix(in srgb, var(--ax-surface) 80%, transparent)" }}
    >
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-3"
        aria-label="Open menu"
      >
        <div
          className="grid size-9 place-items-center rounded-xl transition-colors"
          style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ax-purple)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ax-purple-soft)"; e.currentTarget.style.color = "var(--ax-purple)"; }}
        >
          <Menu className="size-5" />
        </div>
      </button>

      <Link href="/" className="ml-3 flex items-center gap-2.5">
        <Image src="/images/logo.png" alt="StarSeed" width={28} height={28} className="size-7 object-contain" />
        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--ax-text)" }}>
          StarSeed
        </span>
      </Link>
    </header>
  );
}
