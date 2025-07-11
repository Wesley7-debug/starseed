'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  initial: {
    courseId: string;
    subject: string;
    department: string | null; // allow null here
  };
  onClose: () => void;
  onSave: (subject: string, department: string | null) => void;
  loading: boolean;
}

export function EditCourseModal({ open, initial, onClose, onSave, loading }: Props) {
  const [subject, setSubject] = useState(initial.subject);
  const [department, setDepartment] = useState(initial.department || '');

  useEffect(() => {
    if (open) {
      setSubject(initial.subject);
      setDepartment(initial.department || '');
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course {initial.courseId}</DialogTitle>
          <DialogDescription>
            Modify the course details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
 <Label htmlFor="subject">Subject</Label>
<Input
  id="subject"
  value={subject}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
/>

          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger aria-label="Select Department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Department</SelectLabel>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="art">Art</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!subject || loading}
            onClick={() => onSave(subject, department || null)}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
