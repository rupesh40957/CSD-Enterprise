"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Save, X, Cpu, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Service } from "@/models";
import ImageUploader from "./ImageUploader";

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form helpers
  const [capabilitiesStr, setCapabilitiesStr] = useState("");
  const [industriesStr, setIndustriesStr] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load services." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenNew = () => {
    setEditingService({
      title: "",
      slug: "",
      number: `0${services.length + 1}`,
      tagline: "",
      shortDescription: "",
      description: "",
      icon: "Cpu",
      image: "/images/automation-hero.jpg",
      targetIndustries: [],
      capabilities: [],
      featured: true,
      sortOrder: services.length,
      isActive: true,
    });
    setCapabilitiesStr("");
    setIndustriesStr("");
    setIsNew(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setCapabilitiesStr((service.capabilities || []).join("\n"));
    setIndustriesStr((service.targetIndustries || []).join(", "));
    setIsNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const capabilities = capabilitiesStr
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const targetIndustries = industriesStr
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const payload = {
      ...editingService,
      capabilities,
      targetIndustries,
    };

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `Service ${isNew ? "added" : "updated"} successfully!` });
        setEditingService(null);
        fetchServices();
      } else {
        setFeedback({ type: "error", message: data.error || "Save failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this service vertical?")) return;

    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", message: "Service deleted successfully." });
        fetchServices();
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
            Services &amp; Business Verticals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your dynamic service verticals, engineering capabilities, and target industries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchServices}
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
            <span>Add Service</span>
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.slug || String(service._id)}
            className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-mono font-bold text-cyan-500">
                  {service.number}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  service.isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-200 dark:bg-navy-800 text-slate-500"
                }`}>
                  {service.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-navy-950 dark:text-white">
                {service.title}
              </h3>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                {service.tagline}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                {service.shortDescription || service.description}
              </p>

              <div className="text-[11px] text-slate-400">
                Capabilities: {service.capabilities?.length || 0} • Industries: {service.targetIndustries?.length || 0}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Order #{service.sortOrder}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(service)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service._id ? String(service._id) : undefined)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingService(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-4">
              {isNew ? "Create Service Vertical" : `Edit: ${editingService.title}`}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number (e.g. 01)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.number}
                    onChange={(e) => setEditingService({ ...editingService, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Subheading *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.tagline}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description (Card summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDescription}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Capabilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={capabilitiesStr}
                  onChange={(e) => setCapabilitiesStr(e.target.value)}
                  placeholder="PLC / DCS Architecture & Logic Programming&#10;Redundant SCADA Visualization"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Industries (Comma-separated)
                </label>
                <input
                  type="text"
                  value={industriesStr}
                  onChange={(e) => setIndustriesStr(e.target.value)}
                  placeholder="Power Plants, Steel Smelters, Oil & Gas Refineries"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <ImageUploader
                label="Service Feature Image"
                value={editingService.image}
                onChange={(url) => setEditingService({ ...editingService, image: url })}
                required
                helperText="Upload engineering visual for this service (e.g. 800x600 or 1200x800)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Icon (e.g. Cpu, Camera, LineChart, CloudSun, Network)
                  </label>
                  <input
                    type="text"
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingService.sortOrder}
                    onChange={(e) => setEditingService({ ...editingService, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingService.featured}
                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingService.isActive}
                    onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Active &amp; Visible</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
