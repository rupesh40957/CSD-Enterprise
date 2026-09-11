"use client";

import React, { useState } from "react";
import { Search, Download, MailCheck, Calendar } from "lucide-react";
import { Subscriber } from "@/models/Subscriber";
import { formatDate } from "@/lib/utils";

interface SubscribersTableProps {
  subscribers: Subscriber[];
  loading: boolean;
  total: number;
  search: string;
  setSearch: (s: string) => void;
}

export default function SubscribersTable({
  subscribers,
  loading,
  total,
  search,
  setSearch,
}: SubscribersTableProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExportCsv = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/newsletter?format=csv");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `csd-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      alert("Failed to export subscribers CSV.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Export CSV Action */}
        <button
          onClick={handleExportCsv}
          disabled={downloading || total === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-sm transition-all disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? "Generating CSV..." : "Export Subscribers CSV"}</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-900/80 border-b border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-3.5">Subscriber Email</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    Loading Subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={String(sub._id)} className="hover:bg-slate-50 dark:hover:bg-navy-900/60">
                    <td className="px-6 py-4 font-semibold text-navy-950 dark:text-white">
                      <div className="flex items-center gap-2">
                        <MailCheck className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Active Subscriber
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(sub.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-navy-900/50 border-t border-slate-200 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
          Total Subscribers: <strong className="text-navy-950 dark:text-white">{total}</strong>
        </div>
      </div>
    </div>
  );
}
