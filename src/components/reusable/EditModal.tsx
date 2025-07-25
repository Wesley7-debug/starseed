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

import { useClientAuth } from "../../app/hooks/UseClientAuth";
import { Pen } from "lucide-react";

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

export default function EditUser({
  id,
  name,
  classId,
  role,
  RegNo,
  onSuccess
}: EditUserProps) {
  const { status, session } = useClientAuth();

  const [open, setOpen] = useState(false);
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
      setEditFormData({
        name,
        classId,
        role,
        RegNo,
      });
    }
  }, [open, name, classId, role, RegNo]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "classId") {
      const normalized = normalizeClassId(value);
      setEditFormData({ ...editFormData, [name]: normalized });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
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

  if (status === "loading") return <div>Loading...</div>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit p-3' variant="outline" size="icon">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEdit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={editFormData.name} onChange={handleChange} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="RegNo">Registration Number</Label>
            <Input name="RegNo" value={editFormData.RegNo} onChange={handleChange} />
            {errors.RegNo && <p className="text-sm text-red-500">{errors.RegNo}</p>}
          </div>

          {session?.user?.role === "admin" && (
            <>
              <div>
                <Label htmlFor="classId">Class ID</Label>
                <Input
                  name="classId"
                  value={editFormData.classId}
                  onChange={handleChange}
                  autoComplete="off"
                  list="class-suggestions"
                />
                <datalist id="class-suggestions">
                  {getClassSuggestions(editFormData.classId).map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
                {errors.classId && <p className="text-sm text-red-500">{errors.classId}</p>}
              </div>

              <div>
                <Label>Role</Label>
                <Select value={editFormData.role} onValueChange={handleSelect}>
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
            {loading ? "Editting..." : "Edit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
