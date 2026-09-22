"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useClientAuth } from "@/hooks/UseClientAuth";
import { Pencil } from "lucide-react";

type FormData = {
  classId: string;
  role: string;
  name: string;
  RegNo: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type EditUserProps = {
  id: string | number;
  name: string;
  classId: string;
  role: string;
  RegNo: string;
  onSuccess?: () => void;
  hidden?: boolean;
};

const VALID_CLASS_IDS = [
  "Pre-nursery",
  "Nursery-1", "Nursery-2", "Nursery-3",
  "Primary-1", "Primary-2", "Primary-3", "Primary-4", "Primary-5", "Primary-6",
  "Jss-1", "Jss-2", "Jss-3",
  "Ss-1", "Ss-2", "Ss-3",
];

const normalizeClassId = (value: string): string => {
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleaned.startsWith("prenursery")) return "Pre-nursery";
  if (cleaned.startsWith("nursery")) return `Nursery-${cleaned.slice(7)}`;
  if (cleaned.startsWith("primary")) return `Primary-${cleaned.slice(7)}`;
  if (cleaned.startsWith("jss")) return `Jss-${cleaned.slice(3)}`;
  if (cleaned.startsWith("ss")) return `Ss-${cleaned.slice(2)}`;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Administrator",
};

export default function EditUser({
  id,
  name,
  classId,
  role,
  RegNo,
  onSuccess,
  hidden,
}: EditUserProps) {
  const { status, session } = useClientAuth();
  const [open, setOpen] = useState(false);

  if (hidden) return null;
  const [editFormData, setEditFormData] = useState<FormData>({
    name: "",
    classId: "",
    role: "",
    RegNo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEditFormData({ name, classId, role, RegNo });
    }
  }, [open, name, classId, role, RegNo]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: field, value } = e.target;
    if (field === "classId") {
      const normalized = normalizeClassId(value);
      setEditFormData({ ...editFormData, [field]: normalized });
    } else {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const handleSelect = (value: string) => {
    setEditFormData({ ...editFormData, role: value });
  };

  const getClassSuggestions = (input: string): string[] => {
    if (!input) return [];
    const normalized = normalizeClassId(input);
    return VALID_CLASS_IDS.filter((id) =>
      id.toLowerCase().startsWith(normalized.toLowerCase())
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!editFormData.name) newErrors.name = "Name is required";
    if (!editFormData.RegNo) newErrors.RegNo = "Registration number is required";
    if (session?.user?.role === "admin") {
      if (!editFormData.role) newErrors.role = "Role is required";
      if (!editFormData.classId) {
        newErrors.classId = "Class ID is required";
      } else if (!VALID_CLASS_IDS.includes(editFormData.classId)) {
        newErrors.classId = "Invalid class ID";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const isAdmin = session?.user?.role === "admin";
    const payload: FormData = {
      ...editFormData,
      role: isAdmin ? editFormData.role : "student",
      classId: isAdmin ? editFormData.classId : session?.user?.classId || "",
    };

    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      toast.success("User updated successfully!");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="grid size-8 place-items-center rounded-lg transition-colors hover:bg-[var(--ax-purple-soft)] hover:text-[var(--ax-purple)]"
          style={{ color: "var(--ax-faint)" }}
          aria-label="Edit user"
        >
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl" style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface)" }}>
        <DialogHeader>
          <DialogTitle className="text-lg" style={{ color: "var(--ax-text)" }}>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEdit} className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Name</Label>
            <Input
              name="name"
              value={editFormData.name}
              onChange={handleChange}
              className="mt-1.5 rounded-xl"
              style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface-soft)" }}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Registration No.</Label>
            <div className="mt-1.5 rounded-xl border px-4 py-2.5 font-mono text-sm" style={{ borderColor: "var(--ax-border)", backgroundColor: "#f3f1f8", color: "var(--ax-muted)" }}>
              {editFormData.RegNo || RegNo}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--ax-faint)" }}>
              {ROLE_LABEL[editFormData.role] || editFormData.role} &middot; Read-only
            </p>
            {errors.RegNo && <p className="mt-1 text-sm text-red-500">{errors.RegNo}</p>}
          </div>

          {session?.user?.role === "admin" && (
            <>
              <div>
                <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Class ID</Label>
                <Input
                  name="classId"
                  value={editFormData.classId}
                  onChange={handleChange}
                  autoComplete="off"
                  list="class-suggestions-edit"
                  className="mt-1.5 rounded-xl"
                  style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface-soft)" }}
                />
                <datalist id="class-suggestions-edit">
                  {getClassSuggestions(editFormData.classId).map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
                {errors.classId && (
                  <p className="mt-1 text-sm text-red-500">{errors.classId}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Role</Label>
                <Select value={editFormData.role} onValueChange={handleSelect}>
                  <SelectTrigger className="mt-1.5 rounded-xl" style={{ borderColor: "var(--ax-border)", backgroundColor: "var(--ax-surface-soft)" }}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl text-white hover:opacity-90"
            style={{ backgroundColor: "var(--ax-purple)" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
