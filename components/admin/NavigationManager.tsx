"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Navigation,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Loader2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  _id?: string;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
  isExternal?: boolean;
  badge?: string;
}

const EMPTY_NAV: NavItem = {
  label: "",
  href: "",
  sortOrder: 0,
  isActive: true,
  isExternal: false,
  badge: "",
};

export default function NavigationManager() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNavItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/navigation");
      if (res.ok) {
        const data = await res.json();
        setNavItems(data.items || []);
      }
    } catch {
      showToast("error", "Failed to load navigation");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavItems();
  }, [fetchNavItems]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const body = { ...editing };
      const res = await fetch("/api/navigation", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showToast("success", isNew ? "Nav item created!" : "Nav item updated!");
        setEditing(null);
        setIsNew(false);
        fetchNavItems();
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
    if (!confirm("Delete this navigation item?")) return;
    try {
      const res = await fetch(`/api/navigation?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("success", "Nav item deleted");
        fetchNavItems();
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
            <Navigation className="w-5 h-5 text-cyan-500" />
            {isNew ? "Add Navigation Item" : "Edit Navigation Item"}
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
                placeholder="e.g. About Us"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">URL / Anchor *</label>
              <input
                value={editing.href}
                onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. #about or /services"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={editing.sortOrder}
                onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Badge (optional)</label>
              <input
                value={editing.badge || ""}
                onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. New"
              />
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isExternal || false}
                  onChange={(e) => setEditing({ ...editing, isExternal: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm font-medium">External Link</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-navy-800">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !editing.label || !editing.href} className="px-6 py-2 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? "Create" : "Save Changes"}
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
            <Navigation className="w-5 h-5 text-cyan-500" />
            Navigation Menu
          </h2>
          <p className="text-sm text-slate-500 mt-1">{navItems.length} menu item{navItems.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { setEditing({ ...EMPTY_NAV, sortOrder: navItems.length }); setIsNew(true); }}
          className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      ) : navItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Navigation className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No navigation items</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden">
          {navItems.sort((a, b) => a.sortOrder - b.sortOrder).map((item, idx) => (
            <div
              key={item._id}
              className={`flex items-center gap-3 px-5 py-4 ${
                idx !== navItems.length - 1 ? "border-b border-slate-100 dark:border-navy-800" : ""
              } ${!item.isActive ? "opacity-50" : ""}`}
            >
              <GripVertical className="w-4 h-4 text-slate-300 dark:text-navy-600 flex-shrink-0" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-500 font-mono">{item.sortOrder}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate flex items-center gap-2">
                  {item.label}
                  {item.isExternal && <ExternalLink className="w-3 h-3 text-slate-400" />}
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500 text-white font-bold">{item.badge}</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 truncate">{item.href}</p>
              </div>
              {!item.isActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">Hidden</span>
              )}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-cyan-500">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => item._id && handleDelete(item._id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
