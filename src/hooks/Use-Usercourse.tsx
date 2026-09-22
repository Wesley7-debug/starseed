'use client';

import useFetchWithCache from './useFetchWithCache';

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

interface MeResponse {
  user: User;
  courses: Course[];
}

export default function useUserCourses() {
  const { data, loading, error, refetch } = useFetchWithCache<MeResponse>({
    url: '/api/auth/me',
    staleTime: 5 * 60_000,
  });

  return {
    user: data?.user ?? null,
    courses: data?.courses ?? [],
    loading,
    error,
    refetch,
  };
}
