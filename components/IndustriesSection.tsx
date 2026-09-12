"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Shield,
  Radio,
  CloudSun,
  Zap,
  Cpu,
  ArrowRight,
  Factory,
} from "lucide-react";
import { Industry } from "@/models";

interface IndustriesSectionProps {
  industries?: Industry[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Shield,
  Radio,
  CloudSun,
  Zap,
  Cpu,
  Factory,
};

export default function IndustriesSection({ industries = [] }: IndustriesSectionProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section id="industries" className="py-24 bg-slate-50 dark:bg-navy-950/70 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Sectors &amp; Environments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Industries We Transform With Advanced Engineering
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Engineered specifically to meet demanding compliance standards in hazardous, remote,
            and mission-critical environments across India.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => {
            const Icon = (ind.icon && ICON_MAP[ind.icon]) || Factory;
            return (
              <div
                key={ind.slug || String(ind._id)}
                className="glass-panel rounded-2xl overflow-hidden group hover:border-red-500/40 dark:hover:border-red-500/30 transition-all duration-300 shadow-sm flex flex-col justify-between card-hover"
              >
                <div>
                  <div className="relative h-44 w-full bg-navy-950 overflow-hidden">
                    <Image
                      src={ind.image || "/images/industrial-facility.jpg"}
                      alt={ind.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-navy-900/90 border border-cyan-500/30 flex items-center justify-center text-cyan-400 backdrop-blur-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {ind.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {ind.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 group-hover:translate-x-1 transition-all"
                  >
                    <span>Request Sector RFQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
