"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { demotionMap } from "@/lib/DemotionMap";
import { toast } from "sonner";
import { DemoteConfirmModal } from "./Demotemodal";
import { demoteStudents } from "@/app/hooks/Use-demotestu";


interface User {
  _id: string;
  classId: string;
}

interface Props {
  selectedIds: string[];
  students: User[];
  onSuccess: () => void;
}

export default function DemoteButton({ selectedIds, students, onSuccess }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const toDemote = students.filter((s) => selectedIds.includes(s._id));

  const handleDemoteClick = () => {
    if (selectedIds.length === 0) {
      alert("No students selected");
      return;
    }
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setModalOpen(false);

    const updates = toDemote.map((s) => ({
      id: s._id,
      newClassId: demotionMap[s.classId] || s.classId,
    }));

    try {
      await demoteStudents(updates);
      toast.success("Demotion successful");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Demotion failed");
    }
  };

  return (
    <>
      <Button
        onClick={handleDemoteClick}
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
      >
        Demote
      </Button>

      <DemoteConfirmModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
        count={toDemote.length}
      />
    </>
  );
}
