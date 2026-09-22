import DashboardLayout from '@/components/reusable/DashboardLayout';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout allowedRoles={['student']}>{children}</DashboardLayout>;
}
