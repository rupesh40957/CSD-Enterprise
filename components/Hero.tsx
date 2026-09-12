"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Activity,
  Radio,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HeroSlide } from "@/models";

interface HeroProps {
  slides?: HeroSlide[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    badge: "Active across 9+ States | Mission-Critical 24/7",
    heading: "Empowering Industries with",
    highlightedText: "Advanced Automation & IT Infrastructure.",
    description:
      "Delivering exceptional PLC/SCADA, CCTV Surveillance, and Satcom solutions for offshore and onshore enterprise clients since 2019. Trusted by India's premier energy, telecommunications, and defense organizations.",
    primaryCtaText: "Explore Our Solutions",
    primaryCtaUrl: "#services",
    secondaryCtaText: "View Prestigious Projects",
    secondaryCtaUrl: "#projects",
    image: "/images/automation-hero.jpg",
    systemUptime: "99.98% System Uptime",
    telemetryItems: [
      { label: "Flameproof SCADA & PLC", value: "Active" },
      { label: "Explosion-Proof CCTV", value: "Verified" },
      { label: "Solar AWS Hydrometrology", value: "Transmitting" },
      { label: "Offshore TSAT Links", value: "Online" },
    ],
    sortOrder: 0,
    isActive: true,
  },
];

export default function Hero({ slides }: HeroProps) {
  const activeSlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center tech-grid overflow-hidden border-b border-slate-200/80 dark:border-cyan-500/10"
    >
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-blue-600/10 dark:bg-blue-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Dynamic Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Status Metric Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-navy-900/90 border border-slate-300/80 dark:border-cyan-500/30 text-xs font-semibold text-slate-800 dark:text-cyan-400 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>{currentSlide.badge}</span>
            </div>

            {/* Main Headline with Highlight */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy-950 dark:text-white leading-[1.15]">
              {currentSlide.heading}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400">
                {currentSlide.highlightedText}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              {currentSlide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={currentSlide.primaryCtaUrl || "#services"}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition-all duration-200 btn-press"
              >
                <span>{currentSlide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {currentSlide.secondaryCtaText && (
                <Link
                  href={currentSlide.secondaryCtaUrl || "#projects"}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-navy-900/80 dark:hover:bg-navy-800 border border-slate-300/80 dark:border-slate-700 rounded-xl transition-all duration-200 btn-press"
                >
                  <span>{currentSlide.secondaryCtaText}</span>
                </Link>
              )}
            </div>

            {/* Carousel Slide Controls (if multiple slides) */}
            {activeSlides.length > 1 && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
                    )
                  }
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {activeSlides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === i
                          ? "w-8 bg-cyan-500"
                          : "w-2 bg-slate-300 dark:bg-navy-800"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Industrial Mockup Card & Real-Time Telemetry */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl cyan-glow">
              <div className="relative h-[320px] sm:h-[400px] w-full rounded-xl overflow-hidden bg-navy-950">
                <Image
                  src={currentSlide.image || "/images/automation-hero.jpg"}
                  alt="Industrial Automation & Control Systems"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

                {/* SCADA Status Overlay Banner */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-lg bg-navy-950/85 backdrop-blur-md border border-cyan-500/30 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-medium">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                    <span>SCADA TELEMETRY: ONLINE</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">LATENCY: 12ms</span>
                </div>

                {/* Bottom Real-time Telemetry Card */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-navy-900/90 backdrop-blur-md border border-cyan-500/20 text-white">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      Offshore / Onshore Telemetry Grid
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      OPERATIONAL
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {currentSlide.telemetryItems && currentSlide.telemetryItems.length > 0 ? (
                      currentSlide.telemetryItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Flameproof SCADA &amp; PLC</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>Explosion-Proof CCTV</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* System Badge */}
            {currentSlide.systemUptime && (
              <div className="hidden sm:flex absolute -bottom-5 -left-5 p-3 rounded-xl glass-panel shadow-xl border border-slate-200 dark:border-cyan-500/30 items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-950 dark:text-white">
                    {currentSlide.systemUptime}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Offshore Deepwater &amp; Remote Nodes
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
