"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Star, MessageSquare, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Testimonial } from "@/models";

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load testimonials." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenNew = () => {
    setEditing({
      name: "",
      designation: "",
      company: "",
      content: "",
      rating: 5,
      projectReference: "",
      featured: true,
      sortOrder: testimonials.length,
      isActive: true,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `Testimonial ${isNew ? "added" : "updated"} successfully!` });
        setEditing(null);
        fetchTestimonials();
      } else {
        setFeedback({ type: "error", message: data.error || "Save failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", message: "Testimonial deleted successfully." });
        fetchTestimonials();
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
            Client Testimonials &amp; Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage endorsements, corporate quotes, and star ratings from enterprise partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchTestimonials}
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
            <span>Add Testimonial</span>
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
        {testimonials.map((item) => (
          <div
            key={item._id ? String(item._id) : item.name}
            className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-200 dark:bg-navy-800 text-slate-500"
                }`}>
                  {item.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-4">
                &ldquo;{item.content}&rdquo;
              </p>

              <div>
                <h4 className="font-bold text-sm text-navy-950 dark:text-white">
                  {item.name}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.designation}, <span className="text-cyan-500">{item.company}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Order #{item.sortOrder}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(item);
                    setIsNew(false);
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id ? String(item._id) : undefined)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
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
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditing(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-4">
              {isNew ? "Add Testimonial" : "Edit Testimonial"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.designation}
                    onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={editing.company}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editing.rating}
                    onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
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
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.isActive}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Active &amp; Displayed on Home Page</span>
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
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
