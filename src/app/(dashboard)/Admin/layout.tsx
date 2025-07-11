

import React, { ReactNode, ReactElement } from 'react';
import AdminHeader from './Admpages/AdmHead/Admhead';
import AdminSideBar from './Admpages/AdmHead/AdmSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';


interface DashBoardLayoutProps {
  children: ReactNode;
}

export default async function AdminDashBoardLayout({ children }: DashBoardLayoutProps): Promise<ReactElement> {
 const session = await getServerSession(authOptions);
 if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">You must be logged in to view this page.</p>
      </div>
    );
  }
  if(session?.user?.role !== 'admin') {
    return redirect('/Login');
  }

  return (
 
            <SidebarProvider>
              {/* Suppress hydration warning in case sidebar layout differs on server/client */}
              <div suppressHydrationWarning>
                <AdminSideBar />
              </div>

        <main className="w-full flex-col flex">
          <AdminHeader />
          {children}
        </main>
      </SidebarProvider>
   
  );
}
