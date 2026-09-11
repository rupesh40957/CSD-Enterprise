"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Loader2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface StatItem {
  _id?: string;
  label: string;
  value: string;
  suffix: string;
  sublabel: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY_STAT: StatItem = {
  label: "",
  value: "",
  suffix: "+",
  sublabel: "",
  icon: "Activity",
  sortOrder: 0,
  isActive: true,
};

const ICON_OPTIONS = [
  "MapPin", "CheckCircle2", "ShieldCheck", "Activity", "Cpu",
  "Users", "Building", "Award", "Zap", "BarChart3",
  "Globe", "Star", "TrendingUp", "Clock", "Target",
];

export default function StatsManager() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<StatItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || []);
      }
    } catch {
      showToast("error", "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const body = { ...editing };
      const res = await fetch("/api/stats", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast("success", isNew ? "Statistic created!" : "Statistic updated!");
        setEditing(null);
        setIsNew(false);
        fetchStats();
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
    if (!confirm("Delete this statistic?")) return;
    try {
      const res = await fetch(`/api/stats?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("success", "Statistic deleted");
        fetchStats();
      }
    } catch {
      showToast("error", "Delete failed");
    }
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            {isNew ? "Add New KPI Stat" : "Edit KPI Stat"}
          </h2>
          <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Label *</label>
              <input
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. States Covered"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Value *</label>
              <input
                value={editing.value}
                onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. 100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Suffix</label>
              <input
                value={editing.suffix}
                onChange={(e) => setEditing({ ...editing, suffix: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. + or %"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Sub-Label</label>
              <input
                value={editing.sublabel}
                onChange={(e) => setEditing({ ...editing, sublabel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. Offshore & Onshore"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Icon</label>
              <select
                value={editing.icon}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <span className="text-sm font-medium">Active / Visible on Home Page</span>
              </label>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Live Preview</p>
            <div className="text-center">
              <span className="text-3xl font-black text-navy-950 dark:text-white">{editing.value}</span>
              <span className="text-2xl font-bold text-cyan-500">{editing.suffix}</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{editing.label}</p>
              {editing.sublabel && <p className="text-xs text-slate-400">{editing.sublabel}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-navy-800">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !editing.label || !editing.value} className="px-6 py-2 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Create Stat" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            Company KPI Stats
          </h2>
          <p className="text-sm text-slate-500 mt-1">{stats.length} statistic{stats.length !== 1 ? "s" : ""} configured</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY_STAT, sortOrder: stats.length }); setIsNew(true); }}
          className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Statistic
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No statistics configured</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.sort((a, b) => a.sortOrder - b.sortOrder).map((stat) => (
            <div
              key={stat._id}
              className={`bg-white dark:bg-navy-900 rounded-xl border p-5 transition-all ${
                !stat.isActive ? "border-slate-200/50 dark:border-navy-800/50 opacity-60" : "border-slate-200 dark:border-navy-800 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold">
                  #{stat.sortOrder} • {stat.icon}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing({ ...stat }); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-cyan-500">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => stat._id && handleDelete(stat._id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black text-navy-950 dark:text-white">{stat.value}</span>
                <span className="text-2xl font-bold text-cyan-500">{stat.suffix}</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{stat.label}</p>
                {stat.sublabel && <p className="text-xs text-slate-400">{stat.sublabel}</p>}
              </div>
              {!stat.isActive && (
                <div className="mt-3 text-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">Hidden</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
