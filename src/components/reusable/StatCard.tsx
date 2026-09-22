"use client";

import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "lavender" | "mint" | "peach" | "yellow";
  trend?: { value: string; positive: boolean };
  className?: string;
}

const variantStyles = {
  lavender: "ax-stat-lavender",
  mint: "ax-stat-mint",
  peach: "ax-stat-peach",
  yellow: "ax-stat-yellow",
} as const;

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "lavender",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={`ax-card ax-stat p-5 ${variantStyles[variant]} ${className ?? ""}`}
    >
      <div className="ax-stat-icon mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[1px]" style={{ color: "var(--ax-muted)" }}>
        {title}
      </p>
      <p className="text-[24px] font-[550] tracking-[-0.045em]" style={{ color: "var(--ax-text)" }}>
        {value}
      </p>
      {(description || trend) && (
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span
              className="text-[11px] font-semibold"
              style={{ color: trend.positive ? "var(--ax-green)" : "#ef4444" }}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
          {description && (
            <p className="text-[11px]" style={{ color: "var(--ax-faint)" }}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
