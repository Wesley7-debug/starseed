"use client";

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
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
import { useDebounce } from "@/hooks/Usedebounce";

type Role = "student" | "teacher" | "admin";
type ClassId =
  | `primary-${1 | 2 | 3 | 4 | 5 | 6}`
  | `jss${1 | 2 | 3}`
  | `ss${1 | 2 | 3}`;

interface User {
  _id: string;
  name: string;
  classId?: string;
  role: Role;
}

const roles: Role[] = ["student", "teacher", "admin"];
const classIds: ClassId[] = [
  "primary-1", "primary-2", "primary-3", "primary-4", "primary-5", "primary-6",
  "jss1", "jss2", "jss3", "ss1", "ss2", "ss3",
];

export default function AdminUserTable() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedRole = useDebounce(selectedRole, 300);
  const debouncedClassId = useDebounce(selectedClassId, 300);
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedRole && debouncedRole !== "all") params.append("role", debouncedRole);
        if (debouncedClassId && debouncedClassId !== "all") params.append("classId", debouncedClassId);
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);

        const res = await fetch(`/api/user?${params.toString()}`);
        if (!res.ok) return;
        const { data } = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedRole, debouncedClassId, debouncedSearchQuery]);

  const roleBadge = (role: Role) => {
    const styles: Record<Role, { background: string; color: string }> = {
      admin: { background: "#e7ddff", color: "#8261db" },
      teacher: { background: "#d8f3e5", color: "#2ba866" },
      student: { background: "#ffe2cb", color: "#ef8e52" },
    };
    return styles[role];
  };

  return (
    <div className="ax-card flex flex-col p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
            Users
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ax-muted)" }}>
            {users.length} total
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--ax-faint)" }} />
          <Input
            placeholder="Search by name..."
            className="pl-9"
            style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedRole} value={selectedRole}>
            <SelectTrigger className="w-[120px]" style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}>
              <Filter className="mr-1 h-3 w-3" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)" }}>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedClassId} value={selectedClassId}>
            <SelectTrigger className="w-[120px]" style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}>
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)" }}>
              <SelectItem value="all">All Classes</SelectItem>
              {classIds.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[320px]">
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "var(--ax-border)" }}>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>#</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Name</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Class</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  <div className="flex items-center justify-center gap-2" style={{ color: "var(--ax-muted)" }}>
                    <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--ax-border)", borderTopColor: "var(--ax-purple)" }} />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center" style={{ color: "var(--ax-muted)" }}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user._id} style={{ borderColor: "var(--ax-border)" }}>
                  <TableCell style={{ color: "var(--ax-faint)" }}>{index + 1}</TableCell>
                  <TableCell className="font-medium" style={{ color: "var(--ax-text)" }}>{user.name}</TableCell>
                  <TableCell style={{ color: "var(--ax-muted)" }}>{user.classId || "\u2014"}</TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
                      style={roleBadge(user.role)}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
