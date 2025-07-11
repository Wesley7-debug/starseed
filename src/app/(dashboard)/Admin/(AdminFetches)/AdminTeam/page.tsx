'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usERrs } from "../../Admpages/AdmCharts/user";
import Register from "@/app/Register/page";




export default function AdminTeam() {


  const [searchQuery, setSearchQuery] = useState<string>("");

  
  const filteredUsers = usERrs.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && user.role === "admin";
  });



  return (
    <div className="px-6 py-6 rounded-lg border-2 space-y-4 w-full">
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
<Register/>
      </div>

     
        {/* Scrollable Area */}
        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class ID</TableHead>
             
              <TableHead>Roles</TableHead> {/* New column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.classId}</TableCell>
            
                <TableCell >
<h1>Admin</h1>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
     
    </div>
  );
}
