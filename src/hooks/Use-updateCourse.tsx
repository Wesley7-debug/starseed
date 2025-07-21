'use client';
import { useState } from 'react';

export function useUpdateCourse(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const updateCourse = async (courseId: string, data: { subject?: string; department?: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/Add-courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Update failed');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };
  return { updateCourse, loading };
}
