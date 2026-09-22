"use client";

import { Clock, Construction } from "lucide-react";
import PageHeader from "@/components/reusable/PageHeader";

export default function Commingsoon() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:px-8 lg:py-7">
      <PageHeader
        title="Coming Soon"
        description="This feature is under development"
        icon={<Clock className="size-5" />}
      />

      <div className="ax-card flex flex-col items-center justify-center py-24 gap-6">
        <div className="grid size-20 place-items-center rounded-3xl bg-[#f0ebff] text-[#8c6be8]">
          <Construction className="size-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#1f2130]">
            Under Construction
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[#777489]">
            We&apos;re working hard to bring you this feature. Stay tuned for updates!
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#f0ebff] px-5 py-2.5">
          <div className="size-2 rounded-full bg-[#8c6be8] animate-pulse" />
          <span className="text-sm font-medium text-[#8c6be8]">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
