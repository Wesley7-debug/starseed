"use client";

import { useState, useEffect } from "react";
import { Users, Presentation, GraduationCap, TrendingUp } from "lucide-react";
import StatCard from "@/components/reusable/StatCard";

interface User {
  _id: string;
  role: string;
}

export default function AdminDashboardCard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch users");
        const json = await res.json();
        setUsers(json.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const teacherCount = users.filter((u) => u.role === "teacher").length;
  const studentCount = users.filter((u) => u.role === "student").length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="ax-card ax-stat animate-pulse p-5"
            style={{ minHeight: 156 }}
          >
            <div className="ax-stat-icon mb-3" style={{ background: "var(--ax-surface-soft)" }} />
            <div className="mb-1 h-3 w-20 rounded" style={{ background: "var(--ax-surface-soft)" }} />
            <div className="h-7 w-16 rounded" style={{ background: "var(--ax-surface-soft)" }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="ax-card p-4 text-sm" style={{ color: "#ef4444" }}>
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={totalUsers.toLocaleString()}
        icon={Users}
        variant="lavender"
        trend={{ value: "12%", positive: true }}
        description="this month"
      />
      <StatCard
        title="Teachers"
        value={teacherCount.toLocaleString()}
        icon={Presentation}
        variant="mint"
        description="Active educators"
      />
      <StatCard
        title="Students"
        value={studentCount.toLocaleString()}
        icon={GraduationCap}
        variant="peach"
        description="Enrolled learners"
      />
      <StatCard
        title="Growth"
        value="+12%"
        icon={TrendingUp}
        variant="yellow"
        description="vs last month"
      />
    </div>
  );
}
