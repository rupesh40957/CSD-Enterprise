"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Building,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Inquiry, InquiryStatus } from "@/models/Inquiry";
import { formatDate } from "@/lib/utils";

interface InquiryTableProps {
  inquiries: Inquiry[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onPageChange: (p: number) => void;
  onViewInquiry: (inquiry: Inquiry) => void;
  onStatusChange: (id: string, newStatus: InquiryStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function InquiryTable({
  inquiries,
  loading,
  total,
  page,
  totalPages,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onPageChange,
  onViewInquiry,
  onStatusChange,
  onDelete,
}: InquiryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const statuses = ["All", "New", "Contacted", "In Review", "Completed"];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    e.stopPropagation();
    await onStatusChange(id, e.target.value as InquiryStatus);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                statusFilter === st
                  ? "bg-navy-950 text-white dark:bg-cyan-500 dark:text-navy-950 border-navy-950 dark:border-cyan-400"
                  : "bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-800 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-900/80 border-b border-slate-200 dark:border-navy-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-3.5">Contact / Lead</th>
                <th className="px-6 py-3.5">Organization</th>
                <th className="px-6 py-3.5">Solution Vertical</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading Inquiries...</span>
                    </span>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No inquiries found matching current filters.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr
                    key={String(inq._id)}
                    onClick={() => onViewInquiry(inq)}
                    className="hover:bg-slate-50 dark:hover:bg-navy-900/60 cursor-pointer transition-colors"
                  >
                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy-950 dark:text-white">
                        {inq.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-cyan-500" />
                        <span>{inq.workEmail}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-cyan-500" />
                        <span>{inq.phone}</span>
                      </div>
                    </td>

                    {/* Organization */}
                    <td className="px-6 py-4 font-semibold text-navy-950 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inq.organization}</span>
                      </div>
                    </td>

                    {/* Solution */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                        {inq.solution}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusSelect(e, String(inq._id))}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          inq.status === "New"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : inq.status === "Contacted"
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                            : inq.status === "In Review"
                            ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Review">In Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDate(inq.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewInquiry(inq)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                          title="View Full Scope"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, String(inq._id))}
                          disabled={deletingId === String(inq._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-navy-900/50 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-navy-950 dark:text-white">{inquiries.length}</strong> of{" "}
            <strong className="text-navy-950 dark:text-white">{total}</strong> inquiries
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-700 disabled:opacity-40 hover:bg-white dark:hover:bg-navy-800"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-700 disabled:opacity-40 hover:bg-white dark:hover:bg-navy-800"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
