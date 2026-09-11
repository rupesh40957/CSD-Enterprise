"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Faq } from "@/models";

interface FaqSectionProps {
  faqs?: Faq[];
}

export default function FaqSection({ faqs = [] }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  if (!faqs || faqs.length === 0) return null;

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  const filteredFaqs = faqs.filter((f) => {
    if (activeCategory === "All") return true;
    return f.category === activeCategory;
  });

  return (
    <section id="faq" className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl">
            Quick answers regarding our engineering capabilities, statutory safety compliance,
            and turnkey procurement processes.
          </p>

          {/* Categories */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIdx(null);
                  }}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    activeCategory === cat
                      ? "bg-navy-950 text-white dark:bg-cyan-500 dark:text-navy-950 border-navy-950 dark:border-cyan-400"
                      : "bg-slate-100 dark:bg-navy-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq._id ? String(faq._id) : idx}
                className="rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden bg-slate-50/50 dark:bg-navy-900/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-navy-950 dark:text-white text-base">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1 rounded-lg bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-500" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-navy-800/50 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
