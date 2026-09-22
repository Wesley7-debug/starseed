"use client";

import { CreditCard, Calendar, ArrowUpRight, Sparkles } from "lucide-react";

export default function StuFooter() {
  return (
    <div className="space-y-4">
      {/* School Fees Card */}
      <div className="ax-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#f0ebff] text-[#8c6be8]">
            <CreditCard className="size-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#1f2130]">
              School Fees
            </h3>
            <p className="text-xs text-[#777489]">Manage your payments</p>
          </div>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-[#777489]">
          Open your mail to contact the school for payment details and inquiries.
        </p>
        <a
          href="mailto:school@example.com?subject=School Fees Payment&body=I want to pay my fees!"
          className="inline-flex items-center gap-2 rounded-xl bg-[#8c6be8] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#7a5bd4] hover:shadow-md active:scale-[0.98]"
        >
          Contact School
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      {/* Upcoming Events Card */}
      <div className="ax-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#f0ebff] text-[#8c6be8]">
            <Calendar className="size-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#1f2130]">
              Upcoming Events
            </h3>
            <p className="text-xs text-[#777489]">What&apos;s coming up</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { event: "School Party", date: "25 July", icon: Sparkles },
            { event: "Resumption", date: "8 Sept", icon: Calendar },
            { event: "Exam Week", date: "20 Oct", icon: Calendar },
          ].map((item) => (
            <div
              key={item.event}
              className="flex items-center justify-between rounded-xl bg-[#faf8ff] px-3.5 py-3 transition-colors hover:bg-[#f0ebff]"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid size-7 place-items-center rounded-lg bg-[#f0ebff] text-[#8c6be8]">
                  <item.icon className="size-3.5" />
                </div>
                <span className="text-sm font-medium text-[#1f2130]">
                  {item.event}
                </span>
              </div>
              <span className="text-xs text-[#777489]">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
