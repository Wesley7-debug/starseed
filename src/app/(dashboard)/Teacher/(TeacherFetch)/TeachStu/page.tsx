'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import EditUser from "@/components/reusable/EditModal";
import Register from "@/components/reusable/Register";

export default function AdminStu() {
 const { data: session } = useSession();
  const teacherClassId = session?.user.classId;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users when teacherClassId becomes available
  useEffect(() => {
    if (!teacherClassId) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/user?classId=${teacherClassId}&role=student`
        );
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [teacherClassId]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const noStudents = !loading && users.length === 0;
  const noMatches = users.length > 0 && filteredUsers.length === 0;

  if (loading || !teacherClassId) {
    return <div className="p-6 text-gray-500">Loading students...</div>;
  }

  return (
    <div className="px-6 py-6 rounded-lg border-2 space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search name..."
            className="w-[150px] rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Register />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noStudents ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No students assigned to you.
              </TableCell>
            </TableRow>
          ) : noMatches ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No matching students.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.classId}</TableCell>
                <TableCell>
                  <div className="flex gap-10">
                    <EditUser
                      id={user.id}
                      name={user.name ?? ""}
                      RegNo={user.RegNo ?? ""}
                      classId={user.classId ?? ""}
                      role={user.role ?? ""}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
