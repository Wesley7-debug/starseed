"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { User, Palette, Save, Settings, Sun, Moon, Check } from "lucide-react";
import PageHeader from "@/components/reusable/PageHeader";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userRole = session?.user?.role ?? "user";
  const prefix =
    userRole === "admin" ? "ADM" : userRole === "teacher" ? "TDH" : "STU";

  const [name, setName] = useState(userName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1500px] flex flex-col gap-6 p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and configuration"
        icon={<Settings className="size-5" />}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="ax-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[var(--ax-purple-soft)] text-[var(--ax-purple)]">
                <User className="size-5" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--ax-text)]">
                  Profile
                </h2>
                <p className="text-xs text-[var(--ax-muted)]">
                  Your personal information
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--ax-text)]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[var(--ax-border)] bg-[var(--ax-surface-soft)] px-4 py-2.5 text-sm text-[var(--ax-text)] outline-none transition-colors focus:border-[var(--ax-purple)] focus:ring-2 focus:ring-[var(--ax-purple)]/10"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--ax-text)]">
                  Role
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="text"
                    value={userRole}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-[var(--ax-border)] bg-[var(--ax-surface-soft)] px-4 py-2.5 text-sm text-[var(--ax-muted)]"
                  />
                  <span className="inline-flex shrink-0 items-center rounded-full bg-[var(--ax-purple-soft)] px-2.5 py-1 text-[11px] font-bold tracking-wider text-[var(--ax-purple)]">
                    {prefix}-
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Theme */}
          <ThemeSwitcher />

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ax-purple)] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          >
            <Save className="size-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Theme Switcher ─────────────────────────────────────────────────────── */

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="ax-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[var(--ax-purple-soft)] text-[var(--ax-purple)]">
          <Palette className="size-5" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-[var(--ax-text)]">
            Appearance
          </h2>
          <p className="text-xs text-[var(--ax-muted)]">
            Customize your dashboard look
          </p>
        </div>
      </div>

      <p className="mb-3 text-sm font-medium text-[var(--ax-text)]">Theme</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
            !isDark
              ? "border-[var(--ax-purple)] bg-[var(--ax-purple-soft)] text-[var(--ax-purple)] shadow-sm"
              : "border-[var(--ax-border)] bg-[var(--ax-surface)] text-[var(--ax-muted)] hover:border-[var(--ax-purple)]/50"
          }`}
        >
          <Sun className="size-4" />
          Light
          {!isDark && <Check className="ml-auto size-4" />}
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
            isDark
              ? "border-[var(--ax-purple)] bg-[var(--ax-purple-soft)] text-[var(--ax-purple)] shadow-sm"
              : "border-[var(--ax-border)] bg-[var(--ax-surface)] text-[var(--ax-muted)] hover:border-[var(--ax-purple)]/50"
          }`}
        >
          <Moon className="size-4" />
          Dark
          {isDark && <Check className="ml-auto size-4" />}
        </button>
      </div>
    </div>
  );
}
