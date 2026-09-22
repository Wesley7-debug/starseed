"use client";

import { useState } from "react";
import { demotionMap } from "@/lib/DemotionMap";
import { toast } from "sonner";
import { DemoteConfirmModal } from "./Demotemodal";
import { demoteStudents } from "@/hooks/Use-demotestu";
import { ArrowDown } from "lucide-react";

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
      toast.error("No students selected");
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
      <button
        onClick={handleDemoteClick}
        className="inline-flex items-center gap-1.5 rounded-xl border border-red-300/30 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
      >
        <ArrowDown className="size-3.5" />
        Demote
      </button>

      <DemoteConfirmModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
        count={toDemote.length}
      />
    </>
  );
}
