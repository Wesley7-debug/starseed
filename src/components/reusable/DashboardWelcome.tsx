"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const ROLE_PREFIX: Record<string, string> = {
  student: "STU",
  teacher: "TCH",
  admin: "ADM",
};

export default function DashboardWelcome() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "User";
  const role = (session?.user?.role as string) ?? "user";
  const prefix = ROLE_PREFIX[role] || "USR";

  const greeting = getGreeting();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(`welcome-${session?.user?.id}`);
    if (!dismissed && session?.user?.id) {
      toast.success(`${greeting}, ${name}!`, {
        description: `Welcome back to your ${role} dashboard.`,
        duration: 4000,
      });
      sessionStorage.setItem(`welcome-${session.user.id}`, "1");
    }
  }, [session?.user?.id, session?.user?.name, name, role, greeting]);

  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5" style={{ color: "var(--ax-purple)" }} />
        <p className="text-sm" style={{ color: "var(--ax-muted)" }}>
          {greeting}, <span className="font-semibold" style={{ color: "var(--ax-text)" }}>{name}</span>
        </p>
      </div>
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider"
        style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}
      >
        {prefix}-
      </span>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
