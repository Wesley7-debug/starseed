"use client";

import { useState, useEffect } from "react";
import { CourseSuggestion, courseSuggestions } from "./CourseSuggestion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  query: string;
  selectedCourses: CourseSuggestion[];
  onSelect: (suggestion: CourseSuggestion) => void;
  onRemove: (courseId: string) => void;
}

export function CourseAutosuggest({
  query,
  selectedCourses,
  onSelect,
  onRemove,
}: Props) {
  const [filtered, setFiltered] = useState<CourseSuggestion[]>([]);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    setFiltered(
      courseSuggestions.filter(
        (c) =>
          (c.subject.toLowerCase().includes(lowerQuery) ||
            c.courseId.toLowerCase().includes(lowerQuery)) &&
          !selectedCourses.some((sel) => sel.courseId === c.courseId)
      )
    );
  }, [query, selectedCourses]);

  return (
    <div className="space-y-2">
      {filtered.length > 0 ? (
        filtered.map((c) => (
          <Button
            key={c.courseId}
            type="button"
            className="w-full justify-start text-left px-4 py-2 rounded-md hover:bg-slate-100"
            variant="ghost"
            onClick={() => onSelect(c)}
          >
            {c.subject} <span className="text-sm text-slate-500 ml-2">({c.department})</span>
          </Button>
        ))
      ) : (
        <p className="text-sm text-gray-500 px-2">No results found.</p>
      )}

      {selectedCourses.length > 0 && (
        <div className="pt-3">
          <p className="text-sm font-semibold mb-1">Selected Courses:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.map((course) => (
              <Badge key={course.courseId} variant="outline" className="flex items-center gap-1 px-2">
                {course.subject}
                <button
                aria-label="add"
                  type="button"
                  onClick={() => onRemove(course.courseId)}
                  className="ml-1 text-slate-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
