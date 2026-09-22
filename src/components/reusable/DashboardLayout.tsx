import React from 'react';
import AppSidebar from '@/components/reusable/AppSidebar';
import DashboardHeader from '@/components/reusable/DashboardHeader';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'teacher' | 'student')[];
}

export default async function DashboardLayout({
  children,
  allowedRoles,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/Login');
  }

  const role = session.user?.role as string;
  const userName = session.user?.name ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userId = session.user?.id ?? "";

  if (!allowedRoles.includes(role as 'admin' | 'teacher' | 'student')) {
    redirect('/Login');
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--ax-bg)" }}>
      <AppSidebar role={role as 'admin' | 'teacher' | 'student'} userName={userName} userInitial={userInitial} userId={userId} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
