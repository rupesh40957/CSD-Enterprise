"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Save, X, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { HeroSlide } from "@/models";
import ImageUploader from "./ImageUploader";

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero");
      if (res.ok) {
        const data = await res.json();
        setSlides(data.slides || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load hero slides." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenNew = () => {
    setEditingSlide({
      badge: "Active across 9+ States | 24/7 Operations",
      heading: "Empowering Industries with",
      highlightedText: "Advanced Automation & Satcom.",
      description: "Delivering exceptional PLC/SCADA, CCTV Surveillance, and Satcom solutions since 2019.",
      primaryCtaText: "Explore Our Solutions",
      primaryCtaUrl: "#services",
      secondaryCtaText: "View Projects",
      secondaryCtaUrl: "#projects",
      image: "/images/automation-hero.jpg",
      systemUptime: "99.98% System Uptime",
      telemetryItems: [
        { label: "Flameproof SCADA & PLC", value: "Active" },
        { label: "Explosion-Proof CCTV", value: "Verified" },
      ],
      sortOrder: slides.length,
      isActive: true,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/hero", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `Slide ${isNew ? "added" : "updated"} successfully!` });
        setEditingSlide(null);
        fetchSlides();
      } else {
        setFeedback({ type: "error", message: data.error || "Save failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this hero slide?")) return;

    try {
      const res = await fetch(`/api/hero?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", message: "Slide deleted successfully." });
        fetchSlides();
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
            Hero Carousel Slides
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-slide carousel items on the Home Page hero banner with custom telemetry tags and CTAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSlides}
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
            <span>Add Slide</span>
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

      {/* Slides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, idx) => (
          <div
            key={slide._id ? String(slide._id) : idx}
            className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-navy-950">
                <Image
                  src={slide.image || "/images/automation-hero.jpg"}
                  alt={slide.heading}
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-navy-900/90 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                  Slide #{idx + 1}
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-navy-900/90 text-slate-300 text-[10px] font-medium border border-slate-700">
                  {slide.isActive ? "Active" : "Disabled"}
                </div>
              </div>

              <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 line-clamp-1">
                {slide.badge}
              </div>

              <h3 className="font-extrabold text-base text-navy-950 dark:text-white line-clamp-2">
                {slide.heading} <span className="text-cyan-500">{slide.highlightedText}</span>
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {slide.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-mono">
                Order #{slide.sortOrder}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlide(slide);
                    setIsNew(false);
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                  title="Edit Slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(slide._id ? String(slide._id) : undefined)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  title="Delete Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingSlide(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-4">
              {isNew ? "Create New Hero Slide" : "Edit Hero Slide"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Badge / Eyebrow Text *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.badge}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Main Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.heading}
                    onChange={(e) => setEditingSlide({ ...editingSlide, heading: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Highlighted Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.highlightedText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, highlightedText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.description}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary CTA Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.primaryCtaText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, primaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary CTA URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.primaryCtaUrl}
                    onChange={(e) => setEditingSlide({ ...editingSlide, primaryCtaUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary CTA URL
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaUrl}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <ImageUploader
                label="Slide Background Image"
                value={editingSlide.image}
                onChange={(url) => setEditingSlide({ ...editingSlide, image: url })}
                required
                helperText="Upload a high-resolution hero background image (1920x1080 recommended)"
                aspectRatio="banner"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Uptime Badge
                  </label>
                  <input
                    type="text"
                    value={editingSlide.systemUptime || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, systemUptime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingSlide.sortOrder}
                    onChange={(e) => setEditingSlide({ ...editingSlide, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={editingSlide.isActive}
                  onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                  className="rounded border-slate-300 dark:border-navy-700 text-cyan-500 focus:ring-cyan-400"
                />
                <label htmlFor="slideActive" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Slide is Active &amp; Visible
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
