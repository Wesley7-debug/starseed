'use client';
import { useState } from 'react';

export function useUpdateMaterials(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const updateCourse = async (id: string, data: { title?: string; content?: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${id}`, {
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
