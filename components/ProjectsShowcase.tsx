"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  X,
  CheckCircle,
  Clock,
  ShieldAlert,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Project } from "@/models/Project";

interface ProjectsShowcaseProps {
  projects?: Project[];
}

export default function ProjectsShowcase({ projects = [] }: ProjectsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!projects || projects.length === 0) return null;

  // Derive unique categories dynamically
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    return p.category === activeCategory;
  });

  return (
    <section id="projects" className="py-24 bg-slate-50 dark:bg-navy-950/60 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Landmark Integrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Delivering Excellence: Featured Projects
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            A proven record of mission-critical engineering deployments for national oil corporations,
            telecom pioneers, state law enforcement, and central hydrological agencies.
          </p>

          {/* Dynamic Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border btn-press ${
                  activeCategory === cat
                    ? "bg-red-600 text-white dark:bg-red-600 dark:text-white border-red-600 shadow-md shadow-red-600/25"
                    : "bg-white dark:bg-navy-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.slug || String(project._id)}
              className="glass-panel rounded-2xl overflow-hidden group hover:border-red-500/40 dark:hover:border-red-500/30 transition-all duration-300 shadow-sm flex flex-col justify-between card-hover"
            >
              <div>
                {/* Project Image */}
                <div className="relative h-48 w-full bg-navy-950 overflow-hidden">
                  <Image
                    src={project.image || "/images/industrial-facility.jpg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-navy-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Client Tag */}
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{project.client}</span>
                    </div>
                    {project.location && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{project.location}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {project.shortDescription || project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-navy-900 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 transition-colors"
                >
                  <span>View Scope</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
                </button>
                {project.slug && (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-900 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                    title="Open Full Case Study"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Project Scope Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProject(null)}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-500 mb-2">
              <Building2 className="w-4 h-4" />
              <span>{selectedProject.client}</span>
              <span className="text-slate-400">•</span>
              <span>{selectedProject.category}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white mb-4">
              {selectedProject.title}
            </h3>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Project Background
                </h4>
                <p>{selectedProject.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Engineering Scope &amp; Technical Deliverables
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{selectedProject.scope}</span>
                  </div>
                </div>
              </div>

              {selectedProject.location && (
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Deployment Location: {selectedProject.location}</span>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Execution Quality Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Turnkey On-Site Deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
