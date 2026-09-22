"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export default function ThemeInit() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.removeAttribute("data-theme");
      root.classList.remove("dark");
    }
  }, [theme]);

  return null;
}
