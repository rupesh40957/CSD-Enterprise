"use client";

import React from "react";
import Image from "next/image";
import { Building, ExternalLink } from "lucide-react";
import { Client } from "@/models";

interface ClientsSectionProps {
  clients?: Client[];
}

export default function ClientsSection({ clients = [] }: ClientsSectionProps) {
  if (!clients || clients.length === 0) return null;

  return (
    <section id="clients" className="py-20 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Trusted by India&apos;s Pioneers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Premier Clients &amp; Enterprise Partners
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Delivering trusted system integration for national oil corporations, telecom giants,
            state police commands, and central water resources agencies.
          </p>
        </div>

        {/* Marquee Banner */}
        <div className="mb-14 border-y border-slate-200/80 dark:border-navy-800 py-6 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-navy-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-12 text-slate-700 dark:text-slate-300 font-bold text-sm tracking-wide uppercase">
            {[...clients, ...clients].map((client, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="hover:text-cyan-500 transition-colors">{client.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div
              key={client._id ? String(client._id) : client.name}
              className="p-5 rounded-2xl glass-panel flex flex-col items-center justify-center text-center group hover:border-cyan-500/40 transition-all duration-300 shadow-sm min-h-[110px]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center justify-center text-cyan-500 mb-2 group-hover:scale-110 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-navy-950 dark:text-white line-clamp-2">
                {client.name}
              </span>
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-cyan-600 dark:text-cyan-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span>Website</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
