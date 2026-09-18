"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Sparkles, Building2, ShieldCheck, Check } from "lucide-react";
import { Client } from "@/models";

interface ClientsSectionProps {
  clients?: Client[];
}

export interface ClientItem {
  name: string;
  logo: string;
  category: "all" | "psu" | "energy" | "infra" | "telecom";
  categoryLabel: string;
  description: string;
}

export const OFFICIAL_PROFILE_CLIENTS: ClientItem[] = [
  {
    name: "Central Water Commission (CWC)",
    logo: "/images/clients/cwc.png",
    category: "psu",
    categoryLabel: "Govt / Hydrology",
    description: "Satellite Earth Receiving Station & Telemetry for river basins.",
  },
  {
    name: "Oil and Natural Gas Corporation Limited (ONGC)",
    logo: "/images/clients/ongc.svg",
    category: "energy",
    categoryLabel: "Energy / Offshore",
    description: "Offshore SCADA telemetry and hazardous area instrumentation.",
  },
  {
    name: "Indian Oil Corporation Limited (IOCL)",
    logo: "/images/clients/iocl.svg",
    category: "energy",
    categoryLabel: "Petrochemicals",
    description: "Flameproof CCTV surveillance and industrial plant networking.",
  },
  {
    name: "CONCOR Air Limited",
    logo: "/images/clients/concor.svg",
    category: "infra",
    categoryLabel: "Logistics / Air Cargo",
    description: "High-security access control, boom barriers, and surveillance.",
  },
  {
    name: "Food Corporation of India (FCI)",
    logo: "/images/clients/fci.svg",
    category: "psu",
    categoryLabel: "Central PSU",
    description: "Warehouse security automation, CCTV, and IT infrastructure.",
  },
  {
    name: "Indian Institute of Management, Indore (IIM Indore)",
    logo: "/images/clients/iim-indore.svg",
    category: "telecom",
    categoryLabel: "Premier Institution",
    description: "Campus IT networking, structured cabling, and smart security.",
  },
  {
    name: "Hindustan Petroleum Corporation Limited (HPCL)",
    logo: "/images/clients/hpcl.svg",
    category: "energy",
    categoryLabel: "Petrochemicals",
    description: "Hazardous refinery instrumentation and remote data transfer.",
  },
  {
    name: "Life Insurance Corporation of India (LIC)",
    logo: "/images/clients/lic.svg",
    category: "psu",
    categoryLabel: "Financial PSU",
    description: "Enterprise surveillance networks, EPABX, and power backups.",
  },
  {
    name: "L&T Electrical & Automation",
    logo: "/images/clients/lnt.svg",
    category: "infra",
    categoryLabel: "Engineering Conglomerate",
    description: "Turnkey electrical integration, SCADA, and offshore TSAT links.",
  },
  {
    name: "Indian Railways",
    logo: "/images/clients/indian-railways.svg",
    category: "psu",
    categoryLabel: "National Railways",
    description: "Station surveillance, OFC network establishment, and telemetry.",
  },
  {
    name: "National Fertilizer Limited (NFL)",
    logo: "/images/clients/nfl.svg",
    category: "psu",
    categoryLabel: "Industrial PSU",
    description: "Process plant automation, flow metering, and safety systems.",
  },
  {
    name: "Adani Group",
    logo: "/images/clients/adani.svg",
    category: "infra",
    categoryLabel: "Infrastructure",
    description: "Industrial port surveillance, wireless telemetry, and OFC backbone.",
  },
  {
    name: "Bharat Sanchar Nigam Limited (BSNL)",
    logo: "/images/clients/bsnl.png",
    category: "telecom",
    categoryLabel: "Telecom PSU",
    description: "Telecom carrier infrastructure, microwave links, and optical fiber.",
  },
];

const CLIENT_LOGOS: Record<string, string> = {
  "Central Water Commission": "/images/clients/cwc.png",
  "Central Water Commission (CWC)": "/images/clients/cwc.png",
  "Oil and Natural Gas Corporation Limited": "/images/clients/ongc.svg",
  "Oil and Natural Gas Corporation Limited (ONGC)": "/images/clients/ongc.svg",
  "Indian Oil Corporation Limited": "/images/clients/iocl.svg",
  "Indian Oil Corporation Limited (IOCL)": "/images/clients/iocl.svg",
  "CONCOR Air Limited": "/images/clients/concor.svg",
  "Food Corporation of India": "/images/clients/fci.svg",
  "Food Corporation of India (FCI)": "/images/clients/fci.svg",
  "Indian Institute of Management, Indore": "/images/clients/iim-indore.svg",
  "Indian Institute of Management, Indore (IIM Indore)": "/images/clients/iim-indore.svg",
  "Hindustan Petroleum Corporation Limited": "/images/clients/hpcl.svg",
  "Hindustan Petroleum Corporation Limited (HPCL)": "/images/clients/hpcl.svg",
  "Life Insurance Corporation of India": "/images/clients/lic.svg",
  "Life Insurance Corporation of India (LIC)": "/images/clients/lic.svg",
  "L&T Electrical & Automation": "/images/clients/lnt.svg",
  "Indian Railways": "/images/clients/indian-railways.svg",
  "National Fertilizer Limited": "/images/clients/nfl.svg",
  "National Fertilizer Limited (NFL)": "/images/clients/nfl.svg",
  "Adani Group": "/images/clients/adani.svg",
  "Bharat Sanchar Nigam Limited": "/images/clients/bsnl.png",
  "Bharat Sanchar Nigam Limited (BSNL)": "/images/clients/bsnl.png",
};

function getClientLogo(client: { name: string; logo?: string }): string {
  // If an explicit valid logo path is specified (not placeholder), prioritize it
  if (client.logo && client.logo !== "/logo/csd-logo.png" && client.logo.trim() !== "") {
    return client.logo;
  }
  if (CLIENT_LOGOS[client.name]) {
    return CLIENT_LOGOS[client.name];
  }
  const lower = client.name.toLowerCase();
  if (lower.includes("ongc") || lower.includes("natural gas")) return "/images/clients/ongc.svg";
  if (lower.includes("indian oil") || lower.includes("iocl")) return "/images/clients/iocl.svg";
  if (lower.includes("concor")) return "/images/clients/concor.svg";
  if (lower.includes("food corporation") || lower.includes("fci")) return "/images/clients/fci.svg";
  if (lower.includes("iim") || lower.includes("indore")) return "/images/clients/iim-indore.svg";
  if (lower.includes("hindustan petroleum") || lower.includes("hpcl")) return "/images/clients/hpcl.svg";
  if (lower.includes("life insurance") || lower.includes("lic")) return "/images/clients/lic.svg";
  if (lower.includes("l&t") || lower.includes("larsen") || lower.includes("toubro")) return "/images/clients/lnt.svg";
  if (lower.includes("railway")) return "/images/clients/indian-railways.svg";
  if (lower.includes("fertilizer") || lower.includes("nfl")) return "/images/clients/nfl.svg";
  if (lower.includes("adani")) return "/images/clients/adani.svg";
  if (lower.includes("bsnl") || lower.includes("sanchar")) return "/images/clients/bsnl.png";
  if (lower.includes("water commission") || lower.includes("cwc")) return "/images/clients/cwc.png";
  return client.logo || "/images/clients/iocl.svg";
}

export default function ClientsSection({ clients = [] }: ClientsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const combinedClients = useMemo(() => {
    // If DB clients exist, map them dynamically
    if (clients && clients.length > 0) {
      return clients.map((c) => {
        const matched = OFFICIAL_PROFILE_CLIENTS.find(
          (o) =>
            o.name.toLowerCase().includes(c.name.toLowerCase().slice(0, 8)) ||
            c.name.toLowerCase().includes(o.name.toLowerCase().slice(0, 8))
        );
        return {
          name: c.name,
          logo: getClientLogo(c),
          category: matched ? matched.category : ("psu" as const),
          categoryLabel: matched ? matched.categoryLabel : "Enterprise Partner",
          description:
            matched?.description || "Turnkey industrial systems engineering integration partner.",
        };
      });
    }
    return OFFICIAL_PROFILE_CLIENTS;
  }, [clients]);

  const filteredClients = useMemo(() => {
    if (activeCategory === "all") return combinedClients;
    return combinedClients.filter((c) => c.category === activeCategory);
  }, [combinedClients, activeCategory]);

  return (
    <section
      id="clients"
      className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 transition-colors relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-red-600/5 dark:bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span>Valuable Clients PAN India</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
            Trusted by India&apos;s Critical Organizations
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mt-4 mb-3" />
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            From national oil corporations and central water resource commissions to Indian Railways
            and state utilities, CSD Enterprises delivers mission-critical system integration.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: `All Clients (${combinedClients.length})` },
              { id: "energy", label: "Oil, Gas & Energy" },
              { id: "psu", label: "Govt & Central PSUs" },
              { id: "infra", label: "Infrastructure & Logistics" },
              { id: "telecom", label: "Telecom & Education" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-press ${
                  activeCategory === cat.id
                    ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                    : "bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Marquee Banner with all dynamic clients */}
        <div className="mb-14 border-y border-slate-200/80 dark:border-navy-800/80 py-4 overflow-hidden relative bg-slate-50/70 dark:bg-navy-900/40">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-10 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm tracking-wider uppercase">
            {[...combinedClients, ...combinedClients].map((client, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 shadow-sm shadow-red-500/50" />
                <span className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Logos Grid - High-End Enterprise Presentation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {filteredClients.map((client, idx) => {
            const logoUrl = getClientLogo(client);

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel flex flex-col justify-between group hover:border-red-500/50 dark:hover:border-red-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-500/10 card-hover bg-white/95 dark:bg-navy-900/80 border border-slate-200 dark:border-navy-800"
              >
                {/* Header with Sector Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                    {client.categoryLabel}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                </div>

                {/* Official Logo Container */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl bg-white dark:bg-white p-3 border border-slate-200/80 dark:border-slate-200 shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300 shrink-0">
                  <Image
                    src={logoUrl}
                    alt={`${client.name} official logo`}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full max-h-20"
                    unoptimized
                    priority
                  />
                </div>

                {/* Partner Name & Scope */}
                <div className="w-full text-center mt-auto">
                  <h3 className="text-sm font-bold text-navy-950 dark:text-white leading-snug tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                    {client.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {client.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
