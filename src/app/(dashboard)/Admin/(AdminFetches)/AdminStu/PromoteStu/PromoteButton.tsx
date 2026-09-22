"use client";

import { useState } from "react";
import { promotionMap } from "@/lib/PromotionMap";
import { toast } from "sonner";
import { PromoteConfirmPromoteModal } from "./PromoteModal";
import { promoteStudents } from "@/hooks/Use-promoteStuu";
import { ArrowUp } from "lucide-react";

interface User {
  _id: string;
  classId: string;
}

interface Props {
  selectedIds: string[];
  students: User[];
  onSuccess: () => void;
}

export default function PromoteButton({ selectedIds, students, onSuccess }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const toPromote = students.filter((s) => selectedIds.includes(s._id));

  const handlePromoteClick = () => {
    if (selectedIds.length === 0) {
      toast.error("No students selected");
      return;
    }
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setModalOpen(false);

    const updates = toPromote.map((s) => ({
      id: s._id,
      newClassId: promotionMap[s.classId] || s.classId,
    }));

    try {
      await promoteStudents(updates);
      toast.success("Promotion successful");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Promotion failed");
    }
  };

  return (
    <>
      <button
        onClick={handlePromoteClick}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#2ba866]/30 bg-[#2ba866]/10 px-3.5 py-2 text-sm font-medium text-[#2ba866] transition-all hover:bg-[#2ba866]/20"
      >
        <ArrowUp className="size-3.5" />
        Promote
      </button>

      <PromoteConfirmPromoteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
        count={toPromote.length}
      />
    </>
  );
}
