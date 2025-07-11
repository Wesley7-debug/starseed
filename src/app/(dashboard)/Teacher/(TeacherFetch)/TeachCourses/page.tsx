'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AddCourseModal } from './AddCourseModal';
import { useUpdateCourse } from '@/hooks/Use-updateCourse';
import { CourseList } from './CourseList';

export interface Course {
  courseId: string;
  subject: string;
  department: 'science' | 'arts' | null;
  classId: string;
}

// Ensure your hook returns updateCourse and loading, and takes a callback to refetch
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  const { updateCourse, loading } = useUpdateCourse(fetchCourses);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch('/api/Add-courses');
      const data = await res.json();
      setCourses(data.allCourses || []);
    } catch (e) {
      console.error(e);
      toast.error('Error loading courses');
    }
  }

  async function handleSave(subject: string, department: string | null) {
    if (editing) {
      await updateCourse(editing.courseId, { subject, department: department ?? undefined });
      setEditing(null);
      setModalOpen(false);
    } else {
      // handle create vs. edit as-needed
      setModalOpen(false);
      fetchCourses();
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>

      <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
        + Add Course
      </Button>

      <CourseList courses={courses} onEdit={(c) => { setEditing(c); setModalOpen(true); }} reload={fetchCourses} />

      <AddCourseModal
        open={modalOpen}
        initial={editing ?? undefined}
        loading={loading}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
