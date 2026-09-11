"use client";

import React, { useState } from "react";
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

export default function ServicesSection({ services = [] }: ServicesSectionProps) {
  const [activeServiceSlug, setActiveServiceSlug] = useState<string>(
    services.length > 0 ? (services[0].slug || String(services[0]._id)) : ""
  );

  if (!services || services.length === 0) return null;

  const activeService =
    services.find((s) => (s.slug || String(s._id)) === activeServiceSlug) || services[0];
  const ActiveIcon = (activeService.icon && ICON_MAP[activeService.icon]) || Cpu;

  return (
    <section id="services" className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Core Competencies &amp; Verticals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Integrated Industrial Solutions for Mission-Critical Operations
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            From deepwater offshore telemetry to hazardous refinery surveillance and nationwide IT networks,
            we deliver specialized engineering across dynamic business verticals.
          </p>
        </div>

        {/* Dynamic Desktop Tab Selector / Mobile Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start lg:justify-center">
          {services.map((service) => {
            const Icon = (service.icon && ICON_MAP[service.icon]) || Cpu;
            const currentSlug = service.slug || String(service._id);
            const isActive = currentSlug === (activeService.slug || String(activeService._id));
            return (
              <button
                key={currentSlug}
                onClick={() => setActiveServiceSlug(currentSlug)}
                type="button"
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                  isActive
                    ? "bg-navy-950 text-white dark:bg-cyan-500 dark:text-navy-950 border-navy-950 dark:border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-100 dark:bg-navy-900/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-800 hover:bg-slate-200 dark:hover:bg-navy-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400 dark:text-navy-950" : "text-slate-500 dark:text-slate-400"}`} />
                <span>{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Service Showcase Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-cyan-500/20 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-500/80">
                    {activeService.number || "01"}
                  </span>
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-400">
                    {activeService.tagline}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white mb-4">
                  {activeService.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {activeService.description || activeService.shortDescription}
                </p>

                {/* Capabilities List */}
                {activeService.capabilities && activeService.capabilities.length > 0 && (
                  <div className="space-y-2.5 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                      Key Capabilities &amp; Technical Scope
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {activeService.capabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Industries */}
                {activeService.targetIndustries && activeService.targetIndustries.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-navy-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                      Target Industries
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeService.targetIndustries.map((ind, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-md transition-all duration-200"
                >
                  <span>Request RFQ for {activeService.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                {activeService.slug && (
                  <Link
                    href={`/services/${activeService.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-700"
                  >
                    <span>View Full Vertical Details</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Asset View */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[280px] sm:h-[360px] w-full rounded-2xl overflow-hidden bg-navy-950 border border-slate-200 dark:border-cyan-500/30 shadow-lg">
                <Image
                  src={activeService.image || "/images/automation-hero.jpg"}
                  alt={activeService.title}
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-navy-900/85 backdrop-blur-md border border-cyan-500/20 text-white">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <ActiveIcon className="w-3.5 h-3.5" />
                    <span>CSD Enterprises Engineering Unit</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">
                    Turnkey Design, Civil &amp; Commissioning
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
