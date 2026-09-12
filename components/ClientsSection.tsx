"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Client } from "@/models";

interface ClientsSectionProps {
  clients?: Client[];
}

const DEFAULT_CLIENTS: { name: string; logo: string }[] = [
  { name: "Indian Oil Corporation Limited (IOCL)", logo: "/images/clients/iocl.svg" },
  { name: "Reliance JIO Infocomm", logo: "/images/clients/jio.svg" },
  { name: "Larsen & Toubro (L&T)", logo: "/images/clients/lnt.svg" },
  { name: "Central Water Commission (CWC Delhi)", logo: "/images/clients/cwc.svg" },
  { name: "Chhattisgarh State Police Department", logo: "/images/clients/cg-police.svg" },
  { name: "Bharat Petroleum Corporation Ltd (BPCL)", logo: "/images/clients/bpcl.svg" },
];

const CLIENT_LOGOS: Record<string, string> = {
  "Indian Oil Corporation Limited (IOCL)": "/images/clients/iocl.svg",
  "Reliance JIO Infocomm": "/images/clients/jio.svg",
  "Larsen & Toubro (L&T)": "/images/clients/lnt.svg",
  "Central Water Commission (CWC Delhi)": "/images/clients/cwc.svg",
  "Chhattisgarh State Police Department": "/images/clients/cg-police.svg",
  "Bharat Petroleum Corporation Ltd (BPCL)": "/images/clients/bpcl.svg",
};

function getClientLogo(client: { name: string; logo?: string }): string {
  if (client.logo && client.logo.startsWith("/images/clients/")) {
    return client.logo;
  }
  if (CLIENT_LOGOS[client.name]) {
    return CLIENT_LOGOS[client.name];
  }
  const lower = client.name.toLowerCase();
  if (lower.includes("indian oil") || lower.includes("iocl")) return "/images/clients/iocl.svg";
  if (lower.includes("reliance") || lower.includes("jio")) return "/images/clients/jio.svg";
  if (lower.includes("larsen") || lower.includes("l&t") || lower.includes("toubro")) return "/images/clients/lnt.svg";
  if (lower.includes("water commission") || lower.includes("cwc")) return "/images/clients/cwc.svg";
  if (lower.includes("police")) return "/images/clients/cg-police.svg";
  if (lower.includes("bharat petroleum") || lower.includes("bpcl")) return "/images/clients/bpcl.svg";
  return client.logo || "/images/clients/iocl.svg";
}

export default function ClientsSection({ clients = [] }: ClientsSectionProps) {
  const displayClients = clients && clients.length > 0 ? clients : DEFAULT_CLIENTS;

  return (
    <section
      id="clients"
      className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 transition-colors relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/5 dark:bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span>Trusted by India&apos;s Pioneers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
            Premier Clients &amp; Enterprise Partners
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mt-4 mb-3" />
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Delivering trusted system integration for national oil corporations, telecom giants,
            state police commands, and central water resources agencies.
          </p>
        </div>

        {/* Marquee Banner */}
        <div className="mb-14 border-y border-slate-200/80 dark:border-navy-800/80 py-5 overflow-hidden relative bg-slate-50/60 dark:bg-navy-900/30">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-12 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm tracking-wider uppercase">
            {[...displayClients, ...displayClients].map((client, idx) => (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {displayClients.map((client) => {
            const logoUrl = getClientLogo(client);

            return (
              <div
                key={(" _id" in client && client._id) ? String(client._id) : client.name}
                className="p-5 sm:p-6 rounded-2xl glass-panel flex flex-col items-center justify-between text-center group hover:border-red-500/50 dark:hover:border-red-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-500/10 min-h-[175px] sm:min-h-[195px] card-hover bg-white/90 dark:bg-navy-900/70 border border-slate-200/90 dark:border-navy-800"
              >
                {/* Official Logo Container */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-navy-950 p-2 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-red-500/40 group-hover:shadow-md transition-all duration-300 shrink-0">
                  <Image
                    src={logoUrl}
                    alt={`${client.name} official logo`}
                    width={72}
                    height={72}
                    className="object-contain w-full h-full max-h-14 max-w-14"
                    unoptimized
                    priority
                  />
                </div>

                {/* Partner Name - Fully visible, never clipped or faded */}
                <div className="w-full mt-auto">
                  <h3 className="text-xs sm:text-[13px] font-bold text-navy-950 dark:text-white leading-snug tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {client.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
