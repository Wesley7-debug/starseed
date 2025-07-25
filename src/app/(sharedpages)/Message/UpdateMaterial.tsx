"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { useUpdateMaterials } from "@/app/hooks/Use-UpdateMat";



type UpdateMaterialModalProps = {
  material: {
    _id: string;
    title: string;
    content: string;
  };
  onUpdated: () => void;
};

export function UpdateMaterialModal({ material, onUpdated }: UpdateMaterialModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(material.title);
  const [content, setContent] = useState(material.content);

  // Reset form when modal opens/closes or material changes
  useEffect(() => {
    if (open) {
      setTitle(material.title);
      setContent(material.content);
    }
  }, [open, material]);

  const { updateCourse, loading } = useUpdateMaterials(() => {
    setOpen(false);
    onUpdated();
  });

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim()) {
    toast.error("Title cannot be empty");
    return;
  }

  if (!content.trim()) {
    toast.error("Content cannot be empty");
    return;
  }

  try {
    await updateCourse(material._id, { title, content });
    toast.success("Material updated successfully!");
  } catch  {
    toast.error("Failed to update material");
  }
};



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Material</DialogTitle>
          <DialogDescription>Modify the title and content below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
