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
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Search, Filter } from "lucide-react";

import Register from "@/app/Register/page";
import EditUser from "@/app/EditModal/page";
import DeleteUser from "@/app/DeleteModal/Page";
import PromoteButton from "./PromoteStu/PromoteButton";
import DemoteButton from "./Demote/DemteButton";
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
  "primary-1", "primary-2", "primary-3", "primary-4", "primary-5", "primary-6",
  "jss1", "jss2", "jss3", "ss1", "ss2", "ss3",
];

export default function AdminStu() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("role", "student");
        if (selectedClassId) params.append("classId", selectedClassId);
        if (debouncedSearchQuery) params.append("name", debouncedSearchQuery);

        const res = await fetch(`/api/user/?${params.toString()}`);
        const { data } = await res.json();
        setStudents(data);
        setSelectedIds([]);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClassId, debouncedSearchQuery, refreshTrigger]);

  const refreshStudent = () => setRefreshTrigger((prev) => prev + 1);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s._id));
    }
  };

  return (
    <div className="w-full px-6 py-6 rounded-lg space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/Admin/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem >
          <BreadcrumbLink href="/Admin/AdminStu">Students</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Class Select with Icon */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-[150px] rounded-md">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classIds.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search with Icon */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 w-[200px] rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <PromoteButton selectedIds={selectedIds} students={students} onSuccess={refreshStudent} />
          <DemoteButton selectedIds={selectedIds} students={students} onSuccess={refreshStudent} />
          <Register onSuccess={refreshStudent} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                aria-label="checkboxes"
                  type="checkbox"
                  checked={selectedIds.length === students.length && students.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No students found.</TableCell>
              </TableRow>
            ) : (
              students.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <input
                    aria-label="checkboxes"
                      type="checkbox"
                      checked={selectedIds.includes(user._id)}
                      onChange={() => toggleSelect(user._id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.classId}</TableCell>
                  <TableCell className="flex gap-2">
                    <EditUser
                      id={user._id}
                      name={user.name}
                      RegNo={user.RegNo ?? ""}
                      classId={user.classId}
                      role={user.role}
                      onSuccess={refreshStudent}
                    />
                    <DeleteUser id={user._id} name={user.name} onSuccess={refreshStudent} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
