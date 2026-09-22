"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", desktop: 222 },
  { date: "2024-04-02", desktop: 97 },
  { date: "2024-04-03", desktop: 167 },
  { date: "2024-04-04", desktop: 242 },
  { date: "2024-04-05", desktop: 373 },
  { date: "2024-04-06", desktop: 301 },
];

const chartConfig = {
  desktop: {
    label: "Activity",
    color: "var(--ax-purple)",
  },
} satisfies ChartConfig;

export function StuGraph() {
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.desktop, 0),
    []
  );

  return (
    <div className="ax-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--ax-border)" }}>
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: "var(--ax-text)" }}>
            Activity Overview
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: "var(--ax-muted)" }}>
            Your learning activity over time
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ background: "var(--ax-surface-soft)" }}>
          <span className="text-xs" style={{ color: "var(--ax-muted)" }}>Total</span>
          <span className="text-lg font-bold" style={{ color: "var(--ax-text)" }}>
            {total.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid vertical={false} className="ax-grid" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
              style={{ fontSize: 12, fill: "var(--ax-muted)" }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="desktop" fill="var(--ax-purple)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
