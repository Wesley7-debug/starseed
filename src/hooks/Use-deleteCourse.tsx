'use client';

import { useState } from 'react';

export function useDeleteCourse(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCourse = async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/(courses)/Add-courses/${courseId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  return { deleteCourse, loading, error };
}
