"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Cpu,
  Award,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import { Statistic } from "@/models";
import ScrollReveal from "./ScrollReveal";

interface StatsSectionProps {
  statistics?: Statistic[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Cpu,
  Award,
  Globe,
  Users,
  Zap,
};

/** Animated counter hook — counts up from 0 to target value */
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, start]);

  return count;
}

function AnimatedStat({ item, index }: { item: Statistic; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : Award;

  // Extract numeric value from stat value string
  const numericMatch = String(item.value).match(/(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const prefix = String(item.value).match(/^([^\d]*)/)?.[1] || "";
  const animatedCount = useCountUp(numericValue, 1600, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ScrollReveal delay={(index % 5 + 1) as 1 | 2 | 3 | 4 | 5} direction="scale">
      <div
        ref={ref}
        className="p-5 rounded-2xl glass-panel text-center shadow-sm flex flex-col items-center justify-center hover:border-cyan-500/40 transition-all duration-300 shimmer-border"
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-cyan-400">
          {prefix}{visible ? animatedCount : 0}
          {item.suffix}
        </div>
        <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
          {item.label}
        </div>
        {item.sublabel && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {item.sublabel}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}

export default function StatsSection({ statistics }: StatsSectionProps) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className="py-12 bg-white/70 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statistics.map((item, idx) => (
            <AnimatedStat key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
