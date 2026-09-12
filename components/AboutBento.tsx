"use client";

import React from "react";
import Image from "next/image";
import { AboutContent } from "@/models";
import { Sparkles, CheckCircle2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface AboutBentoProps {
  about?: AboutContent | null;
}

interface AboutSectionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  list?: string[];
}

const DEFAULT_CARDS: AboutSectionCard[] = [
  {
    id: "establishment",
    title: "Establishment",
    description:
      "We are system integrator was formed in 2019 and dedicated to delivering exceptional products and services to our clients offshore and onshore.",
    image: "/images/about/establishment.jpg",
  },
  {
    id: "vision",
    title: "Our Vision",
    description:
      "Our vision is to provide top-notch services & we strive to provide outstanding solutions that exceed client expectations and foster long-term relationships.",
    image: "/images/about/vision.jpg",
  },
  {
    id: "approach",
    title: "Our Approach",
    description:
      "We take a personalized approach to each client's needs, working closely with them to understand their unique challenges and develop customized solutions.",
    image: "/images/about/approach.svg",
  },
  {
    id: "expertise",
    title: "Our Expertise",
    description:
      "We have experienced and expert professionals in PLC, SCADA, CCTV Surveillance System, IT & Networking Infrastructure, Hydrometeorology & Satcom for offshore & onshore locations.",
    image: "/images/about/expertise.svg",
  },
  {
    id: "management",
    title: "Management & Employees",
    description:
      "Our management provides strategic direction, while our employees are dedicated to executing our vision with precision and care. Together, we work collaboratively to drive innovation, quality, and customer satisfaction.",
    image: "/images/about/management.svg",
  },
  {
    id: "core-values",
    title: "Our Core Values",
    description:
      "Upholding the highest ethical standards, operational safety, and engineering excellence across every mission-critical deployment.",
    image: "/images/about/core-values.svg",
    list: ["Integrity", "Excellence", "Collaboration", "Innovation"],
  },
];

export default function AboutBento({ about }: AboutBentoProps) {
  // If about data is customized in DB, map it or fallback to the reference image structure
  const cards: AboutSectionCard[] = React.useMemo(() => {
    if (about?.cards && about.cards.length > 0) {
      return about.cards.map((c, idx) => ({
        id: c.id || `card-${idx}`,
        title: c.title,
        description: c.description || "",
        image: c.image || DEFAULT_CARDS[idx]?.image || "/images/about/establishment.jpg",
        list:
          c.list && c.list.length > 0
            ? c.list
            : c.id === "core-values" || idx === 5
            ? about.coreValues && about.coreValues.length > 0
              ? about.coreValues.map((v) => v.title)
              : ["Integrity", "Excellence", "Collaboration", "Innovation"]
            : undefined,
      }));
    }

    return [
      {
        id: "establishment",
        title: "Establishment",
        description: about?.description || DEFAULT_CARDS[0].description,
        image: about?.establishmentImage || "/images/about/establishment.jpg",
      },
      {
        id: "vision",
        title: about?.visionTitle || "Our Vision",
        description: about?.visionDescription || DEFAULT_CARDS[1].description,
        image: about?.visionImage || "/images/about/vision.jpg",
      },
      {
        id: "approach",
        title: "Our Approach",
        description:
          DEFAULT_CARDS[2].description,
        image: about?.approachImage || "/images/about/approach.svg",
      },
      {
        id: "expertise",
        title: "Our Expertise",
        description:
          about?.statsOffshoreSub && about?.statsOnshoreSub
            ? `We have experienced and expert professionals in PLC, SCADA, CCTV Surveillance System, IT & Networking Infrastructure, ${about.statsOffshoreSub} & ${about.statsOnshoreSub}.`
            : DEFAULT_CARDS[3].description,
        image: about?.expertiseImage || "/images/about/expertise.svg",
      },
      {
        id: "management",
        title: "Management & Employees",
        description:
          DEFAULT_CARDS[4].description,
        image: about?.managementImage || "/images/about/management.svg",
      },
      {
        id: "core-values",
        title: "Our Core Values",
        description:
          "Upholding the highest ethical standards, operational safety, and engineering excellence across every mission-critical deployment.",
        image: about?.coreValuesImage || "/images/about/core-values.svg",
        list:
          about?.coreValues && about.coreValues.length > 0
            ? about.coreValues.map((v) => v.title)
            : ["Integrity", "Excellence", "Collaboration", "Innovation"],
      },
    ];
  }, [about]);

  const badgeText = about?.badge || "Company Background & Ethos";
  const headingText = about?.heading || "About Us";

  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 transition-colors relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Section Header */}
        <ScrollReveal>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
              {headingText}
            </h2>

            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full mt-4 mb-2" />
          </div>
        </ScrollReveal>

        {/* 3-Column Image + Description Layout (Exact Reference Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14">
          {cards.map((card, cardIdx) => (
            <ScrollReveal
              key={card.id}
              direction={cardIdx % 3 === 0 ? "left" : cardIdx % 3 === 2 ? "right" : "up"}
              delay={(cardIdx % 3 + 1) as 1 | 2 | 3}
            >
              <div
                className="flex flex-col items-center text-center group transition-all duration-300 p-5 rounded-3xl hover:bg-slate-50/80 dark:hover:bg-navy-900/40 card-hover"
              >
                {/* Circular Image Container */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-slate-200/90 dark:border-navy-700/80 shadow-md group-hover:border-red-500/60 group-hover:shadow-xl group-hover:shadow-red-500/20 group-hover:scale-105 transition-all duration-300 mb-6 bg-slate-100 dark:bg-navy-900 glow-ring">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 160px, 192px"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-navy-950 dark:text-white tracking-tight mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              {card.description && !card.list && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs sm:max-w-sm">
                  {card.description}
                </p>
              )}

              {/* Clean Vertical Values List for Card 6 (Exact Reference Style) */}
              {card.list && card.list.length > 0 && (
                <div className="flex flex-col items-center justify-center space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {card.list.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
