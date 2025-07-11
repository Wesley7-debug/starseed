"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Register from "@/app/Register/page";
import EditUser from "@/app/EditModal/page";
import DeleteUser from "@/app/DeleteModal/Page";
import { Role } from "@/app/models/User";
import { useDebounce } from "@/app/hooks/Usedebounce";


type ClassId =
  | `primary-${1 | 2 | 3 | 4 | 5 | 6}`
  | `jss${1 | 2 | 3}`
  | `ss${1 | 2 | 3}`;

interface User {
  _id: string;
  name: string;
  classId: string;
  role: Role;
  RegNo?: string;
}

const classIds: ClassId[] = [
  "primary-1",
  "primary-2",
  "primary-3",
  "primary-4",
  "primary-5",
  "primary-6",
  "jss1",
  "jss2",
  "jss3",
  "ss1",
  "ss2",
  "ss3",
];

export default function AdminStu() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("role", "student");
        if (selectedClassId) params.append("classId", selectedClassId);
        if (debouncedSearchQuery)
          params.append("name", debouncedSearchQuery);

        const res = await fetch(`/api/user/?${params.toString()}`);
        const { data} = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
       
      }
    };

    fetchStudents();
  }, [selectedClassId, debouncedSearchQuery, refreshTrigger]);

  const refreshStudent = () => setRefreshTrigger(prev => prev + 1);
  return (
    <div className="px-6 py-6 rounded-lg border-2 space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          {/* Class Select */}
          <Select onValueChange={setSelectedClassId} value={selectedClassId}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classIds.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <Input
            placeholder="Search name..."
            className="w-[150px] rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

          <Register onSuccess={refreshStudent} />
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No students found.</TableCell>
            </TableRow>
          ) : (
            students.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.classId}</TableCell>
                <TableCell className="flex gap-4">
                  <EditUser
                    id={user._id}
                    name={user.name}
                    RegNo={user.RegNo ?? ""}
                    classId={user.classId}
                    role={user.role}
                    onSuccess={refreshStudent}
                  />
                                    <DeleteUser
                                      id={user._id}
                                      name={user.name}
                                      onSuccess={refreshStudent}
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
