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
import { ArrowUp } from "lucide-react";

interface ConfirmPromoteModalProps {
  open: boolean;
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
      <DialogContent className="sm:max-w-md rounded-2xl border-[#e8e3ee] bg-white">
        <DialogHeader>
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#d8f3e5] text-[#2ba866]">
            <ArrowUp className="size-6" />
          </div>
          <DialogTitle className="text-center text-[#1f2130]">
            Confirm Promotion
          </DialogTitle>
          <DialogDescription className="text-center text-[#777489]">
            Are you sure you want to promote <span className="font-semibold text-[#1f2130]">{count}</span> student
            {count > 1 ? "s" : ""} to the next class?
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
            className="rounded-xl bg-[#2ba866] text-white hover:bg-[#259758]"
          >
            Promote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
