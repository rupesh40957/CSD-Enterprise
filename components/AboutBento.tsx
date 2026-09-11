"use client";

import React from "react";
import {
  ShieldCheck,
  Star,
  Users,
  Cpu,
  Target,
  Award,
  CheckCircle,
  Zap,
} from "lucide-react";
import { AboutContent } from "@/models";

interface AboutBentoProps {
  about?: AboutContent | null;
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  Star,
  Users,
  Cpu,
  Target,
  Award,
  CheckCircle,
  Zap,
};

const DEFAULT_ABOUT: AboutContent = {
  badge: "Company Background & Ethos",
  heading: "Engineering Precision Built for India's Critical Infrastructure",
  description:
    "Formed in 2019, CSD Enterprises serves as an elite industrial system integrator and turnkey engineering partner across offshore deepwater facilities and onshore industrial plants nationwide.",
  visionTitle: "Our Vision & Strategic Approach",
  visionDescription:
    "We take a personalized, hands-on engineering approach to every client requirement—working closely with plant engineers, operations chiefs, and defense coordinators to deploy tailored automation, surveillance, and telemetry systems.",
  experienceBadge: "Established 2019",
  statsOffshore: "Offshore",
  statsOffshoreSub: "Deepwater Satcom & SCADA",
  statsOnshore: "Onshore",
  statsOnshoreSub: "Power, Oil, Gas & Police",
  coreValues: [
    {
      icon: "ShieldCheck",
      title: "Integrity",
      description:
        "Transparent engineering practices, uncompromised industrial safety compliance, and ethical client engagements across hazardous and defense facilities.",
      highlight: "Safety & Compliance First",
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400",
    },
    {
      icon: "Star",
      title: "Excellence",
      description:
        "Rigorous adherence to global PLC/DCS, SCADA, and telecom engineering standards, ensuring fault-tolerant performance in high-stakes environments.",
      highlight: "Industrial-Grade Reliability",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
    },
    {
      icon: "Users",
      title: "Collaboration",
      description:
        "Long-term engineering partnerships with India's largest PSUs, EPC contractors, telecom pioneers, and state law enforcement agencies.",
      highlight: "Trusted Partner Ecosystem",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    },
    {
      icon: "Cpu",
      title: "Innovation",
      description:
        "Pioneering IoT telemetry, solar-powered hydrometrology Automatic Weather Stations, and satellite earth stations for remote automated intelligence.",
      highlight: "Next-Gen Telemetry & IoT",
      color: "from-purple-500/20 to-cyan-500/20 text-purple-400",
    },
  ],
};

export default function AboutBento({ about }: AboutBentoProps) {
  const data = about || DEFAULT_ABOUT;

  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-navy-950/60 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            {data.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Story Card */}
          <div className="md:col-span-12 lg:col-span-5 p-8 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-navy-900 text-cyan-400 text-xs font-semibold mb-6">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>{data.experienceBadge}</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mb-4">
                {data.visionTitle}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                {data.visionDescription}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Our experienced workforce spans certified PLC/SCADA specialists, optical fiber
                cable engineers, explosion-proof installation masters, and satellite communication
                experts handling offshore Mumbai High platforms to remote border stations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 mt-8 border-t border-slate-200 dark:border-navy-800">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-cyan-500/10">
                <div className="text-2xl font-bold text-navy-950 dark:text-cyan-400">
                  {data.statsOffshore}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {data.statsOffshoreSub}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-cyan-500/10">
                <div className="text-2xl font-bold text-navy-950 dark:text-cyan-400">
                  {data.statsOnshore}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {data.statsOnshoreSub}
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Bento Subgrid */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.coreValues && data.coreValues.map((value) => {
              const Icon = ICON_MAP[value.icon] || ShieldCheck;
              return (
                <div
                  key={value.title}
                  className="p-6 rounded-2xl glass-panel group hover:border-cyan-500/40 transition-all duration-300 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${value.color || "from-blue-500/20 to-cyan-500/20 text-cyan-400"} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300">
                        {value.highlight}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-navy-950 dark:text-white mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {value.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200/60 dark:border-navy-800/80 flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    <Target className="w-3.5 h-3.5" />
                    <span>Proven Enterprise Track Record</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
