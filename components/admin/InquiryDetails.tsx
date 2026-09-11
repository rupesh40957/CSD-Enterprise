"use client";

import React, { useState } from "react";
import {
  X,
  Building,
  Mail,
  Phone,
  Calendar,
  Layers,
  FileText,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Inquiry, InquiryStatus } from "@/models/Inquiry";
import { formatDate } from "@/lib/utils";

interface InquiryDetailsProps {
  inquiry: Inquiry;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: InquiryStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function InquiryDetails({
  inquiry,
  onClose,
  onStatusChange,
  onDelete,
}: InquiryDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState<InquiryStatus>(inquiry.status);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusUpdate = async (status: InquiryStatus) => {
    setUpdating(true);
    try {
      await onStatusChange(String(inquiry._id), status);
      setCurrentStatus(status);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this inquiry record?")) return;
    setDeleting(true);
    try {
      await onDelete(String(inquiry._id));
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pr-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-500 mb-1">
              <Building className="w-3.5 h-3.5" />
              <span>{inquiry.organization}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white">
              {inquiry.fullName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Received {formatDate(inquiry.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Status Control Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Status:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                currentStatus === "New"
                  ? "bg-amber-500/20 text-amber-500"
                  : currentStatus === "Contacted"
                  ? "bg-blue-500/20 text-blue-500"
                  : currentStatus === "In Review"
                  ? "bg-purple-500/20 text-purple-500"
                  : "bg-emerald-500/20 text-emerald-500"
              }`}
            >
              {currentStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(["New", "Contacted", "In Review", "Completed"] as InquiryStatus[]).map((st) => (
              <button
                key={st}
                disabled={updating || currentStatus === st}
                onClick={() => handleStatusUpdate(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  currentStatus === st
                    ? "bg-navy-950 text-white dark:bg-cyan-500 dark:text-navy-950"
                    : "bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:bg-slate-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Work Email</div>
            <a
              href={`mailto:${inquiry.workEmail}`}
              className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{inquiry.workEmail}</span>
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</div>
            <a
              href={`tel:${inquiry.phone}`}
              className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{inquiry.phone}</span>
            </a>
          </div>
        </div>

        {/* Solution Vertical */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            Solution Vertical Requested
          </h4>
          <p className="text-sm font-semibold text-navy-950 dark:text-white">
            {inquiry.solution}
          </p>
        </div>

        {/* Project Scope / Message */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-500" />
            Project Scope / Requirements Specification
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-navy-800">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? "Deleting..." : "Delete Inquiry"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
