"use client";

import React from "react";
import { MapPin, Building, ShieldCheck, Radio, Check } from "lucide-react";

interface StatePresence {
  name: string;
  role: string;
  isHQ?: boolean;
}

const STATES: StatePresence[] = [
  { name: "Maharashtra", role: "Corporate Headquarters & Offshore Operations (Mumbai)", isHQ: true },
  { name: "Delhi NCR", role: "Satellite Earth Station & Central Government Projects" },
  { name: "Uttar Pradesh", role: "Industrial Automation & Large-scale IT Infrastructure" },
  { name: "Telangana", role: "Process Plant Instrumentation & SCADA Support" },
  { name: "Tamil Nadu", role: "Manufacturing SCADA & Telecommunications" },
  { name: "Karnataka", role: "IoT Engineering & Digital Systems Integration" },
  { name: "Chhattisgarh", role: "232 Statewide Police Station CCTV Surveillance" },
  { name: "Haryana", role: "Industrial Grid Telemetry & Automatic Weather Stations" },
  { name: "Pondicherry", role: "Coastal Telemetry & Specialized Communication Links" },
];

const CLIENT_LOGOS = [
  "Indian Oil Corporation Ltd (IOCL)",
  "Reliance JIO Infocomm",
  "Larsen & Toubro (L&T)",
  "Central Water Commission (CWC)",
  "Chhattisgarh Police Department",
  "State Utilities & Power Corporations",
];

export default function PanIndiaPresence() {
  return (
    <section id="presence" className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Geographic Reach
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Pan-India Footprint &amp; Offshore Presence
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Headquartered strategically in Mumbai with active deployments across 9+ states and deepwater
            offshore basins, enabling agile on-site engineering execution nationwide.
          </p>
        </div>

        {/* Client Marquee */}
        <div className="mb-16 border-y border-slate-200/80 dark:border-navy-800 py-6 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-12 text-slate-700 dark:text-slate-300 font-bold text-sm tracking-wide uppercase">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((client, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="hover:text-cyan-500 transition-colors">{client}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl glass-panel text-center shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-cyan-400">9+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              States Covered
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Offshore &amp; Onshore</div>
          </div>
          <div className="p-6 rounded-2xl glass-panel text-center shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-cyan-400">100+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Projects Deployed
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Turnkey &amp; Commissioned</div>
          </div>
          <div className="p-6 rounded-2xl glass-panel text-center shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-cyan-400">Mumbai</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Central HQ
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Nalasopara West Hub</div>
          </div>
          <div className="p-6 rounded-2xl glass-panel text-center shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-cyan-400">24/7</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Technical Ops
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Mission-Critical SLA</div>
          </div>
        </div>

        {/* State Footprint Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATES.map((state) => (
            <div
              key={state.name}
              className={`p-5 rounded-xl transition-all duration-200 border ${
                state.isHQ
                  ? "bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/40 shadow-sm"
                  : "bg-slate-50 dark:bg-navy-900/50 border-slate-200 dark:border-navy-800 hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${state.isHQ ? "text-cyan-500" : "text-slate-400"}`} />
                  <span className="font-bold text-navy-950 dark:text-white text-base">
                    {state.name}
                  </span>
                </div>
                {state.isHQ && (
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-cyan-500 text-navy-950">
                    HQ
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {state.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
