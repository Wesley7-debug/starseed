"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { MultiSelect } from "@/components/ui/Multi-select";

export default function CreateMaterial() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-xl shadow-md p-6 sm:p-8 space-y-5 border border-indigo-200">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">
          Create New Material
        </h1>

        <div className="space-y-4">
          {/* Title input */}
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            disabled={submitting}
          />

          {/* Content textarea */}
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            className="min-h-[120px]"
            disabled={submitting}
          />

          {/* MultiSelect for target roles */}
          {isAdmin && (
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
          )}

          {/* Expiration Date */}
          <div>
            <label className="block mb-2 font-medium text-sm text-gray-700">
              Expiration Date (optional)
            </label>
            <Calendar
              mode="single"
              selected={expiresAt}
              onSelect={setExpiresAt}
              disabled={submitting}
              className="rounded-lg border border-indigo-200 shadow-sm"
            />
            {expiresAt && (
              <p className="mt-2 text-sm text-indigo-600 font-medium">
                Selected: {format(expiresAt, "PPP")}
              </p>
            )}
          </div>
        </div>

        {/* Action & feedback */}
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
    </div>
  );
}
