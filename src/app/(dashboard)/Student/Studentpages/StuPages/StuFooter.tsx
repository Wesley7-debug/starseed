'use client';

//import { useState, useEffect } from 'react';
import {
  Users,
  Presentation,


} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';


export default function StuFooter() {

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         setLoading(true);
//         const res = await fetch('/api/user');
//         if (!res.ok) throw new Error('Failed to fetch users');

//         const json = await res.json();
//         setUsers(json.data || []);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchUsers();
//   }, []);

//   // Calculate counts
//   const totalUsers = users.length;
//   const teacherCount = users.filter(u => u.role === 'teacher').length;
//   const studentCount = users.filter(u => u.role === 'student').length;
//   //const adminCount = users.filter(u => u.role === 'admin').length;

//   // Example growth number — you can replace with real analytics if available
//   const growth = '12%';

//   if (loading) {
//     return <div className="text-center py-10">Loading dashboard data...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-600 py-10">Error: {error}</div>;
//   }

  return (
    <div className="w-full max-w-screen  px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">



      {/* Teachers */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Presentation className="w-6 h-6 text-green-600" />
          <CardTitle>courses Offered</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-bold border border-dashed p-2 w-fit rounded">
            12
          </div>
          <CardDescription className="border-t pt-1 text-sm">
            Active Courses
          </CardDescription>
        </CardContent>
      </Card>

    

      {/* Total Users */}
      <Card className="lg:col-span-3 md:col-span-2">
        <CardHeader className="flex flex-row items-start gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-4xl font-bold border border-dashed p-2 w-fit rounded">
           54
          </div>

        </CardContent>
      </Card>


    </div>
  );
}
