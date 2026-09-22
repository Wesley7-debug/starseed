"use client";

import { useState, useEffect } from "react";
import { BookCopy, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import StatCard from "@/components/reusable/StatCard";

interface Courses {
  subject: string;
  department: string;
}

export default function StuCard() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const res = await fetch("/api/select-courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const json = await res.json();
        setCourses(json.data || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const totalCourses = courses.length;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ax-card ax-stat animate-pulse p-5" style={{ minHeight: 156 }}>
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
        Error loading courses: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Courses"
        value={54}
        icon={BookCopy}
        variant="lavender"
        description="Available courses"
      />
      <StatCard
        title="Enrolled"
        value={totalCourses.toLocaleString()}
        icon={BookOpen}
        variant="mint"
        description="Active courses"
      />
      <StatCard
        title="Mandatory"
        value={4}
        icon={AlertCircle}
        variant="peach"
        description="Must-have courses"
      />
      <StatCard
        title="Performance"
        value="85%"
        icon={TrendingUp}
        variant="yellow"
        trend={{ value: "5%", positive: true }}
        description="this semester"
      />
    </div>
  );
}
