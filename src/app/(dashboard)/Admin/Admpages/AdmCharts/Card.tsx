'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Presentation,
  GraduationCap,
  BarChart3,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

interface User {
  _id: string;
  role: string;
  // other user fields if needed
}

export default function AdminDashboardCard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch users');

        const json = await res.json();
        setUsers(json.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Calculate counts
  const totalUsers = users.length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const studentCount = users.filter(u => u.role === 'student').length;
  //const adminCount = users.filter(u => u.role === 'admin').length;

  // Example growth number — you can replace with real analytics if available
  const growth = '12%';

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Total Users */}
      <Card className="lg:col-span-2 md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-4xl font-bold border border-dashed p-2 w-fit rounded">
            {totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-2">
            <BarChart3 className="w-4 h-4" />
            Analytics up by {growth} this month
          </div>
        </CardContent>
      </Card>

      {/* Teachers */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Presentation className="w-6 h-6 text-green-600" />
          <CardTitle>Teachers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-bold border border-dashed p-2 w-fit rounded">
            {teacherCount.toLocaleString()}
          </div>
          <CardDescription className="border-t pt-1 text-sm">
            Active Educators
          </CardDescription>
        </CardContent>
      </Card>

      {/* Students */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <GraduationCap className="w-6 h-6 text-purple-600" />
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-bold border border-dashed p-2 w-fit rounded">
            {studentCount.toLocaleString()}
          </div>
          <CardDescription className="border-t pt-1 text-sm">
            Enrolled Learners
          </CardDescription>
        </CardContent>
      </Card>



    </div>
  );
}
