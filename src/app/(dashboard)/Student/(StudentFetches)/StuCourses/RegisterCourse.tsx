'use client';

import { useEffect, useState } from 'react';
import DepartmentModal from './DepartmentModal';  
import RegisteredCoursesTable from './CourseTable';
import CourseRegistrationModal from './CourseRegistartion';
import { Button } from '@/components/ui/button';
import useUserCourses from '@/app/hooks/Use-Usercourse';

export default function RegistrationGuard() {
  const { user, courses, loading, error, refetch } = useUserCourses();

  const [needsDepartment, setNeedsDepartment] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [hideRegisterButton, setHideRegisterButton] = useState(false);
  const [isSenior, setIsSenior] = useState(false);

  useEffect(() => {
    if (!user) return;

    const classId = (user.classId ?? '').trim().toUpperCase();
    const senior = ['SS-1', 'SS-2', 'SS-3'].includes(classId);
    const hasDepartment = !!user.department;

    setIsSenior(senior);
    setNeedsDepartment(senior && !hasDepartment);

    // Course registration cooldown
    const lastReg = localStorage.getItem('lastCourseRegistration');
    if (lastReg) {
      const diffDays = (Date.now() - parseInt(lastReg, 10)) / (1000 * 60 * 60 * 24);
      if (diffDays < 96) {
        setHideRegisterButton(true);
      }
    } else {
      setHideRegisterButton(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!user) return <div>Not found</div>;

  return (
    <>
      {/* Show department selection UI for seniors without department */}
      {needsDepartment && (
        <>
          
          <DepartmentModal
            user={user}
            onSet={async () => {
              setNeedsDepartment(false);
              await refetch();
            }}
          />
        </>
      )}

      {/* Show register button and courses for all non-seniors, and for seniors with a department */}
      {!needsDepartment && (
        <>
          {(!isSenior || (isSenior && user.department)) && !hideRegisterButton && (
            <Button className="mb-4" onClick={() => setShowCourseModal(true)}>
              Register Courses
            </Button>
          )}

          {showCourseModal && (
            <CourseRegistrationModal
              user={user}
              open={showCourseModal}
              onOpenChange={setShowCourseModal}
              onRegister={() => {
                setShowCourseModal(false);
                setHideRegisterButton(true);
                localStorage.setItem('lastCourseRegistration', Date.now().toString());
                refetch();
              }}
            />
          )}

          <RegisteredCoursesTable courses={courses} />
        </>
      )}
    </>
  );
}
