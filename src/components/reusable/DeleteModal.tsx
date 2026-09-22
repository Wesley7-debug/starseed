"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DeleteUserProps {
  id: string;
  name: string;
  onSuccess?: () => void;
  hidden?: boolean;
}

export default function DeleteUser({ id, name, onSuccess, hidden }: DeleteUserProps) {
  const [open, setOpen] = useState(false);

  if (hidden) return null;
  const [loading, setLoading] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const normalizedName = name.replace(/\s+/g, "").toLowerCase();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete user");
      }

      toast.success("User deleted successfully!");
      setOpen(false);
      setConfirmInput("");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isMatch = confirmInput.replace(/\s+/g, "").toLowerCase() === normalizedName;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="grid size-8 place-items-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
          style={{ color: "var(--ax-faint)" }}
          aria-label="Delete user"
        >
          <Trash2 className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl" style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface)" }}>
        <DialogHeader>
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-red-500">
            <Trash2 className="size-6" />
          </div>
          <DialogTitle className="text-center" style={{ color: "var(--ax-text)" }}>
            Delete &quot;{name}&quot;?
          </DialogTitle>
          <p className="text-center text-sm" style={{ color: "var(--ax-muted)" }}>
            To confirm, type <span className="font-semibold" style={{ color: "var(--ax-text)" }}>{normalizedName}</span>
          </p>
        </DialogHeader>

        <Input
          placeholder="Type name to confirm"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          className="rounded-xl"
          style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface-soft)" }}
        />

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl"
            style={{ borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={!isMatch || loading}
            className="flex-1 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
