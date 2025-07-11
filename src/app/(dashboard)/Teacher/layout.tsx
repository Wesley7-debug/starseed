import { SidebarProvider } from "@/components/ui/sidebar";
import TeacherSidebar from "./TeacherPages/TeachHead/TeachSidebar";
import TeacherHeader from "./TeacherPages/TeachHead/TeacherHead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";


export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);
if (!session) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">You must be logged in to view this page.</p>
        </div>
    );
}   
if (session?.user?.role !== 'teacher') {
    return redirect('/Login');}

    return (
        <SidebarProvider>
            <TeacherSidebar />
            <main className="flex-1 p-4">
                <TeacherHeader />
                {children}
            </main>
        </SidebarProvider>
    );
}

