import DashboardLayout from '@/components/reusable/DashboardLayout';

export default async function AdminDashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout allowedRoles={['admin']}>{children}</DashboardLayout>;
}
