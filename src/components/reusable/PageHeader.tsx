"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className="flex size-10 items-center justify-center rounded-xl"
            style={{ background: "var(--ax-purple-soft)", color: "var(--ax-purple)" }}
          >
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl lg:text-5xl font-bold tracking-tight sm:text-6xl" style={{ color: "var(--ax-text)" }}>
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm" style={{ color: "var(--ax-muted)" }}>{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="mt-3 sm:mt-0">{actions}</div>}
    </div>
  );
}
