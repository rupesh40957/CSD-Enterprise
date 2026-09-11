"use client";

import React from "react";
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Cpu,
  Award,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import { Statistic } from "@/models";

interface StatsSectionProps {
  statistics?: Statistic[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Cpu,
  Award,
  Globe,
  Users,
  Zap,
};

export default function StatsSection({ statistics }: StatsSectionProps) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className="py-12 bg-white/70 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statistics.map((item, idx) => {
            const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : Award;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel text-center shadow-sm flex flex-col items-center justify-center hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-cyan-400">
                  {item.value}
                  {item.suffix}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {item.label}
                </div>
                {item.sublabel && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.sublabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
