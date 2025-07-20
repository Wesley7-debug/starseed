"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


type Props = {
  materialId: string;
  onDeleted: (deletedId: string) => void;
};

export function DeleteMaterialModal({ materialId, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${materialId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

   toast.success("Material deleted successfully.");

      onDeleted(materialId); // Notify parent to update UI
      setOpen(false);
    } catch  {
      toast.error("Failed to delete material. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-1">
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Material</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
