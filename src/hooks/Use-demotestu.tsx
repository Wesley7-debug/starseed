interface DemotePayload {
  id: string;
  newClassId: string;
}

export const demoteStudents = async (updates: DemotePayload[]) => {
  const res = await fetch('/api/demote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });

  if (!res.ok) throw new Error('Failed to demote students');
  return res.json();
};
