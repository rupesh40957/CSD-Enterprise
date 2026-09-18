"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  Target,
  Users,
  Award,
  Shield,
  HeartHandshake,
  Lightbulb,
  Leaf,
  Scale,
  RefreshCw,
  Clock,
  Radio,
  Workflow,
  Compass,
} from "lucide-react";
import { AboutContent } from "@/models";
import ScrollReveal from "./ScrollReveal";

interface AboutBentoProps {
  about?: AboutContent | null;
}

// 9 Official Core Values directly from Company Profile Page 4
const OFFICIAL_CORE_VALUES = [
  {
    title: "Commitment to Excellence",
    icon: Award,
    description: "Upholding rigorous engineering standards, certified installations, and zero-defect execution in high-stakes environments.",
    color: "from-red-500/20 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  },
  {
    title: "Customer-Centric Approach",
    icon: Target,
    description: "Designing tailored automation, satcom, and telemetry architectures that adapt specifically to client workflows.",
    color: "from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30",
  },
  {
    title: "Customer Satisfaction",
    icon: HeartHandshake,
    description: "Exceeding expectations through continuous improvement, rapid on-site resolution, and long-term client relationships.",
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    title: "Teamwork",
    icon: Users,
    description: "Collaborative synergy between senior technical architects, offshore specialists, and on-ground field technicians.",
    color: "from-purple-500/20 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    title: "Professionalism",
    icon: Shield,
    description: "Strict industrial safety compliance, transparent reporting, and adherence to PESO, OISD, and ISO guidelines.",
    color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    title: "Flexibility & Adaptability",
    icon: RefreshCw,
    description: "Agile engineering execution across challenging terrains, offshore platforms, and multi-state distributed locations.",
    color: "from-cyan-500/20 to-sky-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
  {
    title: "Accountability",
    icon: Scale,
    description: "Complete turnkey responsibility from initial site survey and design through to commissioning and AMC lifecycles.",
    color: "from-rose-500/20 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    title: "Social Responsibility",
    icon: Compass,
    description: "Empowering national critical infrastructure, public safety networks, and transparent governance systems.",
    color: "from-indigo-500/20 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    title: "Environment Responsibility",
    icon: Leaf,
    description: "Deploying solar-powered Automatic Weather Stations, energy-efficient telemetry, and sustainable green installations.",
    color: "from-green-500/20 to-emerald-500/10 text-green-600 dark:text-emerald-400 border-green-500/30",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  Target,
  HeartHandshake,
  Users,
  Shield,
  RefreshCw,
  Scale,
  Compass,
  Leaf,
  Lightbulb,
  CheckCircle2,
};

export default function AboutBento({ about }: AboutBentoProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "values" | "team">("overview");

  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 transition-colors relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Section Header */}
        <ScrollReveal>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
              <span>{about?.badge || "Company Profile & Background"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
              {about?.heading || "Vision of Connectivity"}
            </h2>

            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mt-4 mb-3" />

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
              {about?.description || (
                <>
                  We CSD Enterprises are a premier system integrator formed in <strong>2019</strong>, dedicated to
                  delivering exceptional products and engineering services offshore and onshore with a team of
                  qualified and innovative professionals.
                </>
              )}
            </p>

            {/* Navigation Tabs for About Deep-Dive */}
            <div className="mt-8 flex items-center gap-1.5 bg-slate-100 dark:bg-navy-900 p-1.5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-press ${
                  activeTab === "overview"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Vision, Mission &amp; Objectives
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("values")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-press ${
                  activeTab === "values"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Our 9 Core Values
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("team")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all btn-press ${
                  activeTab === "team"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Management &amp; Employees
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* TAB 1: OVERVIEW & PRIMARY OBJECTIVES */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* 3 Pillar Cards: Vision, Mission, Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Formation & Vision */}
              <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60 shadow-md flex flex-col justify-between card-hover">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-5 border border-red-500/20">
                    <Radio className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    ESTABLISHED 2019
                  </span>
                  <h3 className="text-xl font-black text-navy-950 dark:text-white mt-1 mb-3">
                    System Integration &amp; Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Formed in 2019 to provide seamless connectivity with various media, essential SCADA data, and
                    hydrometrology telemetry to reputed firms, institutions, and government bodies nationwide.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Offshore &amp; Onshore Deployments</span>
                </div>
              </div>

              {/* Card 2: Our Mission */}
              <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60 shadow-md flex flex-col justify-between card-hover">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-5 border border-blue-500/20">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                    OUR MISSION
                  </span>
                  <h3 className="text-xl font-black text-navy-950 dark:text-white mt-1 mb-3">
                    Exceeding Client Expectations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    We strive to provide outstanding solutions that exceed client expectations and foster
                    long-term relationships, delivering telecom and IT applications that optimize industrial efficiency.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Long-term Trust &amp; SLA Commitment</span>
                </div>
              </div>

              {/* Card 3: Key Turnkey Activities & AMC */}
              <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60 shadow-md flex flex-col justify-between card-hover">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                    <Workflow className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    FULL LIFECYCLE SCOPE
                  </span>
                  <h3 className="text-xl font-black text-navy-950 dark:text-white mt-1 mb-3">
                    Supply, Design &amp; AMC Services
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Key activities comprise the supply, design, installation, and both <strong>Non-Comprehensive</strong> and{" "}
                    <strong>Comprehensive AMC services</strong> for all telecommunication, hydrometrology, and CCTV equipment.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>24*7 Preventive &amp; Breakdown AMC</span>
                </div>
              </div>
            </div>

            {/* Primary Objectives Box (Exact from PDF Page 2 & 3) */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-4xl">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block mb-2">
                  OFFICIAL CHARTER
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-6">
                  Our Primary Objectives &amp; Vision
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5 font-bold text-xs">
                      1
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                      <strong>Essential SCADA &amp; Hydrometrology Connectivity:</strong> To provide connectivity with
                      various media, essential SCADA data, and hydrometrology data to reputed firms, organizations,
                      and institutions via their required media of communication.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5 font-bold text-xs">
                      2
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                      <strong>Advanced Telecom Solutions:</strong> Provide telecom solutions to organizations and
                      companies in the efficient application of Information Technology (IT).
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5 font-bold text-xs">
                      3
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                      <strong>Turnkey Supply, Installation &amp; AMC:</strong> Key activities comprise the turnkey
                      supply, design, installation, and Non-Comprehensive and Comprehensive AMC services for all types of
                      Telecommunication, Hydrometrology, and CCTV equipment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OUR 9 CORE VALUES (Exact from PDF Page 4) */}
        {activeTab === "values" && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
                Guiding Principles for Our Operations
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                At CSD Enterprises, we uphold the following 9 values as guiding principles for our operations
                and business transactions nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {((about?.coreValues && about.coreValues.length > 0)
                ? about.coreValues
                : OFFICIAL_CORE_VALUES
              ).map((val, idx) => {
                const Icon =
                  typeof val.icon === "string"
                    ? ICON_MAP[val.icon] || Award
                    : (val.icon as React.ElementType) || Award;
                const colorClass = val.color || "from-red-500/20 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/30";
                return (
                  <div
                    key={val.title}
                    className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/90 dark:bg-navy-900/70 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all duration-300 card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} border flex items-center justify-center shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          0{idx + 1}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-navy-950 dark:text-white mb-2">
                        {val.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGEMENT & EMPLOYEES (Exact from PDF Page 7) */}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/70 shadow-lg">
                <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-2">
                  PEOPLE &amp; ETHOS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white mb-4">
                  Management Strategic Direction &amp; Employee Precision
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  At CSD Enterprises, our team comprises experienced professionals and skilled employees who are
                  passionate about delivering exceptional service. Our management team provides strategic direction,
                  while our employees are dedicated to executing our vision with precision and care.
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Together, we work collaboratively to drive innovation, quality, and customer satisfaction.
                  Exceeding client satisfaction motivates us to continuously improve, and deliver exceptional service,
                  ensuring our clients receive the best possible solutions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-navy-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-navy-950 dark:text-white">
                      Experienced Engineering Leadership
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-navy-950 dark:text-white">
                      Field Execution with Precision &amp; Care
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-navy-950 dark:text-white">
                      Continuous Improvement Culture
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-xs font-bold text-navy-950 dark:text-white">
                      24*7 Client Support SLA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl">
                <div className="text-3xl sm:text-4xl font-black mb-1">2019</div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-200 mb-3">
                  Year of Establishment
                </div>
                <p className="text-xs leading-relaxed text-rose-100">
                  Established with a focus on mission-critical system integration for national energy,
                  water resource, and law enforcement infrastructure.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60 shadow-sm">
                <h4 className="text-sm font-bold text-navy-950 dark:text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>24*7 Dedicated Engineering On-Call</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  We are available round-the-clock for technical inquiries, emergency field response, and AMC servicing.
                </p>
                <div className="flex items-center gap-3 text-xs font-bold text-navy-950 dark:text-white">
                  <span>Direct Hotline:</span>
                  <a href="tel:7678561876" className="text-red-600 dark:text-red-400 hover:underline">
                    +91 7678561876
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
