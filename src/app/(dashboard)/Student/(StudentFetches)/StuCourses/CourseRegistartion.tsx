'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FrontendUser } from '@/app/types/frontendUser';

interface Course {
  courseId: string;
  subject: string;
  department: string | null;
  classId: string;
}

interface CourseRegistrationModalProps {
  user: FrontendUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => void;
}

export default function CourseRegistrationModal({
  user,
  open,
  onOpenChange,
  onRegister,
}: CourseRegistrationModalProps) {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const query = new URLSearchParams({
          classId: user.classId || '',
          department: user.department || '',
        });

        const res = await fetch(`/api/select-courses?${query.toString()}`);
        if (!res.ok) throw new Error('Failed to load courses');

        const data = await res.json();
        setAvailableCourses(data.courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    fetchCourses();
  }, [user]);

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleRegisterClick = () => {
    if (selectedCourses.length === 0) {
      setError('Please select at least one course.');
      return;
    }
    setError(null);
    setShowConfirm(true);
  };

  const handleConfirmRegister = async () => {
    if (nameInput.trim().toLowerCase() !== user.name.toLowerCase()) {
      setError('Name does not match. Please enter your correct full name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/select-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: user.department,
          courses: selectedCourses,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to register courses');
      }

      onRegister();
      onOpenChange(false); // close modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Register Your Courses</DialogTitle>
          <DialogDescription>
            Select the courses you wish to register. Required subjects will be marked in red.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 border rounded p-2 max-h-60 overflow-auto">
          {availableCourses.length === 0 && <p>No courses available for registration.</p>}

          {availableCourses.map(({ courseId, subject }) => {
            const isRequired = ['ENGLISH', 'MATH', ' MATH'].includes(subject.toUpperCase());
            const isSelected = selectedCourses.includes(courseId);

            return (
              <div
                key={courseId}
                onClick={() => toggleCourse(courseId)}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                  isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-semibold">{courseId.toUpperCase()}</p>
                  <p className="text-sm text-gray-600">{subject}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${
                    isRequired ? 'bg-red-600' : 'bg-green-600'
                  }`}
                >
                  {isRequired ? 'Required' : 'Optional'}
                </span>
              </div>
            );
          })}
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {!showConfirm ? (
          <DialogFooter>
            <Button onClick={handleRegisterClick} disabled={loading} className="w-full">
              Register Selected Courses
            </Button>
          </DialogFooter>
        ) : (
          <>
            <p className="text-sm mb-2">
              Course registration <strong>cannot be changed</strong>. Enter your full name to confirm:
            </p>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter full name"
              disabled={loading}
              className="mb-4"
            />
            <DialogFooter>
              <Button onClick={handleConfirmRegister} disabled={loading} className="w-full">
                {loading ? 'Registering...' : 'Confirm Registration'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
