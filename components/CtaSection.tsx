"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PhoneCall, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { CtaContent } from "@/models";

interface CtaSectionProps {
  cta?: CtaContent | null;
}

const DEFAULT_CTA: CtaContent = {
  badge: "Engineering Turnkey Excellence",
  heading: "Ready to Upgrade Your Industrial Infrastructure?",
  highlightedText: "Partner with CSD Enterprises Today.",
  description:
    "Consult directly with senior instrumentation engineers and telecom specialists. From hazardous-zone surveillance to offshore satellite SCADA, we provide rigorous proposals and turnkey execution.",
  primaryButtonText: "Initiate Technical Consultation",
  primaryButtonUrl: "#contact",
  secondaryButtonText: "Call Engineering Desk: +91 8355976842",
  secondaryButtonUrl: "tel:+918355976842",
  backgroundImage: "/images/industrial-facility.jpg",
  emergencyContactText: "24/7 Operations Helpline",
  emergencyContactPhone: "+91 8355976842 / 9022248869",
  isActive: true,
};

export default function CtaSection({ cta }: CtaSectionProps) {
  const data = cta || DEFAULT_CTA;
  if (!data.isActive) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-navy-950 text-white border-b border-cyan-500/20">
      {/* Background Image with Deep Overlay */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.backgroundImage}
            alt="CSD Enterprises Industrial Infrastructure"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/80" />
        </div>
      )}

      {/* Radial glow accents */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6">
          {data.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{data.badge}</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {data.heading}{" "}
            {data.highlightedText && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                {data.highlightedText}
              </span>
            )}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            {data.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={data.primaryButtonUrl || "#contact"}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-navy-950 bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
            >
              <span>{data.primaryButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {data.secondaryButtonText && (
              <a
                href={data.secondaryButtonUrl || "tel:+918355976842"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-navy-900/80 hover:bg-navy-800 border border-cyan-500/30 transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>{data.secondaryButtonText}</span>
              </a>
            )}
          </div>

          {data.emergencyContactText && (
            <div className="pt-4 flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>
                {data.emergencyContactText}: <strong className="text-white">{data.emergencyContactPhone}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
