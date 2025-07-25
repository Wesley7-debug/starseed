interface PromotePayload {
  id: string;
  newClassId: string;
}

export const promoteStudents = async (updates: PromotePayload[]) => {
  const res = await fetch("/api/promote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });

  if (!res.ok) throw new Error("Failed to promote students");
  return res.json();
};
