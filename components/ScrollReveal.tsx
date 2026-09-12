"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number; // stagger index (1-8)
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay,
  threshold = 0.15,
  once = true,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const directionClass =
    direction === "left"
      ? "reveal-left"
      : direction === "right"
      ? "reveal-right"
      : direction === "scale"
      ? "reveal-scale"
      : "";

  const staggerClass = delay ? `stagger-${delay}` : "";

  const Component = Tag as keyof React.JSX.IntrinsicElements;

  return React.createElement(
    Component,
    {
      ref: ref as React.Ref<HTMLElement>,
      className: `scroll-reveal ${directionClass} ${staggerClass} ${revealed ? "revealed" : ""} ${className}`,
    },
    children
  );
}
