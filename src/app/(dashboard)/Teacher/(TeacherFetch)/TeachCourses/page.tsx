'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AddCourseModal } from './AddCourseModal';
import { CourseList } from './CourseList';

export interface Course {
  courseId: string;
  subject: string;
  department: 'science' | 'arts' | null;
  classId?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

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

async function handleSave(courses: Course[]) {
  setLoading(true);
  try {
    const res = await fetch('/api/Add-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courses }), // send array
    });

    if (!res.ok) {
      throw new Error('Failed to save course(s)');
    }

    toast.success('Course(s) added');
    await fetchCourses();
    setModalOpen(false);
    setEditing(null);
  } catch (e) {
    console.error(e);
    toast.error('Failed to save course(s)');
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>

      <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
        + Add Course
      </Button>

      <CourseList 
        courses={courses} 
        reload={fetchCourses} 
        // onEdit={(course: Course) => {
        //   setEditing(course);
        //   setModalOpen(true);
        // }}
      />

      <AddCourseModal
        open={modalOpen}
        initial={editing ?? undefined}
        loading={loading}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
