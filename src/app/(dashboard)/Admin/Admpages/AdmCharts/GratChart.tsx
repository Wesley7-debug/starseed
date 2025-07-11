"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "User roles snapshot bar chart";

const chartConfig = {
  admin: { label: "Admins", color: "var(--chart-1)" },
  teacher: { label: "Teachers", color: "var(--chart-2)" },
  student: { label: "Students", color: "var(--chart-3)" },
} satisfies ChartConfig;

type User = {
  _id: string;
  role: "admin" | "teacher" | "student";
};

type ChartDataItem = {
  role: keyof typeof chartConfig;
  count: number;
};

export function AdminChartBar() {
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("admin");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const users: User[] = await res.json();

        // Count users by role
        const counts = { admin: 0, teacher: 0, student: 0 };
        users.forEach(({ role }) => {
          if (role in counts) counts[role]++;
        });

        // Convert to array for chart (one bar per role)
        const data = (Object.keys(counts) as Array<keyof typeof counts>).map(
          (role) => ({ role, count: counts[role] })
        );

        setChartData(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    // Uncomment to refresh every 24 hours
    // const intervalId = setInterval(fetchUsers, 86400000);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>User Roles Snapshot</CardTitle>
          <CardDescription>Current total users per role</CardDescription>
          {loading && (
            <div className="text-sm text-muted-foreground mt-1">Loading...</div>
          )}
        </div>
        <div className="flex">
          {chartData.map(({ role, count }) => (
            <button
              key={role}
              data-active={activeChart === role}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(role)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[role].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
            barCategoryGap="30%"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="role"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig].label}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => chartConfig[value as keyof typeof chartConfig].label}
                />
              }
            />
            <Bar
              dataKey="count"
              fill={chartData.find((d) => d.role === activeChart)?.role
                ? chartConfig[activeChart].color
                : "#8884d8"}
              barSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
