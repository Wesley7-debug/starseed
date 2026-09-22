"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  admin: { label: "Admins", color: "var(--ax-purple)" },
  teacher: { label: "Teachers", color: "#5d9dec" },
  student: { label: "Students", color: "#55b985" },
} satisfies ChartConfig;

type ChartDataItem = {
  role: keyof typeof chartConfig;
  count: number;
};

export function AdminChartBar() {
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("admin");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch users");
        const { data: users } = await res.json();

        const counts = { admin: 0, teacher: 0, student: 0 } as Record<string, number>;
        users.forEach(({ role }: { role: string }) => {
          if (role in counts) counts[role]++;
        });

        const data = (["admin", "teacher", "student"] as const).map(
          (role) => ({ role, count: counts[role] || 0 })
        );
        setChartData(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="ax-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--ax-border)" }}>
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
            User Roles Overview
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ax-muted)" }}>
            Distribution of users by role
          </p>
        </div>
        <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--ax-surface-soft)" }}>
          {chartData.map(({ role, count }) => (
            <button
              key={role}
              data-active={activeChart === role}
              onClick={() => setActiveChart(role)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                color: activeChart === role ? "var(--ax-text)" : "var(--ax-muted)",
                background: activeChart === role ? "var(--ax-surface)" : "transparent",
                boxShadow: activeChart === role ? "var(--ax-shadow)" : "none",
              }}
            >
              <span className="hidden sm:inline">{chartConfig[role].label}</span>
              <span className="sm:hidden">{chartConfig[role].label.charAt(0)}</span>
              <span className="ml-1.5" style={{ color: "var(--ax-faint)" }}>{count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2" style={{ borderColor: "var(--ax-border)", borderTopColor: "var(--ax-purple)" }} />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid vertical={false} className="ax-grid" />
              <XAxis
                dataKey="role"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label ?? value
                }
                style={{ fontSize: 12, fill: "var(--ax-muted)" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label ?? value
                    }
                  />
                }
              />
              <Bar
                dataKey="count"
                fill={chartConfig[activeChart].color}
                radius={[6, 6, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
