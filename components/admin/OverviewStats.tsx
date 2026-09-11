"use client";

import React from "react";
import {
  Inbox,
  Clock,
  MailCheck,
  FolderGit2,
  Database,
  ArrowRight,
  TrendingUp,
  Building,
} from "lucide-react";
import { Inquiry } from "@/models/Inquiry";
import { formatDate } from "@/lib/utils";
import { AdminTab } from "./AdminSidebar";

interface OverviewStatsProps {
  counts: {
    totalInquiries: number;
    newInquiries: number;
    contactedInquiries: number;
    inReviewInquiries: number;
    completedInquiries: number;
    subscribers: number;
    projects: number;
  };
  recentInquiries: Inquiry[];
  dbConnected: boolean;
  onSelectTab: (tab: AdminTab) => void;
  onViewInquiry: (inquiry: Inquiry) => void;
}

export default function OverviewStats({
  counts,
  recentInquiries,
  dbConnected,
  onSelectTab,
  onViewInquiry,
}: OverviewStatsProps) {
  return (
    <div className="space-y-8">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inquiries */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
            {counts.totalInquiries}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs">
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Incoming Pipeline</span>
            </span>
            <button
              onClick={() => onSelectTab("inquiries")}
              className="text-cyan-500 hover:underline font-medium"
            >
              View All
            </button>
          </div>
        </div>

        {/* Pending New Leads */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              New Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {counts.newInquiries}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Requires Follow-Up</span>
            <span className="font-semibold text-amber-500">Action Pending</span>
          </div>
        </div>

        {/* Subscribers */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subscribers
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <MailCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
            {counts.subscribers}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Newsletter List</span>
            <button
              onClick={() => onSelectTab("subscribers")}
              className="text-cyan-500 hover:underline font-medium"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Active Projects */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
            {counts.projects}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Portfolio Records</span>
            <button
              onClick={() => onSelectTab("projects")}
              className="text-cyan-500 hover:underline font-medium"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Inquiries Pipeline Breakdown */}
      <div className="p-6 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white mb-4">
          Inquiry Pipeline Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">New</div>
            <div className="text-xl font-black text-amber-500 mt-1">{counts.newInquiries}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">Contacted</div>
            <div className="text-xl font-black text-blue-500 mt-1">{counts.contactedInquiries}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">In Review</div>
            <div className="text-xl font-black text-purple-500 mt-1">{counts.inReviewInquiries}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Completed</div>
            <div className="text-xl font-black text-emerald-500 mt-1">{counts.completedInquiries}</div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="p-6 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-navy-950 dark:text-white">
              Recent Engineering Inquiries
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest requests received through the corporate website
            </p>
          </div>
          <button
            onClick={() => onSelectTab("inquiries")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-500 hover:underline"
          >
            <span>Open Inquiries Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-navy-900/40 rounded-xl">
            No inquiries recorded yet. Inquiries submitted via the website contact form will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {recentInquiries.slice(0, 5).map((inq) => (
              <div
                key={String(inq._id)}
                onClick={() => onViewInquiry(inq)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-navy-900/60 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-navy-950 dark:text-white">
                      {inq.fullName}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-cyan-500 font-medium flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {inq.organization}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {inq.solution} &ndash; {inq.message}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inq.status === "New"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : inq.status === "Contacted"
                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                        : inq.status === "In Review"
                        ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                        : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(inq.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
