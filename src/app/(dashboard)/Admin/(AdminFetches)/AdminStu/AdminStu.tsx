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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Filter,
  GraduationCap,
  ArrowUpDown,
} from "lucide-react";
import DeleteUser from "@/components/reusable/DeleteModal";
import PromoteButton from "./PromoteStu/PromoteButton";
import DemoteButton from "./Demote/DemteButton";
import { Role } from "@/models/User";
import { useDebounce } from "@/hooks/Usedebounce";
import EditUser from "@/components/reusable/EditModal";
import Register from "@/components/reusable/Register";
import PageHeader from "@/components/reusable/PageHeader";

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
    <div className="w-full p-4 sm:p-6 lg:px-8 lg:py-7 space-y-6">
      <PageHeader
        title="Students"
        description="Manage student accounts and promotions"
        icon={<GraduationCap className="size-5" />}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PromoteButton selectedIds={selectedIds} students={students} onSuccess={refreshStudent} />
            <DemoteButton selectedIds={selectedIds} students={students} onSuccess={refreshStudent} />
            <Register onSuccess={refreshStudent} forcedRole="student" />
          </div>
        }
      />

      {/* Filter Row */}
      <div className="ax-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" style={{ color: "var(--ax-faint)" }} />
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger
                className="w-[150px] rounded-xl"
                style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
              >
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

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--ax-faint)" }} />
            <Input
              placeholder="Search students..."
              className="pl-9 rounded-xl"
              style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ax-card overflow-hidden">
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--ax-border)" }}>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl" style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
                All Students
              </h2>
              <p className="text-xs" style={{ color: "var(--ax-muted)" }}>
                {students.length} total {selectedIds.length > 0 && ` · ${selectedIds.length} selected`}
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: "var(--ax-border)" }}>
                <TableHead className="w-10">
                  <input
                    aria-label="Select all"
                    type="checkbox"
                    checked={selectedIds.length === students.length && students.length > 0}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-[var(--ax-border)] accent-[var(--ax-purple)]"
                  />
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>
                  <div className="flex items-center gap-1"><ArrowUpDown className="size-3" />#</div>
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Name</TableHead>
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
                      Loading students...
                    </div>
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center" style={{ color: "var(--ax-muted)" }}>
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((user, index) => (
                  <TableRow key={user._id} style={{ borderColor: "var(--ax-border)" }}>
                    <TableCell>
                      <input
                        aria-label={`Select ${user.name}`}
                        type="checkbox"
                        checked={selectedIds.includes(user._id)}
                        onChange={() => toggleSelect(user._id)}
                        className="size-4 rounded border-[var(--ax-border)] accent-[var(--ax-purple)]"
                      />
                    </TableCell>
                    <TableCell style={{ color: "var(--ax-faint)" }}>{index + 1}</TableCell>
                    <TableCell className="font-medium" style={{ color: "var(--ax-text)" }}>{user.name}</TableCell>
                    <TableCell style={{ color: "var(--ax-muted)" }}>{user.classId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditUser
                          id={user._id}
                          name={user.name}
                          RegNo={user.RegNo ?? ""}
                          classId={user.classId}
                          role={user.role}
                          onSuccess={refreshStudent}
                        />
                        <DeleteUser id={user._id} name={user.name} onSuccess={refreshStudent} />
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
