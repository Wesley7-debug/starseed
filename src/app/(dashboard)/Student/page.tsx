import StuCard from "./Studentpages/StuPages/StuCard";
import StuFooter from "./Studentpages/StuPages/StuFooter";
import { StuGraph } from "./Studentpages/StuPages/StuGraph";
import DashboardWelcome from "@/components/reusable/DashboardWelcome";
import PageHeader from "@/components/reusable/PageHeader";
import { GraduationCap } from "lucide-react";

export default function StudentPages() {
  return (
    <div className="mx-auto max-w-[1500px] flex flex-col gap-6 p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Student Dashboard"
        description="Track your courses and academic progress"
        icon={<GraduationCap className="size-5" />}
      />
      <DashboardWelcome />
      <StuCard />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <StuGraph />
        <StuFooter />
      </div>
    </div>
  );
}
