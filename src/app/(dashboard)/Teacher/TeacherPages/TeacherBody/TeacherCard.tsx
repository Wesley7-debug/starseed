"use client";

import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
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
import { useClientAuth } from "@/hooks/UseClientAuth";

type Student = {
  id: string;
  name: string;
  classId: string;
  role: string;
};

export default function TeacherTableCard() {
  const { session } = useClientAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredUsers = students.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchStudents = async () => {
      if (!session?.user?.classId) return;

      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("classId", session.user.classId);

        const res = await fetch(`/api/user/?${params.toString()}`);
        const { data } = await res.json();
        setStudents(data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [session?.user?.classId]);

  return (
    <div className="ax-card overflow-hidden">
      <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--ax-border)" }}>
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#f0ebff] text-[#8c6be8]">
            <Users className="size-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
              My Students
            </h2>
            <p className="text-xs" style={{ color: "var(--ax-muted)" }}>
              {filteredUsers.length} students
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--ax-faint)" }} />
          <Input
            placeholder="Search by name..."
            className="pl-9"
            style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id} style={{ borderColor: "var(--ax-border)" }}>
                    <TableCell style={{ color: "var(--ax-faint)" }}>{index + 1}</TableCell>
                    <TableCell className="font-medium" style={{ color: "var(--ax-text)" }}>{user.name}</TableCell>
                    <TableCell style={{ color: "var(--ax-muted)" }}>{user.classId}</TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: "#e7ddff", color: "#8261db" }}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center"
                    style={{ color: "var(--ax-muted)" }}
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
