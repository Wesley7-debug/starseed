import DashboardLayout from '@/components/reusable/DashboardLayout';

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout allowedRoles={['teacher']}>{children}</DashboardLayout>;
}
