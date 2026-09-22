"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { MultiSelect } from "@/components/ui/Multi-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog as CalendarDialog,
  DialogContent as CalendarDialogContent,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Pencil,
  Plus,
  Send,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/reusable/PageHeader";

type Material = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  expiresAt: string;
};

export default function Messages() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewMsg, setViewMsg] = useState<Material | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editMsg, setEditMsg] = useState<Material | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<Material | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/materials");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch {
      setError("Something went wrong fetching materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const role = session?.user?.role;
  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  return (
    <div className="mx-auto max-w-[1500px] flex flex-col gap-6 p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Messages"
        description="Send and manage broadcast messages to your school community"
        icon={<FileText className="size-5" />}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMessages}
              className="rounded-xl"
              style={{ borderColor: "var(--ax-border)", color: "var(--ax-muted)" }}
            >
              <RefreshCw className={`mr-1.5 size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {(isTeacher || isAdmin) && (
              <Button
                onClick={() => setCreateOpen(true)}
                className="rounded-xl text-white shadow-sm"
                style={{ background: "var(--ax-purple)" }}
              >
                <Plus className="mr-2 size-4" />
                New Message
              </Button>
            )}
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="ax-card ax-stat ax-stat-lavender flex items-center gap-4 p-5">
          <div className="ax-stat-icon">
            <FileText className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--ax-text)" }}>{messages.length}</p>
            <p className="text-xs" style={{ color: "var(--ax-muted)" }}>Total Messages</p>
          </div>
        </div>
        <div className="ax-card ax-stat ax-stat-mint flex items-center gap-4 p-5">
          <div className="ax-stat-icon">
            <Send className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--ax-text)" }}>
              {messages.filter((m) => !m.expiresAt || new Date(m.expiresAt) > new Date()).length}
            </p>
            <p className="text-xs" style={{ color: "var(--ax-muted)" }}>Active</p>
          </div>
        </div>
        <div className="ax-card ax-stat ax-stat-peach flex items-center gap-4 p-5">
          <div className="ax-stat-icon">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--ax-text)" }}>
              {messages.filter((m) => m.expiresAt && new Date(m.expiresAt) <= new Date()).length}
            </p>
            <p className="text-xs" style={{ color: "var(--ax-muted)" }}>Expired</p>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="ax-card overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-sm text-red-500">{error}</p>
            <Button
              variant="outline"
              onClick={fetchMessages}
              className="rounded-xl"
              style={{ borderColor: "var(--ax-border)" }}
            >
              <RefreshCw className="mr-1.5 size-4" />
              Retry
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="grid size-14 place-items-center rounded-2xl" style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
              <Send className="size-7" />
            </div>
            <p className="text-[15px] font-medium" style={{ color: "var(--ax-text)" }}>No messages yet</p>
            <p className="text-sm" style={{ color: "var(--ax-muted)" }}>Send your first message to get started</p>
            {(isTeacher || isAdmin) && (
              <Button
                onClick={() => setCreateOpen(true)}
                className="mt-2 rounded-xl text-white"
                style={{ background: "var(--ax-purple)" }}
              >
                <Plus className="mr-2 size-4" />
                New Message
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)" }}>
                  <th className="px-5 py-3.5 font-medium" style={{ color: "var(--ax-muted)" }}>Title</th>
                  <th className="hidden px-5 py-3.5 font-medium md:table-cell" style={{ color: "var(--ax-muted)" }}>Content</th>
                  <th className="hidden px-5 py-3.5 font-medium sm:table-cell" style={{ color: "var(--ax-muted)" }}>Created</th>
                  <th className="hidden px-5 py-3.5 font-medium lg:table-cell" style={{ color: "var(--ax-muted)" }}>Expires</th>
                  <th className="px-5 py-3.5 text-right font-medium" style={{ color: "var(--ax-muted)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="border-b transition-colors last:border-0 hover:bg-[var(--ax-surface-soft)]"
                    style={{ borderColor: "color-mix(in srgb, var(--ax-border) 60%, transparent)" }}
                  >
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setViewMsg(msg)}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
                           <FileText className="size-4" />
                         </div>
                         <span className="font-medium"
                          style={{ color: "var(--ax-text)" }}>
                          {msg.title}
                        </span>
                      </button>
                    </td>
                    <td className="hidden max-w-[300px] truncate px-5 py-4 md:table-cell"
                      style={{ color: "var(--ax-muted)" }}>
                      {msg.content}
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-4 sm:table-cell"
                      style={{ color: "var(--ax-muted)" }}>
                      {format(new Date(msg.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-4 lg:table-cell">
                      {msg.expiresAt ? (
                        new Date(msg.expiresAt) <= new Date() ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                            Expired
                          </span>
                        ) : (
                          <span style={{ color: "var(--ax-muted)" }}>
                            {format(new Date(msg.expiresAt), "MMM d, yyyy")}
                          </span>
                        )
                      ) : (
                        <span style={{ color: "var(--ax-faint)" }}>Never</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewMsg(msg)}
                          className="grid size-8 place-items-center rounded-lg transition-colors hover:bg-[var(--ax-purple-soft)] hover:text-[var(--ax-purple)]"
                          style={{ color: "var(--ax-faint)" }}
                          title="View"
                        >
                          <FileText className="size-4" />
                        </button>
                        <button
                          onClick={() => setEditMsg(msg)}
                          className="grid size-8 place-items-center rounded-lg transition-colors hover:bg-[var(--ax-purple-soft)] hover:text-[var(--ax-purple)]"
                          style={{ color: "var(--ax-faint)" }}
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteMsg(msg)}
                          className="grid size-8 place-items-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
                          style={{ color: "var(--ax-faint)" }}
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Dialog open={!!viewMsg} onOpenChange={(o) => !o && setViewMsg(null)}>
        <DialogContent className="sm:max-w-lg rounded-2xl"
          style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface)" }}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl"
                style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}>
                <FileText className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg" style={{ color: "var(--ax-text)" }}>
                  {viewMsg?.title}
                </DialogTitle>
                <DialogDescription className="text-xs" style={{ color: "var(--ax-muted)" }}>
                  Sent{" "}
                  {viewMsg &&
                    format(new Date(viewMsg.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto rounded-xl p-4 text-sm leading-relaxed"
            style={{ background: "var(--ax-surface-soft)", color: "var(--ax-text)" }}>
            {viewMsg?.content}
          </div>

          {viewMsg?.expiresAt && (
            <p className="text-xs" style={{ color: "var(--ax-faint)" }}>
              Expires: {format(new Date(viewMsg.expiresAt), "MMM d, yyyy")}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditMsg(viewMsg);
                setViewMsg(null);
              }}
              className="rounded-xl hover:opacity-90"
              style={{ borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            >
              <Pencil className="mr-1.5 size-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteMsg(viewMsg);
                setViewMsg(null);
              }}
              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Material Modal */}
      <CreateMaterialDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={fetchMessages}
      />

      {/* Edit Material Modal */}
      {editMsg && (
        <EditMaterialDialog
          material={editMsg}
          open={!!editMsg}
          onOpenChange={(o) => !o && setEditMsg(null)}
          onUpdated={fetchMessages}
        />
      )}

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteMsg} onOpenChange={(o) => !o && setDeleteMsg(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl"
          style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface)" }}>
          <DialogHeader>
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 className="size-6" />
            </div>
            <DialogTitle className="text-center" style={{ color: "var(--ax-text)" }}>
              Delete &quot;{deleteMsg?.title}&quot;?
            </DialogTitle>
            <DialogDescription className="text-center" style={{ color: "var(--ax-muted)" }}>
              This action cannot be undone. The message will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteMsg(null)}
              className="rounded-xl"
              style={{ borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            >
              Cancel
            </Button>
            <DeleteConfirmButton
              materialId={deleteMsg?._id || ""}
              onDeleted={(id) => {
                setMessages((prev) => prev.filter((m) => m._id !== id));
                setDeleteMsg(null);
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Create Material Dialog ──────────────────────────────────────────────── */

function CreateMaterialDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onCreated: () => void;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const roleOptions = [
    { label: "Students", value: "student" },
    { label: "Teachers", value: "teacher" },
  ];

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          expiresAt,
          targetRoles: isAdmin ? targetRoles : [],
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Message sent!");
      setTitle("");
      setContent("");
      setExpiresAt(undefined);
      setTargetRoles([]);
      onOpenChange(false);
      onCreated();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl"
        style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface)" }}>
        <DialogHeader>
          <DialogTitle className="text-lg" style={{ color: "var(--ax-text)" }}>New Message</DialogTitle>
          <DialogDescription style={{ color: "var(--ax-muted)" }}>
            Compose and send a message to selected roles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title"
              disabled={submitting}
              className="mt-1.5 rounded-xl"
              style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)" }}
            />
          </div>

          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              disabled={submitting}
              className="mt-1.5 rounded-xl"
              style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)" }}
            />
          </div>

          {isAdmin && (
            <div>
              <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Target Roles</Label>
              <div className="mt-1.5">
                <MultiSelect
                  selected={targetRoles}
                  options={roleOptions}
                  onChange={(val) => {
                    if (val.length <= roleOptions.length) setTargetRoles(val);
                  }}
                  placeholder="Select target roles"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>
              Expiration Date <span style={{ color: "var(--ax-faint)" }}>(optional)</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              className="mt-1.5 w-full justify-start rounded-xl text-left font-normal"
              style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)", color: "var(--ax-muted)" }}
              onClick={() => setCalendarOpen(true)}
              disabled={submitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className="rounded-xl text-white shadow-sm hover:opacity-90"
            style={{ background: "var(--ax-purple)" }}
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </div>
            ) : (
              <>
                <Send className="mr-1.5 size-4" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>

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
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit Material Dialog ─────────────────────────────────────────────────── */

function EditMaterialDialog({
  material,
  open,
  onOpenChange,
  onUpdated,
}: {
  material: Material;
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState(material.title);
  const [content, setContent] = useState(material.content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(material.title);
      setContent(material.content);
    }
  }, [open, material]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/materials/${material._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Message updated!");
      onOpenChange(false);
      onUpdated();
    } catch {
      toast.error("Failed to update message");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl"
        style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface)" }}>
        <DialogHeader>
          <DialogTitle className="text-lg" style={{ color: "var(--ax-text)" }}>Edit Message</DialogTitle>
          <DialogDescription style={{ color: "var(--ax-muted)" }}>
            Update the title and content below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              className="mt-1.5 rounded-xl"
              style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)" }}
              autoFocus
            />
          </div>
          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={saving}
              rows={5}
              className="mt-1.5 rounded-xl"
              style={{ borderColor: "var(--ax-border)", background: "var(--ax-surface-soft)" }}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl text-white hover:opacity-90"
              style={{ background: "var(--ax-purple)" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Delete Confirm Button ────────────────────────────────────────────────── */

function DeleteConfirmButton({
  materialId,
  onDeleted,
}: {
  materialId: string;
  onDeleted: (_id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/materials/${materialId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Message deleted!");
      onDeleted(materialId);
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-xl bg-red-600 text-white hover:bg-red-700"
    >
      {deleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
