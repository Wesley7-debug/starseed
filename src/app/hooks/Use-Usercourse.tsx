'use client';

import { useEffect, useState } from 'react';

interface Course {
  courseId: string;
  subject: string;
  department: string;
  classId: string;
}

interface User {
  name: string;
  RegNo: string;
  role: 'student' | 'teacher' | 'admin';
  classId: string;
  department: string | null;
  courses: string[];
  courseRegistrationDate?: string;
}

interface ReturnType {
  user: User | null;
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function useUserCourses(): ReturnType {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/me');
      

      if (!res.ok) throw new Error('Failed to fetch user data');

      const data = await res.json();
      console.log('user data:', data);
  setUser(data.user);           
setCourses(data.courses || []);
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('Unknown error');
  }
}
finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { user, courses, loading, error, refetch: fetchData };
}
