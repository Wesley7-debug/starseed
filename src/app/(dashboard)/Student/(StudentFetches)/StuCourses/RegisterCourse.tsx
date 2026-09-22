'use client';

import { useEffect, useState } from 'react';
import DepartmentModal from './DepartmentModal';
import RegisteredCoursesTable from './CourseTable';
import CourseRegistrationModal from './CourseRegistartion';
import { Button } from '@/components/ui/button';
import useUserCourses from '@/hooks/Use-Usercourse';
import PageHeader from '@/components/reusable/PageHeader';
import { BookCopy, Plus } from 'lucide-react';

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
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:px-8 lg:py-7 space-y-6">
      <PageHeader
        title="My Courses"
        description="View and register for courses"
        icon={<BookCopy className="size-5" />}
        actions={
          !needsDepartment &&
          (!isSenior || (isSenior && user.department)) &&
          !hideRegisterButton ? (
            <Button
              onClick={() => setShowCourseModal(true)}
              className="rounded-xl bg-[#8c6be8] text-white hover:bg-[#7a5bd4] shadow-sm"
            >
              <Plus className="mr-1.5 size-4" />
              Register Courses
            </Button>
          ) : undefined
        }
      />

      {needsDepartment && (
        <DepartmentModal
          user={user}
          onSet={async () => {
            setNeedsDepartment(false);
            await refetch();
          }}
        />
      )}

      {!needsDepartment && (
        <>
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
    </div>
  );
}
