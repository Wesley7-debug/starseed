"use client";

import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import { useClientAuth } from "@/hooks/UseClientAuth";

type FormData = {
  classId?: string;
  role: string;
  name: string;
  RegNo: string;
};

interface RegisterProps {
  onSuccess?: () => void;
  forcedRole?: "student" | "teacher" | "admin";
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const VALID_CLASS_IDS = [
  "Pre-nursery",
  "Nursery-1", "Nursery-2", "Nursery-3",
  "Primary-1", "Primary-2", "Primary-3", "Primary-4", "Primary-5", "Primary-6",
  "Jss-1", "Jss-2", "Jss-3",
  "Ss-1", "Ss-2", "Ss-3",
  "None"
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

const ROLE_PREFIX: Record<string, string> = {
  student: "STU",
  teacher: "TCH",
  admin: "ADM",
};

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

function generateRegNo(role: string): string {
  const prefix = ROLE_PREFIX[role] || "USR";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

export default function Register({ onSuccess, forcedRole }: RegisterProps) {
  const { status, session } = useClientAuth();
  const isAdmin = session?.user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    classId: "",
    role: "",
    name: "",
    RegNo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const effectiveRole = forcedRole || (isAdmin ? formData.role : "student") || "student";
  const currentPrefix = ROLE_PREFIX[effectiveRole] || "STU";
  const showRoleDropdown = isAdmin && !forcedRole;

  const dialogTitle = forcedRole
    ? `Register ${ROLE_LABELS[forcedRole]}`
    : isAdmin
      ? "Register User"
      : "Register Student";

  const dialogDescription = forcedRole
    ? `Add a new ${ROLE_LABELS[forcedRole].toLowerCase()} to the system.`
    : isAdmin
      ? "Create a new account for a student, teacher, or admin."
      : "Add a new student to your class.";

  const handleGenerateRegNo = useCallback(
    (role?: string) => {
      const r = role || effectiveRole;
      setFormData((prev) => ({ ...prev, RegNo: generateRegNo(r) }));
      setErrors((prev) => ({ ...prev, RegNo: undefined }));
    },
    [effectiveRole]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value, RegNo: generateRegNo(value) }));
  };

  const getClassSuggestions = (input: string): string[] => {
    const normalized = normalizeClassId(input);
    return VALID_CLASS_IDS.filter((id) =>
      id.toLowerCase().startsWith(normalized.toLowerCase())
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (showRoleDropdown && !formData.role) newErrors.role = "Role is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.RegNo) newErrors.RegNo = "Registration number is required";

    if (effectiveRole !== "admin") {
      if (!formData.classId) {
        newErrors.classId = "Class ID is required";
      } else if (!VALID_CLASS_IDS.includes(normalizeClassId(formData.classId))) {
        newErrors.classId = "Invalid class ID";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const normalizedClassId = normalizeClassId(formData.classId || "");

      const payload: FormData = {
        ...formData,
        role: effectiveRole,
        classId: effectiveRole === "admin" ? "" : showRoleDropdown ? normalizedClassId : session?.user?.classId || "",
      };

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to register user.");
      }

      toast.success(`${ROLE_LABELS[effectiveRole]} registered successfully!`);
      setFormData({ classId: "", role: "", name: "", RegNo: "" });
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val && !formData.RegNo) handleGenerateRegNo();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-xl bg-[var(--ax-purple)] text-white hover:opacity-90 shadow-sm"
        >
          <Plus className="mr-2 size-4" />
          Register {forcedRole ? ROLE_LABELS[forcedRole] : ""}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-2xl" style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)" }}>
        <DialogHeader>
          <DialogTitle className="text-lg" style={{ color: "var(--ax-text)" }}>
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: "var(--ax-muted)" }}>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Full Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="mt-1.5 rounded-xl"
              style={{ background: "var(--ax-surface-soft)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {showRoleDropdown && (
            <div>
              <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Role</Label>
              <Select value={formData.role} onValueChange={handleSelect}>
                <SelectTrigger className="mt-1.5 rounded-xl" style={{ background: "var(--ax-surface-soft)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent style={{ background: "var(--ax-surface)", borderColor: "var(--ax-border)" }}>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
            </div>
          )}

          <div>
            <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Registration No.</Label>
            <div className="mt-1.5 flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "var(--ax-purple)" }}>
                  {currentPrefix}-
                </span>
                <Input
                  name="RegNo"
                  value={formData.RegNo.replace(`${currentPrefix}-`, "")}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 5).toUpperCase();
                    setFormData((prev) => ({
                      ...prev,
                      RegNo: `${currentPrefix}-${raw}`,
                    }));
                  }}
                  placeholder="XXXXX"
                  className="pl-14 rounded-xl font-mono tracking-wider"
                  style={{ background: "var(--ax-surface-soft)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleGenerateRegNo()}
                className="shrink-0 rounded-xl"
                style={{ borderColor: "var(--ax-border)" }}
                title="Generate new registration number"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--ax-faint)" }}>
              Auto-generated: <span className="font-mono font-semibold" style={{ color: "var(--ax-purple)" }}>{formData.RegNo || "???"}</span>
            </p>
            {errors.RegNo && <p className="mt-1 text-sm text-red-500">{errors.RegNo}</p>}
          </div>

          {effectiveRole !== "admin" && (
            showRoleDropdown ? (
              <div>
                <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Class ID</Label>
                <Input
                  name="classId"
                  autoComplete="off"
                  value={formData.classId}
                  onChange={handleChange}
                  list="class-suggestions"
                  placeholder="e.g. Jss-1, Ss-2, Primary-3"
                  className="mt-1.5 rounded-xl"
                  style={{ background: "var(--ax-surface-soft)", borderColor: "var(--ax-border)", color: "var(--ax-text)" }}
                />
                <datalist id="class-suggestions">
                  {getClassSuggestions(formData.classId || "").map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
                {errors.classId && <p className="mt-1 text-sm text-red-500">{errors.classId}</p>}
              </div>
            ) : (
              <div>
                <Label className="text-sm font-medium" style={{ color: "var(--ax-text)" }}>Class</Label>
                <Input
                  value={session?.user?.classId || ""}
                  disabled
                  className="mt-1.5 rounded-xl cursor-not-allowed"
                  style={{ background: "var(--ax-surface-soft)", borderColor: "var(--ax-border)", color: "var(--ax-muted)" }}
                />
                <p className="mt-1 text-xs" style={{ color: "var(--ax-faint)" }}>
                  Auto-assigned from your class
                </p>
              </div>
            )
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--ax-purple)] text-white hover:opacity-90"
          >
            {loading ? "Registering..." : `Register ${ROLE_LABELS[effectiveRole]}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
