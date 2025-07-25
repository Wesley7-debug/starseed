"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { promotionMap } from "@/lib/PromotionMap";
import { toast } from "sonner";
import { PromoteConfirmPromoteModal } from "./PromoteModal";
import { promoteStudents } from "@/app/hooks/Use-promoteStuu";

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
      alert("No students selected");
      return;
    }
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setModalOpen(false);

    // Use exact case key matching, no toLowerCase
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
      <Button
        onClick={handlePromoteClick}
        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
      >
        Promote
      </Button>

      <PromoteConfirmPromoteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
        count={toPromote.length}
      />
    </>
  );
}
