"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Save, X, Factory, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Industry } from "@/models";
import ImageUploader from "./ImageUploader";

export default function IndustriesManager() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/industries");
      if (res.ok) {
        const data = await res.json();
        setIndustries(data.industries || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load industries." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleOpenNew = () => {
    setEditing({
      title: "",
      slug: "",
      description: "",
      image: "/images/industrial-facility.jpg",
      icon: "Factory",
      featured: true,
      sortOrder: industries.length,
      isActive: true,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/industries", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `Industry ${isNew ? "added" : "updated"} successfully!` });
        setEditing(null);
        fetchIndustries();
      } else {
        setFeedback({ type: "error", message: data.error || "Save failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this industry?")) return;

    try {
      const res = await fetch(`/api/industries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", message: "Industry deleted successfully." });
        fetchIndustries();
      } else {
        setFeedback({ type: "error", message: "Delete failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error during delete." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">
            Industries &amp; Target Sectors
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage the industry sectors displayed on the Home Page and solutions catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIndustries}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Industry</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((ind) => (
          <div
            key={ind.slug || String(ind._id)}
            className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-36 w-full rounded-xl overflow-hidden bg-navy-950">
                <Image
                  src={ind.image || "/images/industrial-facility.jpg"}
                  alt={ind.title}
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-navy-900/90 text-slate-300">
                  {ind.isActive ? "Active" : "Disabled"}
                </div>
              </div>

              <h3 className="font-bold text-base text-navy-950 dark:text-white">
                {ind.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {ind.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Order #{ind.sortOrder}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(ind);
                    setIsNew(false);
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                  title="Edit Industry"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ind._id ? String(ind._id) : undefined)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  title="Delete Industry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditing(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-4">
              {isNew ? "Create Industry" : `Edit: ${editing.title}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <ImageUploader
                label="Sector / Industry Image"
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
                required
                helperText="Upload industrial sector image (e.g. refineries, power plants, water dams)"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={editing.sortOrder}
                  onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.isActive}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Active &amp; Visible</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Industry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
