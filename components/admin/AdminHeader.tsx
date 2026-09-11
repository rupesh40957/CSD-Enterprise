"use client";

import React from "react";
import { Menu, Database, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminHeaderProps {
  title: string;
  dbConnected: boolean;
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({
  title,
  dbConnected,
  onOpenMobileMenu,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-slate-200 dark:border-navy-800">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-900"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-navy-950 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            CSD Enterprises Operations Command
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Database Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            dbConnected
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              dbConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          <Database className="w-3 h-3" />
          <span className="hidden sm:inline">
            MongoDB: {dbConnected ? "Online" : "Disconnected"}
          </span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
