import DashboardLayout from '@/components/reusable/DashboardLayout';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={['admin', 'teacher', 'student']}>
      {children}
    </DashboardLayout>
  );
}
