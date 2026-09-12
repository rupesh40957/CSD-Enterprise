"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Building,
  CheckCircle,
  XCircle,
  Star,
  X,
  RefreshCw,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import { Project } from "@/models/Project";

interface ProjectsManagerProps {
  projects: Project[];
  loading: boolean;
  onRefresh: () => void;
}

const CATEGORIES = [
  "CCTV & Surveillance",
  "IT & Telecom",
  "Offshore Satcom",
  "Hydrometrology",
  "Industrial Automation",
  "Digitization & IoT",
];

export default function ProjectsManager({
  projects,
  loading,
  onRefresh,
}: ProjectsManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    category: CATEGORIES[0],
    description: "",
    scope: "",
    image: "/images/industrial-facility.jpg",
    featured: false,
    active: true,
  });

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      client: "",
      category: CATEGORIES[0],
      description: "",
      scope: "",
      image: "/images/industrial-facility.jpg",
      featured: false,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      client: p.client,
      category: p.category,
      description: p.description,
      scope: p.scope,
      image: p.image || "/images/industrial-facility.jpg",
      featured: p.featured,
      active: p.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Operation failed.");
        return;
      }

      setModalOpen(false);
      onRefresh();
    } catch {
      alert("Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (p: Project) => {
    try {
      await fetch(`/api/projects/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      onRefresh();
    } catch {
      alert("Failed to toggle status.");
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      await fetch(`/api/projects/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      onRefresh();
    } catch {
      alert("Failed to toggle featured status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently remove this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      onRefresh();
    } catch {
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider">
            Enterprise Project Showcase ({projects.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage public portfolio entries, scope definitions, and client highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 border border-slate-200 dark:border-navy-700 shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Fetching...' : 'Refresh'}</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading Projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No projects in database. Click &ldquo;Add New Project&rdquo; or run seed.
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={String(p._id)}
              className={`p-5 rounded-2xl glass-panel flex flex-col justify-between border ${
                p.active
                  ? "border-slate-200 dark:border-navy-800"
                  : "border-slate-300 dark:border-navy-900 opacity-60 bg-slate-50 dark:bg-navy-950/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      title={p.featured ? "Featured Project" : "Mark as Featured"}
                      className={`p-1 rounded ${
                        p.featured ? "text-amber-400" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(p)}
                      title={p.active ? "Published" : "Hidden"}
                      className={`p-1 rounded ${
                        p.active ? "text-emerald-500" : "text-slate-400"
                      }`}
                    >
                      {p.active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Building className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{p.client}</span>
                </div>

                <h4 className="text-base font-bold text-navy-950 dark:text-white mb-2 line-clamp-2">
                  {p.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {p.active ? "Live on site" : "Draft / Hidden"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                    title="Edit project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(String(p._id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-navy-950 dark:text-white mb-4">
              {editingProject ? "Edit Project Details" : "Add New Landmark Project"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Explosion-Proof CCTV Deployment"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Indian Oil Corporation Limited"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project background, objectives, and facility location..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scope &amp; Technical Deliverables *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Hardware deployed, telemetry standards, certifications..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                />
              </div>

              <ImageUploader
                label="Project Cover Image"
                value={formData.image || ""}
                onChange={(url) => setFormData({ ...formData, image: url })}
                helperText="Upload project site photograph or installation visual"
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Publish / Active on Site</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
