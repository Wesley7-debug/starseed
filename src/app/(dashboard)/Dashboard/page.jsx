import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function Dashboard(){
     const session = await getServerSession(authOptions);
     if (!session) {
         return redirect('/Login');
     }

            {/* Redirect based on user role */}
        if (session?.user?.role === 'admin') {
            return redirect('/Admin');
            } 
            if (session?.user?.role === 'teacher') {
            return redirect('/Teacher');
            } 
            if (session?.user?.role === 'student') {
                return redirect('/Student');
            }

     return redirect('/Login');
}