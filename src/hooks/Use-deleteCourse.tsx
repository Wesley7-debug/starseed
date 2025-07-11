'use client';
import { useState } from 'react';

export function useDeleteCourse(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const deleteCourse = async (courseId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/Add-courses/${courseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  return { deleteCourse, loading };
}
