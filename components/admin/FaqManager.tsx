"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Faq {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY_FAQ: Faq = {
  question: "",
  answer: "",
  category: "General",
  sortOrder: 0,
  isActive: true,
};

const CATEGORIES = [
  "General",
  "Industrial Automation",
  "Surveillance & Safety",
  "Offshore & Telecom",
  "Hydrometrology",
  "Procurement & SLAs",
  "IT & Network",
];

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
      }
    } catch {
      showToast("error", "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const body = { ...editing };
      const res = await fetch("/api/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast("success", isNew ? "FAQ created!" : "FAQ updated!");
        setEditing(null);
        setIsNew(false);
        fetchFaqs();
      } else {
        const err = await res.json();
        showToast("error", err.error || "Save failed");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("success", "FAQ deleted");
        fetchFaqs();
      }
    } catch {
      showToast("error", "Delete failed");
    }
  };

  const filtered = faqs
    .filter((f) => categoryFilter === "All" || f.category === categoryFilter)
    .filter(
      (f) =>
        !search ||
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            {isNew ? "Add New FAQ" : "Edit FAQ"}
          </h2>
          <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Question *</label>
            <input
              value={editing.question}
              onChange={(e) => setEditing({ ...editing, question: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Enter the FAQ question..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Answer *</label>
            <textarea
              value={editing.answer}
              onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-y"
              placeholder="Write the answer..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={editing.sortOrder}
                onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-navy-800">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !editing.question || !editing.answer} className="px-6 py-2 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Create FAQ" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-500" />
            FAQ Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">{faqs.length} question{faqs.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY_FAQ, sortOrder: faqs.length }); setIsNew(true); }}
          className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* FAQ List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No FAQs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => (
            <div
              key={faq._id}
              className={`bg-white dark:bg-navy-900 rounded-xl border transition-all ${
                !faq.isActive ? "border-slate-200/50 dark:border-navy-800/50 opacity-60" : "border-slate-200 dark:border-navy-800"
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                <GripVertical className="w-4 h-4 text-slate-300 dark:text-navy-600 flex-shrink-0" />
                <button
                  onClick={() => setExpandedId(expandedId === faq._id ? null : (faq._id ?? null))}
                  className="flex-1 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{faq.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold">{faq.category}</span>
                        <span className="text-[10px] text-slate-400">#{faq.sortOrder}</span>
                        {!faq.isActive && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">Hidden</span>
                        )}
                      </div>
                    </div>
                    {expandedId === faq._id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditing({ ...faq }); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-cyan-500">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => faq._id && handleDelete(faq._id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expandedId === faq._id && (
                <div className="px-4 pb-4 pt-0 pl-11 border-t border-slate-100 dark:border-navy-800 mt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
