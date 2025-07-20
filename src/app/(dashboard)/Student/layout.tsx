import { SidebarProvider } from "@/components/ui/sidebar";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import StuSidebar from "./Studentpages/StudentHead/Stusidebar";
import StuHeader from "./Studentpages/StudentHead/StuHead";



export default async function StudentLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);
if (!session) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">You must be logged in to view this page.</p>
        </div>
    );
}   
if (session?.user?.role !== 'student') {
    return redirect('/Login');}




    return (
      
        <SidebarProvider>
       <StuSidebar/>
            <main className="flex-1 p-4">
             <StuHeader/>
                {children}
            </main>
        </SidebarProvider>
        

    );
}

