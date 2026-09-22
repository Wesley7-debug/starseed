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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserCheck, ArrowUpDown } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import DeleteUser from "@/components/reusable/DeleteModal";
import { useDebounce } from "@/hooks/Usedebounce";
import EditUser from "@/components/reusable/EditModal";
import Register from "@/components/reusable/Register";
import PageHeader from "@/components/reusable/PageHeader";

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
    <div className="w-full p-4 sm:p-6 lg:px-8 lg:py-7 space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher accounts and assignments"
        icon={<UserCheck className="size-5" />}
        actions={<Register onSuccess={refreshTeachers} forcedRole="teacher" />}
      />

      {/* Breadcrumb */}
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

      {/* Search */}
      <div className="ax-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--ax-faint)" }} />
          <Input
            placeholder="Search teachers..."
            className="pl-9 rounded-xl"
            style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="ax-card overflow-hidden">
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--ax-border)" }}>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl" style={{ background: "var(--ax-green-soft)", color: "var(--ax-green)" }}>
              <UserCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
                All Teachers
              </h2>
              <p className="text-xs" style={{ color: "var(--ax-muted)" }}>
                {teachers.length} total
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "var(--ax-border)" }}>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>
                  <div className="flex items-center gap-1"><ArrowUpDown className="size-3" />#</div>
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Name</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Reg No</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Class</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2" style={{ color: "var(--ax-muted)" }}>
                      <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--ax-border)", borderTopColor: "var(--ax-purple)" }} />
                      Loading teachers...
                    </div>
                  </TableCell>
                </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center" style={{ color: "var(--ax-muted)" }}>
                    No teachers found
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher, index) => (
                  <TableRow key={teacher._id} style={{ borderColor: "var(--ax-border)" }}>
                    <TableCell style={{ color: "var(--ax-faint)" }}>{index + 1}</TableCell>
                    <TableCell className="font-medium" style={{ color: "var(--ax-text)" }}>{teacher.name}</TableCell>
                    <TableCell style={{ color: "var(--ax-muted)" }}>{teacher.RegNo}</TableCell>
                    <TableCell style={{ color: "var(--ax-muted)" }}>{teacher.classId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
