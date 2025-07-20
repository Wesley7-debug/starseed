'use client'
interface Course {
  subject: string
  courseId: string
  department: string | null
}

interface Props {
  courses: Course[]
  selected: string[]
  setSelected: (s: string[]) => void
}

export function CourseSelection({ courses, selected, setSelected }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {courses.map(c => (
        <label key={c.courseId} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selected.includes(c.courseId)}
            onChange={() => {
              const next = selected.includes(c.courseId)
                ? selected.filter(x => x !== c.courseId)
                : [...selected, c.courseId]
              setSelected(next)
            }}
          />
          <span>{c.courseId} – {c.subject}</span>
        </label>
      ))}
    </div>
  )
}
