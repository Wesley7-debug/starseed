"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { MultiSelect } from "@/components/ui/Multi-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog as CalendarDialog,
  DialogContent as CalendarDialogContent,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CreateMaterial() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [explicitUsers, setExplicitUsers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = session?.user?.role === "admin";

  const roleOptions = [
    { label: "Students", value: "student" },
    { label: "Teachers", value: "teacher" },
  ];

  async function handleSubmit() {
    setSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          expiresAt,
          targetRoles: isAdmin ? targetRoles : [],
          explicitUsers,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit material");

      setSuccess(true);
      setTitle("");
      setContent("");
      setExpiresAt(undefined);
      setTargetRoles([]);
      setExplicitUsers([]);
    } catch (err) {
      setError((err as Error).message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 space-y-6 border border-indigo-200">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">
          Create New Material
        </h1>

        <div className="space-y-4 flex flex-col items-center">
          {/* Title */}
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            disabled={submitting}
            className="w-full max-w-sm"
          />

          {/* Content */}
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            className="min-h-[100px] w-full max-w-sm"
            disabled={submitting}
          />

          {/* Roles */}
          {isAdmin && (
            <div className="w-full max-w-sm">
              <MultiSelect
                selected={targetRoles}
                options={roleOptions}
                onChange={(newSelection) => {
                  if (newSelection.length <= roleOptions.length) {
                    setTargetRoles(newSelection);
                  }
                }}
                placeholder="Select target roles"
                disabled={submitting}
              />
            </div>
          )}

          {/* Expiration Date Button */}
          <div className="w-full max-w-sm">
            <label className="block mb-1 font-medium text-sm text-gray-700">
              Expiration Date (optional)
            </label>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
              onClick={() => setCalendarOpen(true)}
              disabled={submitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
            </Button>
          </div>
        </div>

        {/* Feedback + Submit */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm text-green-600 font-semibold">
              Material created successfully!
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className="w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Material"
            )}
          </Button>
        </div>
      </div>

      {/* Calendar Dialog */}
      <CalendarDialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <CalendarDialogContent className="w-auto p-4">
          <Calendar
            mode="single"
            selected={expiresAt}
            onSelect={(date) => {
              setExpiresAt(date);
              setCalendarOpen(false);
            }}
            initialFocus
          />
        </CalendarDialogContent>
      </CalendarDialog>
    </div>
  );
}
