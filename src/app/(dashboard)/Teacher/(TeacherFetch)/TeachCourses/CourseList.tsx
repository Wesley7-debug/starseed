'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDeleteCourse } from '@/app/hooks/Use-deleteCourse';
import { Course } from './page';

interface CourseListProps {
  courses: Course[];
  reload: () => void;
   
}

export function CourseList({ courses,  reload,  }: CourseListProps) {
  const { deleteCourse, loading } = useDeleteCourse(reload);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  async function handleDelete(courseId: string) {
    setDeletingCourseId(courseId);
    await deleteCourse(courseId);
    setDeletingCourseId(null);
  }

  return (
    <div className="space-y-4">
      {courses.map((c) => {
        const isDeleting = loading && deletingCourseId === c.courseId;
        

        return (
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

              <Button
                size="sm"
                variant="destructive"
                // disabled={isEditing || isDeleting} // disable delete while editing or deleting this course
                onClick={() => handleDelete(c.courseId)}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
