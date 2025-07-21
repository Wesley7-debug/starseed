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
import { useDebounce } from "@/app/hooks/Usedebounce";
import Register from "@/app/Register/page";


interface User {
  id: string;
  name: string;
  classId: string;
}

export default function AdminTeam() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, [debouncedSearchQuery]);

  return (
    <div className="w-full px-3 py-2">
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
              <Link href="/Admin/AdminTeam">Team</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </div>


        <div className="px-6 py-6 rounded-lg border-2 space-y-4 w-full">

      {/* Search */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search name..."
          className="w-[200px] rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Register/>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S/N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class ID</TableHead>
            <TableHead>Roles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.classId}</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {loading && <p>Loading...</p>}
    </div>
    </div>

  );
}
