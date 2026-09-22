import AdminDashboardCard from "./Admpages/AdmCharts/Card";
import { AdminChartBar } from "./Admpages/AdmCharts/GratChart";
import AdminUserTable from "./Admpages/AdmCharts/AdminUser";
import DashboardWelcome from "@/components/reusable/DashboardWelcome";
import PageHeader from "@/components/reusable/PageHeader";
import { Shield, TrendingUp } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1500px] flex flex-col gap-6 p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your school management system"
        icon={<Shield className="size-5" />}
        actions={
          <div className="flex items-center gap-2 rounded-xl bg-[#f0ebff] px-4 py-2">
            <TrendingUp className="size-4 text-[#8c6be8]" />
            <span className="text-sm font-medium text-[#1f2130]">System Active</span>
          </div>
        }
      />
      <DashboardWelcome />
      <AdminDashboardCard />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AdminChartBar />
        <AdminUserTable />
      </div>
    </div>
  );
}
