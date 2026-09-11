"use client";

import React from "react";
import { Award, ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import { Certification } from "@/models";

interface CertificationsSectionProps {
  certifications?: Certification[];
}

export default function CertificationsSection({ certifications = [] }: CertificationsSectionProps) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 dark:bg-navy-950/50 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Standards &amp; Regulatory Compliance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Accredited Quality &amp; Safety Certifications
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            All engineering installations, electrical enclosures, and safety systems adhere to statutory
            standards established by central authorities.
          </p>
        </div>

        {/* Certifications Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id ? String(cert._id) : cert.name}
              className="p-6 rounded-2xl glass-panel group hover:border-cyan-500/40 transition-all duration-300 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  {cert.name}
                </h3>
                <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
                  {cert.issuer}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-navy-800 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>Regulatory Audit Compliant</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
