'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
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
import Register from "@/components/reusable/Register";
import PageHeader from "@/components/reusable/PageHeader";
import { Users, Search, Shield, ArrowUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import EditUser from "@/components/reusable/EditModal";
import DeleteUser from "@/components/reusable/DeleteModal";

interface User {
  _id: string;
  name: string;
  classId: string;
  RegNo: string;
  role: string;
}

export default function AdminTeam() {
  const { data: session } = useSession();
  const currentRegNo = session?.user?.RegNo || "";
  const isSuperAdmin = currentRegNo.startsWith("ADM-100");
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("role", "admin");
        if (debouncedSearchQuery) {
          params.append("name", debouncedSearchQuery);
        }

        const res = await fetch(`/api/user/?${params.toString()}`);
        const { data } = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [debouncedSearchQuery, refreshTrigger]);

  const refreshTeam = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="w-full p-4 sm:p-6 lg:px-8 lg:py-7 space-y-6">
      <PageHeader
        title="Team"
        description="Administrative team members"
        icon={<Users className="size-5" />}
        actions={<Register forcedRole="admin" onSuccess={refreshTeam} />}
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
              <Link href="/Admin/AdminTeam">Team</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search */}
      <div className="ax-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--ax-faint)" }} />
          <Input
            placeholder="Search team members..."
            className="pl-9 rounded-xl"
            style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--ax-surface-soft)", color: "var(--ax-muted)", border: "1px solid var(--ax-border)" }}>
          Only the primary admin (ADM-100) can edit or remove other administrators.
        </div>
      )}

      {/* Table */}
      <div className="ax-card overflow-hidden">
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--ax-border)" }}>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl" style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
                Administrators
              </h2>
              <p className="text-xs" style={{ color: "var(--ax-muted)" }}>
                {teams.length} members
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
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Class ID</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--ax-faint)" }}>Role</TableHead>
                {isSuperAdmin && (
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: "var(--ax-faint)" }}>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin ? 5 : 4} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2" style={{ color: "var(--ax-muted)" }}>
                      <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--ax-border)", borderTopColor: "var(--ax-purple)" }} />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : teams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin ? 5 : 4} className="py-12 text-center" style={{ color: "var(--ax-muted)" }}>
                    No team members found
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((user, index) => (
                  <TableRow key={user._id} style={{ borderColor: "var(--ax-border)" }}>
                    <TableCell style={{ color: "var(--ax-faint)" }}>{index + 1}</TableCell>
                    <TableCell className="font-medium" style={{ color: "var(--ax-text)" }}>{user.name}</TableCell>
                    <TableCell style={{ color: "var(--ax-muted)" }}>{user.classId || "—"}</TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}
                      >
                        Admin
                      </span>
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditUser
                            id={user._id}
                            name={user.name}
                            RegNo={user.RegNo}
                            classId={user.classId}
                            role={user.role}
                            onSuccess={refreshTeam}
                          />
                          <DeleteUser id={user._id} name={user.name} onSuccess={refreshTeam} />
                        </div>
                      </TableCell>
                    )}
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
