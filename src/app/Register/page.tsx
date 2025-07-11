"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useClientAuth } from "../hooks/UseClientAuth";

type FormData = {
  classId?: string;
  role: string;
  name: string;
  RegNo: string;
};

interface RegisterProps {
  onSuccess?: () => void;
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

export default function Register({ onSuccess }: RegisterProps) {
  const { status, session } = useClientAuth();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    classId: "",
    role: "",
    name: "",
    RegNo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const getClassSuggestions = (input: string): string[] => {
    const normalized = normalizeClassId(input);
    return VALID_CLASS_IDS.filter((id) =>
      id.toLowerCase().startsWith(normalized.toLowerCase())
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.RegNo) newErrors.RegNo = "Registration number is required";

    const isAdmin = session?.user?.role === "admin";
    if (!isAdmin || (isAdmin && formData.role !== "admin")) {
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
      const isAdmin = session?.user?.role === "admin";
      const normalizedClassId = normalizeClassId(formData.classId || "");

      const payload: FormData = {
        ...formData,
        role: isAdmin ? formData.role : "student",
        classId: isAdmin ? normalizedClassId : session?.user?.classId || "",
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

      toast.success("User registered successfully!");
      setFormData({ classId: "", role: "", name: "", RegNo: "" });
    if (onSuccess) onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  if (status === "loading") {
    return <div>.</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
          <PlusCircle className="mr-2" /> Register
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Register User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="RegNo">Registration No.</Label>
            <Input name="RegNo" value={formData.RegNo} onChange={handleChange} />
            {errors.RegNo && <p className="text-sm text-red-500">{errors.RegNo}</p>}
          </div>

          {session?.user?.role === "admin" && (
            <>
              <div>
                <Label htmlFor="classId">Class ID</Label>
                <Input
                  name="classId"
                  autoComplete="off"
                  value={formData.classId}
                  onChange={handleChange}
                  list="class-suggestions"
                />
                <datalist id="class-suggestions">
                  {getClassSuggestions(formData.classId || "").map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
                {errors.classId && (
                  <p className="text-sm text-red-500">{errors.classId}</p>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={handleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
