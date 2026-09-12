"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-slate-100 border border-slate-200/80 dark:text-amber-400 dark:hover:text-amber-300 dark:bg-navy-900/90 dark:hover:bg-navy-800 dark:border-cyan-500/30 shadow-sm focus:outline-none select-none active:scale-95"
    >
      {/* Sun Icon for Dark Theme */}
      <Sun className="w-4 h-4 text-amber-400 hidden dark:block transition-transform duration-300 hover:rotate-45 pointer-events-none" />
      {/* Moon Icon for Light Theme */}
      <Moon className="w-4 h-4 text-slate-700 block dark:hidden transition-transform duration-300 hover:-rotate-12 pointer-events-none" />
    </button>
  );
}
