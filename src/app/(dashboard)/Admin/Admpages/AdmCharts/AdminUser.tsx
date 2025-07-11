"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDebounce } from "@/app/hooks/Usedebounce"

type Role = "student" | "teacher" | "admin"
type ClassId =
  | `primary-${1 | 2 | 3 | 4 | 5 | 6}`
  | `jss${1 | 2 | 3}`
  | `ss${1 | 2 | 3}`

interface User {
  _id: string
  name: string
  classId?: string
  role: Role
}

const roles: Role[] = ["student", "teacher", "admin"]
const classIds: ClassId[] = [
  "primary-1",
  "primary-2",
  "primary-3",
  "primary-4",
  "primary-5",
  "primary-6",
  "jss1",
  "jss2",
  "jss3",
  "ss1",
  "ss2",
  "ss3",
]

export default function AdminUserTable() {
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false);

   // Debounced filters
  const debouncedRole = useDebounce(selectedRole, 300)
  const debouncedClassId = useDebounce(selectedClassId, 300)
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
           const params = new URLSearchParams()

        if (debouncedRole) params.append("role", debouncedRole)
        if (debouncedClassId) params.append("classId", debouncedClassId)
        if (debouncedSearchQuery) params.append("search", debouncedSearchQuery)

        const res = await fetch(`/api/user?${params.toString()}`)

        if (!res.ok) {
          console.error("Failed to fetch users")
          return
        }

        const {data }= await res.json()
        setUsers(data)
      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [debouncedRole, debouncedClassId, debouncedSearchQuery])

  return (
    <div className="p-6 rounded-lg border-2 space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          {/* Role Select */}
          <Select onValueChange={setSelectedRole} value={selectedRole}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Class Select */}
          <Select onValueChange={setSelectedClassId} value={selectedClassId}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <SelectValue placeholder="Select class" />
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

        {/* Search */}
        <Input
          placeholder="Search name..."
          className="w-[150px] rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="mt-4 h-[400px]">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.classId || "—"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
