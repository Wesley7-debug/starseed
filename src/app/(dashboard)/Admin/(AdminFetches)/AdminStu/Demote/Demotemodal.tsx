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
import { ArrowDown } from "lucide-react";

interface ConfirmDemoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count: number;
}

export function DemoteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  count,
}: ConfirmDemoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-[#e8e3ee] bg-white">
        <DialogHeader>
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-red-500">
            <ArrowDown className="size-6" />
          </div>
          <DialogTitle className="text-center text-[#1f2130]">
            Confirm Demotion
          </DialogTitle>
          <DialogDescription className="text-center text-[#777489]">
            Are you sure you want to demote <span className="font-semibold text-[#1f2130]">{count}</span> student
            {count > 1 ? "s" : ""} to the previous class?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[#e8e3ee] text-[#1f2130]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Demote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
