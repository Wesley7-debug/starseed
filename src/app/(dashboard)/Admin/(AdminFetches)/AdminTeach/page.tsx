'use client';
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import Register from "@/app/Register/page";
import EditUser from "@/app/EditModal/page";
import DeleteUser from "@/app/DeleteModal/Page";
import { useDebounce } from "@/app/hooks/Usedebounce";

interface Teacher {
  _id: string;
  name: string;
  RegNo: string;
  classId: string;
  role?: string;
}

export default function AdminTeach() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  // Used to force refresh data after edits or deletes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("role", "teacher"); // Fix: role=teacher, not student
        if (selectedClassId) params.append("classId", selectedClassId);
        if (debouncedSearchQuery) params.append("name", debouncedSearchQuery);

        const res = await fetch(`/api/user/?${params.toString()}`);
        const json = await res.json();
        setTeachers(json.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [selectedClassId, debouncedSearchQuery, refreshTrigger]);

  // Refresh function to be passed down and called on edit/delete success
  const refreshTeachers = () => setRefreshTrigger(prev => prev + 1);

  // Filter logic (optional if you want client side filtering, but you have server-side search already)
  // const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="px-3 py-6 rounded-lg border-2 space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          {/* Search */}
          <Input
            placeholder="Search name..."
            className="w-[150px] rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Register onSuccess={refreshTeachers} />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Reg No</TableHead>
            <TableHead>Class ID</TableHead>
            <TableHead>Actions</TableHead> {/* New column */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : teachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No teachers found.
              </TableCell>
            </TableRow>
          ) : (
            teachers.map((teacher, index) => (
              <TableRow key={teacher._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.RegNo}</TableCell>
                <TableCell>{teacher.classId}</TableCell>
                <TableCell className="flex gap-4">
                  <EditUser
                    id={teacher._id}
                    name={teacher.name}
                    RegNo={teacher.RegNo}
                    classId={teacher.classId}
                    role={teacher.role ?? ""}
                    onSuccess={refreshTeachers}
                  />
                  <DeleteUser
                    id={teacher._id}
                    name={teacher.name}
                    onSuccess={refreshTeachers}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
