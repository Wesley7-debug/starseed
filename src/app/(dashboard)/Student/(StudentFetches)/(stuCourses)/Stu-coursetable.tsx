'use client'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table'

interface Course {
  subject: string
  courseId: string
  department: string | null
}

interface Props {
  courses: Course[]
}

export function SelectedCoursesTable({ courses }: Props) {
  const requiredIDs = ['MATH101', 'ENG101']

  const ordered = [
    ...courses.filter(c => requiredIDs.includes(c.courseId)),
    ...courses.filter(c => !requiredIDs.includes(c.courseId))
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Course ID</TableCell>
          <TableCell>Subject</TableCell>
          <TableCell>Department</TableCell>
          <TableCell>Required?</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordered.map(c => (
          <TableRow key={c.courseId}>
            <TableCell>{c.courseId}</TableCell>
            <TableCell>{c.subject}</TableCell>
            <TableCell>{c.department || 'Junior'}</TableCell>
            <TableCell>
              {requiredIDs.includes(c.courseId)
                ? <span className="text-red-600">Required</span>
                : <span className="text-green-600">Optional</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
