'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { DepartmentPicker } from './DepartmentPicker'
import { ConfirmSubmissionModal } from './ConfirmSubmission'
import { CourseSelection } from './CourseSelection'
import { SelectedCoursesTable } from './Stu-coursetable'


export default function SelectCoursesPage() {
  const [user, setUser] = useState<{ name: string; classId: string } | null>(null)
  const [department, setDepartment] = useState<string | null>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [showConfirm, setShowConfirm] = useState(false)

  const isSenior = user ? ['SS1','SS2','SS3'].includes(user.classId) : false

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(d => setUser(d))
  }, [])

  useEffect(() => {
    if (user && (!isSenior || department)) {
      const url = new URL('/api/selectCourses', location.origin)
      if (isSenior) url.searchParams.set('department', department!)
      fetch(url)
        .then(res => res.json())
        .then(d => setCourses(d.courses))
    }
  }, [user, isSenior, department])

  const handleConfirm = async () => {
    const body: any = { courses: selected }
    if (isSenior) body.department = department

    const res = await fetch('/api/select-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    data.error ? toast.error(data.error) : toast.success('Registered successfully!')
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Select Your Courses</h1>
      {user && (
        <DepartmentPicker
          department={department}
          setDepartment={setDepartment}
          isSenior={isSenior}
        />
      )}
      {user && (!isSenior || department) && (
        <>
          <h2 className="text-xl font-semibold">Available Courses</h2>
          <CourseSelection courses={courses} selected={selected} setSelected={setSelected} />

          <ConfirmSubmissionModal
            open={showConfirm}
            setOpen={setShowConfirm}
            onConfirm={handleConfirm}
            userName={user.name}
            disabled={selected.length === 0}
          />

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Selected Courses</h2>
            <SelectedCoursesTable
              courses={courses.filter(c => selected.includes(c.courseId))}
            />
          </div>
        </>
      )}
    </div>
  )
}
