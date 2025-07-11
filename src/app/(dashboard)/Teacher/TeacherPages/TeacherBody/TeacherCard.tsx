"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { ScrollArea } from "@/components/ui/scroll-area"
import { usERrs } from "@/app/(dashboard)/Admin/Admpages/AdmCharts/user"


// type ClassId = `primary-${1 }`


// const classIds: ClassId= "primary-1"


export default function TeacherTableCard() {

  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredUsers = usERrs.filter(user => {

    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && user.classId === 'primary-1';
  })

  return (
    <div>
      <div className="p-4 rounded-lg border-2  w-full">
        {/* Search */}
        <Input
          placeholder="Search name..."
          className="w-[150px] rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ScrollArea className="mt-4 h-fit max-h-[400px] w-full rounded-lg border-2 p-4">
        {/* Scrollable Area */}
        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class ID</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.classId}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
