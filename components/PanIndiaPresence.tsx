"use client";

import React, { useState } from "react";
import { MapPin, Building, ShieldCheck, Phone, CheckCircle2, ArrowRight, Table, LayoutGrid } from "lucide-react";

interface RegionalOffice {
  srNo: number;
  region: string;
  city: string;
  focus: string;
  isHQ?: boolean;
}

const REGIONAL_OFFICES: RegionalOffice[] = [
  {
    srNo: 0,
    region: "Maharashtra (Corporate Headquarters)",
    city: "Mumbai",
    focus: "Strategic Management, Turnkey EPC Operations & Offshore Satcom",
    isHQ: true,
  },
  {
    srNo: 1,
    region: "Delhi NCR",
    city: "Noida",
    focus: "Satellite Earth Receiving Station (ERS), CWC & Central Govt Tenders",
  },
  {
    srNo: 2,
    region: "Gujarat",
    city: "Ahmedabad",
    focus: "Petrochemical Refineries, Port Infrastructure & Gas Terminals",
  },
  {
    srNo: 3,
    region: "Telangana",
    city: "Hyderabad",
    focus: "Process Instrumentation, SCADA Data Transfer & IT Infrastructure",
  },
  {
    srNo: 4,
    region: "Gujarat (West Hub)",
    city: "Ahmedabad",
    focus: "Renewable Solar Mega Parks & High-Voltage Automation",
  },
  {
    srNo: 5,
    region: "Uttar Pradesh",
    city: "Lucknow",
    focus: "Industrial Automation, Water Resource AWS & Enterprise Networks",
  },
  {
    srNo: 6,
    region: "Chhattisgarh",
    city: "Raipur",
    focus: "Statewide 232 Police Station CCTV Surveillance & Industrial Grid",
  },
  {
    srNo: 7,
    region: "West Bengal",
    city: "Kolkata",
    focus: "Eastern Regional Ports, River Basin AWLR & OFC Backbones",
  },
  {
    srNo: 8,
    region: "Assam",
    city: "Guwahati",
    focus: "North-Eastern Hydrometrology, Microwave Links & Oil Fields",
  },
  {
    srNo: 9,
    region: "Odisha",
    city: "Bhubaneswar",
    focus: "Mining Sector CCTV, Coastal Weather Stations & Industrial EPC",
  },
];

export default function PanIndiaPresence() {
  const [viewFormat, setViewFormat] = useState<"grid" | "table">("grid");

  return (
    <section id="presence" className="py-24 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3 shadow-sm">
            Pan-India Geographic Footprint
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
            Our Presence Across India
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mt-4 mb-3" />
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Our headquarters is strategically located in <strong>Mumbai</strong>, with a strong presence in all
            major cities and key remote locations across India. This extensive network enables us to deliver our
            services effectively and efficiently to clients nationwide.
          </p>

          {/* View Switcher Toggle */}
          <div className="mt-8 flex items-center gap-1.5 bg-white dark:bg-navy-900 p-1.5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm">
            <button
              type="button"
              onClick={() => setViewFormat("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all btn-press ${
                viewFormat === "grid"
                  ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Regional Hub Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewFormat("table")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all btn-press ${
                viewFormat === "table"
                  ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Official Directory Table</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          <div className="p-5 rounded-2xl glass-panel text-center shadow-sm border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60">
            <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">9+</div>
            <div className="text-xs sm:text-sm font-bold text-navy-950 dark:text-white mt-1">
              Key Regions Covered
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Offshore &amp; Onshore</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel text-center shadow-sm border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60">
            <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">Mumbai</div>
            <div className="text-xs sm:text-sm font-bold text-navy-950 dark:text-white mt-1">
              Corporate Headquarters
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Nalasopara West Central Hub</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel text-center shadow-sm border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60">
            <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">24/7</div>
            <div className="text-xs sm:text-sm font-bold text-navy-950 dark:text-white mt-1">
              Technical On-Call Support
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Call &amp; Msg: 7678561876</div>
          </div>
          <div className="p-5 rounded-2xl glass-panel text-center shadow-sm border border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/60">
            <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">100%</div>
            <div className="text-xs sm:text-sm font-bold text-navy-950 dark:text-white mt-1">
              Pan-India SLA Execution
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Rapid Field Dispatch</div>
          </div>
        </div>

        {/* View Format 1: Modern Interactive Cards */}
        {viewFormat === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REGIONAL_OFFICES.map((office) => (
              <div
                key={`${office.region}-${office.city}-${office.srNo}`}
                className={`p-6 rounded-2xl transition-all duration-300 border card-hover flex flex-col justify-between ${
                  office.isHQ
                    ? "bg-gradient-to-br from-red-600/10 via-rose-500/5 to-transparent border-red-500/40 shadow-lg shadow-red-500/5 col-span-1 md:col-span-2 lg:col-span-1"
                    : "bg-white/90 dark:bg-navy-900/70 border-slate-200 dark:border-navy-800 hover:border-red-500/30 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                      {office.isHQ ? "CENTRAL HQ" : `REGION 0${office.srNo}`}
                    </span>
                    {office.isHQ ? (
                      <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-600 text-white shadow-sm shadow-red-600/30">
                        HEADQUARTERS
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {office.city}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-navy-950 dark:text-white mb-1">
                    {office.region}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">
                    <Building className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Office Location: <strong className="text-navy-950 dark:text-white">{office.city}</strong></span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {office.focus}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Operational &amp; Active
                  </span>
                  <a
                    href="#contact"
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Format 2: Official Directory Table (from PDF Page 8) */}
        {viewFormat === "table" && (
          <div className="rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-sm bg-white dark:bg-navy-900/80 backdrop-blur-md">
            <div className="p-5 border-b border-slate-200 dark:border-navy-800 bg-slate-50/70 dark:bg-navy-950/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-navy-950 dark:text-white">
                  Official Presence Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Exact corporate registry as published in CSD Enterprises Company Profile
                </p>
              </div>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                10 Strategic Hubs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-100/60 dark:bg-navy-950/40 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Sr. No.</th>
                    <th className="py-3.5 px-5">Region</th>
                    <th className="py-3.5 px-5">Office Location</th>
                    <th className="py-3.5 px-5 hidden md:table-cell">Key Engineering Scope</th>
                    <th className="py-3.5 px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 text-slate-600 dark:text-slate-300">
                  {REGIONAL_OFFICES.map((off) => (
                    <tr
                      key={off.srNo}
                      className={`hover:bg-slate-50/80 dark:hover:bg-navy-800/40 transition-colors ${
                        off.isHQ ? "bg-red-500/5 font-semibold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono text-slate-400">
                        {off.isHQ ? "HQ" : off.srNo}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-navy-950 dark:text-white">
                        {off.region}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-red-600 dark:text-red-400">
                        {off.city}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell">
                        {off.focus}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
