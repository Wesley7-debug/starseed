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
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface DeleteUserProps {
  id: string;
  name: string;
    onSuccess?: () => void;
}

export default function DeleteUser({ id, name ,onSuccess}: DeleteUserProps) {
  const [open, setOpen] = useState(false);
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
        <Button variant="outline" className="w-fit p-3">
          <Trash className="h-4 w-4" color="red" />
          <span className="sr-only">Delete user</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {name}?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            To confirm deletion, type <strong>{normalizedName}</strong>
          </p>
        </DialogHeader>

        <Input
          placeholder="Type name to confirm"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
        />

        <Button
          onClick={handleDelete}
          variant="destructive"
          disabled={!isMatch || loading}
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
