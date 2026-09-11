"use client";

import React from "react";
import { Star, Quote, Building2 } from "lucide-react";
import { Testimonial } from "@/models";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Client Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Trusted by Leaders in Energy, Telecom &amp; Defense
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Read firsthand accounts of our turnkey delivery, industrial safety compliance,
            and 24/7 mission-critical engineering execution.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id ? String(item._id) : item.name}
              className="p-8 rounded-2xl glass-panel relative flex flex-col justify-between shadow-sm group hover:border-cyan-500/40 transition-all duration-300"
            >
              <div>
                {/* Top Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-cyan-500/30" />
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-navy-800">
                <div className="font-bold text-navy-950 dark:text-white text-sm">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.designation}
                </div>
                <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
