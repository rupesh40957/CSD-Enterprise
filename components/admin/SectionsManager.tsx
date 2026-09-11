"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { HomeSection } from "@/models";

export default function SectionsManager() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/home-sections");
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load sections." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sortOrders
    const reordered = updated.map((sec, idx) => ({ ...sec, sortOrder: idx }));
    setSections(reordered);
  };

  const toggleActive = (index: number) => {
    const updated = [...sections];
    updated[index].isActive = !updated[index].isActive;
    setSections(updated);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updated = [...sections];
    updated[index].title = title;
    setSections(updated);
  };

  const saveSections = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/home-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: "Section sequence and visibility saved successfully!" });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">
            Home Page Sections Manager
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Drag, reorder, or toggle visibility of each section on the public Home Page without code changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSections}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            title="Reload from server"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={saveSections}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Publish Section Order"}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading && sections.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading sections...</div>
      ) : (
        <div className="space-y-2.5">
          {sections.map((sec, idx) => (
            <div
              key={sec.sectionType}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                sec.isActive
                  ? "bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 shadow-sm"
                  : "bg-slate-100/70 dark:bg-navy-950/60 border-dashed border-slate-300 dark:border-navy-800/70 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {sec.sectionType}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Order #{sec.sortOrder}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                    className="mt-1 font-semibold text-sm text-navy-950 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-navy-700 focus:border-cyan-500 focus:outline-none"
                    placeholder="Section Title"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => toggleActive(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    sec.isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-200 dark:bg-navy-800 text-slate-500"
                  }`}
                >
                  {sec.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{sec.isActive ? "Active" : "Disabled"}</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-800 p-1 rounded-xl">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, "up")}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-700 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveSection(idx, "down")}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-700 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
