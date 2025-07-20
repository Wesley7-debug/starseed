'use client'
import { Button } from '@/components/ui/button'

interface Props {
  department: string | null
  setDepartment: (d: string) => void
  isSenior: boolean
}

export function DepartmentPicker({ department, setDepartment, isSenior }: Props) {
  if (!isSenior) return null
  return (
    <div className="flex items-center space-x-4">
      <span>Select department:</span>
      <Button variant={department === 'science' ? 'default' : 'outline'} onClick={() => setDepartment('science')}>Science</Button>
      <Button variant={department === 'art' ? 'default' : 'outline'} onClick={() => setDepartment('art')}>Art</Button>
    </div>
  )
}
