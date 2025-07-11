import { useState, useEffect } from "react";

interface Student {
  name: string;
  RegNo: string;
  classId: string;
  avatarUrl: string;
}

interface CourseStudents {
  course: string;
  classId: string;
  department?: string;
  students: Student[];
}

interface UseSpecialCoursesParams {
  teacherId: string;
  courses?: string[]; // optional filtering
}

export function useSpecialCourses({ teacherId, courses }: UseSpecialCoursesParams) {
  const [data, setData] = useState<CourseStudents[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = courses?.length ? `?courses=${courses.join(",")}` : "";
        const res = await fetch(`/api/teacher/${teacherId}/special-courses${query}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }

        const result = await res.json();
        setData(result.students || []);
      } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error occurred");
  }
}
 finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId, courses]);

  return { data, loading, error };
}
