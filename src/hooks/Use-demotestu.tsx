interface DemotePayload {
  id: string;
  newClassId: string;
}

export const demoteStudents = async (updates: DemotePayload[]) => {
  const res = await fetch("/api/demote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Demotion API error:", errorText);
    throw new Error("Failed to demote students");
  }
  return res.json();
};
