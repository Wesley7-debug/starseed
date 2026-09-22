import { TeacherCharts } from "./TeacherPages/TeacherBody/TeacherCharts";
import TeacherTableCard from "./TeacherPages/TeacherBody/TeacherCard";
import DashboardWelcome from "@/components/reusable/DashboardWelcome";
import PageHeader from "@/components/reusable/PageHeader";
import { BookOpen } from "lucide-react";

export default function TeacherDashBoardPages() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Teacher Dashboard"
        description="Manage your students and courses"
        icon={<BookOpen className="size-5" />}
      />
      <DashboardWelcome />
      <TeacherCharts />
      <TeacherTableCard />
    </div>
  );
}
