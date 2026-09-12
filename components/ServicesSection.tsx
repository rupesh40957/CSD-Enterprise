"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  LineChart,
  Camera,
  CloudSun,
  Network,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Radio,
  Layers,
  LayoutGrid,
  Maximize2,
  ShieldCheck,
  Activity,
  Check,
} from "lucide-react";
import { Service } from "@/models";

interface ServicesSectionProps {
  services?: Service[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  LineChart,
  Camera,
  CloudSun,
  Network,
  Users,
  Zap,
  Flame,
  Shield,
  Radio,
};

// Engineering Badges & Certifications by Vertical
const VERTICAL_METRICS: Record<string, { badge: string; standard: string; uptime: string }> = {
  "industrial-automation": {
    badge: "SIL-2 / SIL-3 Ready",
    standard: "IEC 61131-3 PLC Standards",
    uptime: "99.99% Control Reliability",
  },
  "digitization-iot": {
    badge: "Industry 4.0 Telemetry",
    standard: "MQTT / OPC-UA / REST",
    uptime: "Sub-Second Sensor Latency",
  },
  "cctv-surveillance": {
    badge: "Flameproof & Explosion-Proof",
    standard: "ATEX / IECEx Zone 1 & 2",
    uptime: "24/7 Redundant VMS Streaming",
  },
  "sensorization-hydrometrology": {
    badge: "Autonomous Solar Telemetry",
    standard: "ISRO / INSAT Satellite Link",
    uptime: "Zero-Grid Remote Deployment",
  },
  "it-network-infrastructure": {
    badge: "Armored Optical Fiber Cable",
    standard: "TIA-942 Tier-3 Ready",
    uptime: "10G High-Bandwidth Backbone",
  },
  "manpower-facility-services": {
    badge: "Certified Engineering Teams",
    standard: "ISO 9001 / OHSAS 18001",
    uptime: "Turnkey On-Site Deployment",
  },
};

export default function ServicesSection({ services = [] }: ServicesSectionProps) {
  const [viewMode, setViewMode] = useState<"spotlight" | "grid">("spotlight");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeServiceSlug, setActiveServiceSlug] = useState<string>(
    services.length > 0 ? (services[0].slug || String(services[0]._id)) : ""
  );

  if (!services || services.length === 0) return null;

  // Filter services by category if selected
  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return services;
    return services.filter((s) => {
      const text = `${s.title} ${s.tagline} ${s.shortDescription}`.toLowerCase();
      if (activeCategory === "automation") return text.includes("plc") || text.includes("scada") || text.includes("automation");
      if (activeCategory === "iot") return text.includes("iot") || text.includes("sensor") || text.includes("telemetry") || text.includes("weather");
      if (activeCategory === "surveillance") return text.includes("cctv") || text.includes("surveillance") || text.includes("camera");
      if (activeCategory === "network") return text.includes("network") || text.includes("infrastructure") || text.includes("fiber") || text.includes("lan");
      if (activeCategory === "manpower") return text.includes("manpower") || text.includes("facility") || text.includes("engineering");
      return true;
    });
  }, [services, activeCategory]);

  const activeService =
    filteredServices.find((s) => (s.slug || String(s._id)) === activeServiceSlug) ||
    filteredServices[0] ||
    services[0];

  const ActiveIcon = (activeService.icon && ICON_MAP[activeService.icon]) || Cpu;
  const metrics = VERTICAL_METRICS[activeService.slug || ""] || {
    badge: "Industrial Grade",
    standard: "Turnkey EPC Solutions",
    uptime: "Mission-Critical 24/7",
  };

  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 transition-colors relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span>Core Competencies &amp; Industrial Verticals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
            Integrated Industrial Solutions for Mission-Critical Operations
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            From deepwater offshore telemetry to hazardous refinery surveillance and nationwide IT backbones,
            CSD Enterprises delivers turnkey system engineering across 6 strategic verticals.
          </p>

          {/* Controls Bar: View Mode Switcher + Category Filters */}
          <div className="mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-navy-800">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {[
                { id: "all", label: "All Verticals" },
                { id: "automation", label: "PLC & SCADA" },
                { id: "surveillance", label: "CCTV & Security" },
                { id: "iot", label: "IoT & Hydrometrology" },
                { id: "network", label: "IT & OFC Networks" },
                { id: "manpower", label: "Engineering Manpower" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-red-600 text-white shadow-sm shadow-red-600/25 font-bold"
                      : "bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-navy-900 p-1 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("spotlight")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "spotlight"
                    ? "bg-navy-950 text-white dark:bg-red-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Interactive Spotlight Focus"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Deep-Dive</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-navy-950 text-white dark:bg-red-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="6-Card Matrix View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All 6 Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* ----------------- MODE 1: INTERACTIVE SPOTLIGHT VIEW ----------------- */}
        {viewMode === "spotlight" && (
          <div>
            {/* Horizontal Vertical Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start lg:justify-center">
              {filteredServices.map((service) => {
                const Icon = (service.icon && ICON_MAP[service.icon]) || Cpu;
                const currentSlug = service.slug || String(service._id);
                const isActive = currentSlug === (activeService.slug || String(activeService._id));
                return (
                  <button
                    key={currentSlug}
                    onClick={() => setActiveServiceSlug(currentSlug)}
                    type="button"
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-600 shadow-lg shadow-red-600/25 scale-[1.02]"
                        : "bg-white dark:bg-navy-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-800 hover:border-red-500/40 hover:bg-slate-50 dark:hover:bg-navy-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-red-500 dark:text-red-400"}`} />
                    <span>{service.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Service Showcase Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-red-500/20 shadow-xl relative overflow-hidden bg-white/70 dark:bg-navy-900/70 backdrop-blur-md">
              {/* Background Watermark Number */}
              <div className="absolute right-4 top-4 text-8xl sm:text-9xl font-mono font-black text-slate-200/40 dark:text-navy-800/40 select-none pointer-events-none">
                {activeService.number || "01"}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Left Content */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Status & Engineering Metric Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        VERTICAL {activeService.number || "01"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-red-500" />
                        {metrics.badge}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        {metrics.uptime}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-navy-950 dark:text-white mb-2 tracking-tight">
                      {activeService.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-4">
                      {activeService.tagline}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                      {activeService.description || activeService.shortDescription}
                    </p>

                    {/* Capabilities List */}
                    {activeService.capabilities && activeService.capabilities.length > 0 && (
                      <div className="space-y-3 mb-6 p-5 rounded-2xl bg-slate-50/80 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-red-600 dark:text-red-500" />
                          <span>Key Capabilities &amp; Engineering Scope</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                          {activeService.capabilities.map((cap, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Industries */}
                    {activeService.targetIndustries && activeService.targetIndustries.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                          Deployed Across Key Industrial Sectors:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeService.targetIndustries.map((ind, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 shadow-sm"
                            >
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-navy-800">
                    <Link
                      href="#contact"
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-md shadow-red-600/25 transition-all duration-200 active:scale-[0.98]"
                    >
                      <span>Request RFQ for {activeService.title}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    {activeService.slug && (
                      <Link
                        href={`/services/${activeService.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-red-600 bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 transition-colors shadow-sm"
                      >
                        <span>View Technical Architecture</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right Image Display with Live Overlay */}
                <div className="lg:col-span-5 relative">
                  <div className="relative h-[300px] sm:h-[400px] w-full rounded-3xl overflow-hidden bg-navy-950 border border-slate-200 dark:border-red-500/30 shadow-2xl group">
                    <Image
                      src={activeService.image || "/images/automation-hero.jpg"}
                      alt={activeService.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

                    {/* Live Telemetry Pill */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-navy-900/90 backdrop-blur-md border border-red-500/30 text-white flex items-center gap-2 text-xs font-semibold shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{metrics.standard}</span>
                    </div>

                    {/* Bottom Card Caption */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-navy-900/90 backdrop-blur-md border border-white/10 text-white shadow-lg">
                      <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-0.5">
                        <ActiveIcon className="w-4 h-4 text-red-500" />
                        <span>CSD Engineering Unit Execution</span>
                      </div>
                      <div className="text-[12px] text-slate-200 font-medium">
                        Complete Turnkey Engineering, Installation, Cable Pulling &amp; Commissioning
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- MODE 2: ALL VERTICALS 6-CARD MATRIX GRID ----------------- */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredServices.map((service) => {
              const Icon = (service.icon && ICON_MAP[service.icon]) || Cpu;
              const currentMetrics = VERTICAL_METRICS[service.slug || ""] || {
                badge: "Industrial Grade",
                standard: "Turnkey EPC Solutions",
                uptime: "Mission-Critical 24/7",
              };

              return (
                <div
                  key={service.slug || String(service._id)}
                  className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 hover:border-red-500/40 dark:hover:border-red-500/30 shadow-md hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between bg-white dark:bg-navy-900/80 group"
                >
                  <div>
                    {/* Top Number & Icon Node */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-700">
                          {currentMetrics.badge}
                        </span>
                        <span className="text-xl font-mono font-black text-slate-300 dark:text-navy-700">
                          {service.number || "01"}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl font-black text-navy-950 dark:text-white mb-1.5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3 line-clamp-1">
                      {service.tagline}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-3">
                      {service.shortDescription || service.description}
                    </p>

                    {/* Highlighted Capabilities */}
                    {service.capabilities && service.capabilities.length > 0 && (
                      <div className="space-y-1.5 mb-5 pb-5 border-b border-slate-100 dark:border-navy-800">
                        {service.capabilities.slice(0, 3).map((cap, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{cap}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Sector Badges & Action Link */}
                  <div>
                    {service.targetIndustries && service.targetIndustries.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {service.targetIndustries.slice(0, 3).map((ind, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-navy-800"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <span>Architecture Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      <Link
                        href="#contact"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-sm transition-all"
                      >
                        Inquire RFQ
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
