
export interface FrontendUser {
  name: string;
  RegNo: string;
  role: 'student' | 'teacher' | 'admin';
  classId: string;
  department: string | null;
  courses: string[];
  courseRegistrationDate?: string | Date;
}
