"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CourseAutosuggest } from "./CourseAutoSuggest";
import { CourseSuggestion } from "./CourseSuggestion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  initial?: { subject: string; courseId: string; department: string | null };
  loading: boolean;
  onSave: (subjects: string, department: string | null) => void;
  onClose: () => void;
}

export function AddCourseModal({
  open,
  initial,
  loading,
  onSave,
  onClose,
}: Props) {
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [selectedCourses, setSelectedCourses] = useState<CourseSuggestion[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAutosuggest, setShowAutosuggest] = useState(false);

  useEffect(() => {
    if (open) {
      setSubject(initial?.subject ?? "");

      if (initial?.subject && initial?.courseId) {
        setSelectedCourses([
          {
            subject: initial.subject,
            courseId: initial.courseId,
            department: initial.department ?? null,
          } as CourseSuggestion,
        ]);
      } else {
        setSelectedCourses([]);
      }

      setShowAutosuggest(false);
    }
  }, [open, initial]);

  function handleSelect(course: CourseSuggestion) {
    if (!selectedCourses.some((c) => c.courseId === course.courseId)) {
      setSelectedCourses((prev) => [...prev, course]);
    }
    setShowAutosuggest(false);
    setSubject("");
  }

  function handleRemove(courseId: string) {
    setSelectedCourses((prev) => prev.filter((c) => c.courseId !== courseId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowAutosuggest(false);

    if (selectedCourses.length === 0) {
      toast.error("Please select at least one course.");
      return;
    }

    try {
      setSaving(true);

      const payload = selectedCourses.map((course) => ({
        subject: course.subject.trim(),
        courseId: course.courseId.trim(),
        department: course.department ?? null,
      }));

      const res = await fetch("/api/Add-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to save");
        return;
      }

      toast.success("Courses added successfully!");
      onSave(
        payload.map((c) => c.subject).join(", "),
        null
      );

      onClose();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="  w-full max-w-sm sm:max-w-md overflow-hidden rounded-lg p-6 bg-white shadow-lg flex flex-col absolute"
      >
        {/* Header with Title and X Button */}
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">
            {initial ? "Edit Course" : "Add Courses"}
          </DialogTitle>

        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-5 flex-grow overflow-hidden mt-4"
        >
          {/* Input field with autosuggest */}
          <div className="relative">
            <Label htmlFor="subject" className="font-semibold">
              Course Name(s)
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setShowAutosuggest(true);
              }}
              placeholder="Start typing course name..."
              autoComplete="off"
              disabled={saving || loading}
            />
            {subject.trim().length > 0 && showAutosuggest && (
              <div className="absolute top-full left-0 right-0 z-20 max-h-64 overflow-y-auto border rounded-md bg-white shadow-lg mt-1">
                <CourseAutosuggest
                  query={subject}
                  selectedCourses={selectedCourses}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                />
              </div>
            )}
          </div>

          {/* Selected Courses */}
          {selectedCourses.length > 0 && (
            <div>
              <Label className="font-semibold">Selected Courses</Label>
              <div className="flex flex-col gap-2 mt-1">
                {selectedCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex flex-col border rounded-md p-2 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2"
                      >
                        {course.subject}
                        <button
                          aria-label="remove course"
                          type="button"
                          onClick={() => handleRemove(course.courseId)}
                          className="ml-1 text-slate-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </div>
                    {course.department && (
                      <div className="text-sm text-gray-600 mt-1 pl-1">
                        Department:{" "}
                        <span className="text-black">{course.department}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer + Actions */}
          <div className="flex-grow" />
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving || loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || loading}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
