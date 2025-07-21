"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClientAuth } from "@/app/hooks/UseClientAuth"
import { Input } from "@/components/ui/input"

type Student = {
  id: string
  name: string
  classId: string
  role: string
}


export default function TeacherTableCard() {
  const {  session } = useClientAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState <Student[]>([])
  const [loading, setLoading] = useState(false)

  // Derived filtered users based on search input
  const filteredUsers = students.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const fetchStudents = async () => {
      if (!session?.user?.classId) return

      try {
        setLoading(true)
        const params = new URLSearchParams()
        params.append("classId", session.user.classId) // Fetch students in this class

        const res = await fetch(`/api/user/?${params.toString()}`)
        const { data } = await res.json()
        setStudents(data || [])
      } catch (err) {
        console.error("Error fetching students:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [session?.user?.classId])

 
  return (
  <>
    <div className="p-4 rounded-lg border-2 w-full">
      <Input
        placeholder="Search name..."
        className="w-[150px] rounded-xl"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {loading ? (
      <div className="p-4 text-center text-gray-500">Loading...</div>
    ) : (
      <ScrollArea className="mt-4 h-fit max-h-[400px] w-full rounded-lg border-2 p-4">
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.classId}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    )}
  </>
)

} 
