"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmPromoteModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
}

export function PromoteConfirmPromoteModal({
  open,
  onOpenChange,
  onConfirm,
  count,
}: ConfirmPromoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Promotion</DialogTitle>
          <DialogDescription>
            Are you sure you want to promote <strong>{count}</strong> student
            {count > 1 ? "s" : ""}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
