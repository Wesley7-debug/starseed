'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Register from "@/app/Register/page";
import DeleteUser from "@/app/DeleteModal/Page";
import { useDebounce } from "@/app/hooks/Usedebounce";
import EditUser from "@/components/reusable/EditModal";

interface Teacher {
  _id: string;
  name: string;
  RegNo: string;
  classId: string;
  role?: string;
}

export default function AdminTeach() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassId] = useState<string | undefined>(undefined);
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("role", "teacher");
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

  const refreshTeachers = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="w-full px-6 py-6 rounded-lg space-y-6">
      {/* Breadcrumb */}
      <div className="w-full px-3 py-4">
          <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/Admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/Admin/AdminTeach">Teachers</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </div>
      {/* Filters + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search bar with icon */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teacher..."
            className="pl-10 w-[200px] rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Register Teacher Button */}
        <Register onSuccess={refreshTeachers} />
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Reg No</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Actions</TableHead>
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
                  <TableCell className="flex gap-2">
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
    </div>
  );
}
