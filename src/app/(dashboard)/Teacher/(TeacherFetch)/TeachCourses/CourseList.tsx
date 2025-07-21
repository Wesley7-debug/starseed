'use client';
import { Button } from '@/components/ui/button';
import { useDeleteCourse } from '@/hooks/Use-deleteCourse';
import { Course } from './page';



interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  reload: () => void;
} 

export function CourseList({ courses, onEdit, reload }:CourseListProps) {
  const { deleteCourse, loading } = useDeleteCourse(reload);


  return (
    <div className="space-y-4">
      {courses.map((c) => (
        <div
          key={c.courseId}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div>
            <div className="text-lg font-medium">{c.subject}</div>
            <div className="text-sm text-muted-foreground">
              Class {c.classId} • Dept: {c.department || 'None'}
            </div>
          </div>
          <div className="space-x-2">
            <Button size="sm" onClick={() => onEdit(c)}>Edit</Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={loading}
              onClick={() => deleteCourse(c.courseId)}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
