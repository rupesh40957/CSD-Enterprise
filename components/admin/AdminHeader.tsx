"use client";

import React from "react";
import { Menu, Database, KeyRound, UserCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminHeaderProps {
  title: string;
  dbConnected: boolean;
  onOpenMobileMenu: () => void;
  adminEmail?: string;
  adminRole?: string;
  onOpenPasswordModal?: () => void;
}

export default function AdminHeader({
  title,
  dbConnected,
  onOpenMobileMenu,
  adminEmail,
  adminRole,
  onOpenPasswordModal,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/85 dark:bg-navy-950/85 backdrop-blur-md border-b border-slate-200 dark:border-navy-800 transition-colors">
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
            <span className="font-bold text-red-600 dark:text-red-500">CSD Enterprises</span> Operations Command
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Logged in Admin Indicator */}
        {adminEmail && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs text-slate-700 dark:text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span className="font-mono text-[11px] font-semibold">{adminEmail}</span>
            {adminRole && (
              <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                {adminRole}
              </span>
            )}
          </div>
        )}

        {/* Change Password Trigger Button */}
        {onOpenPasswordModal && (
          <button
            onClick={onOpenPasswordModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-navy-900 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-navy-800 transition-colors shadow-sm"
            title="Change Account Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span className="hidden sm:inline">Change Password</span>
          </button>
        )}

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
          <span className="hidden lg:inline">
            DATABASE: {dbConnected ? "Online" : "Disconnected"}
          </span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
