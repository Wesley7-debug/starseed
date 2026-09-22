import React from "react";
import AppSidebar from "@/components/reusable/AppSidebar";
import DashboardHeader from "@/components/reusable/DashboardHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

interface SharedLayoutProps {
  children: React.ReactNode;
}

export default async function SharedPagesLayout({
  children,
}: SharedLayoutProps): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/Login");
  }

  const role = (session?.user?.role as "admin" | "teacher" | "student") || "student";
  const userName = session?.user?.name ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userId = session?.user?.id ?? "";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--ax-bg)" }}>
      <AppSidebar role={role} userName={userName} userInitial={userInitial} userId={userId} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
