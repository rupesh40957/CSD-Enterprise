"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronRight, PhoneCall } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { WebsiteSettings, NavigationItem } from "@/models";

interface NavbarProps {
  settings?: WebsiteSettings | null;
  navItems?: NavigationItem[];
}

const DEFAULT_NAV: { label: string; href: string }[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "Projects", href: "#projects" },
  { label: "Clients", href: "#clients" },
  { label: "Presence", href: "#presence" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ settings, navItems }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#hero");
  const isClickingRef = useRef(false);

  const items = navItems && navItems.length > 0
    ? navItems.filter((i) => i.isActive)
    : DEFAULT_NAV;

  // Real-time ScrollSpy with requestAnimationFrame throttling
  useEffect(() => {
    const sectionIds = items
      .map((item) => item.href)
      .filter((href) => href.startsWith("#"))
      .map((href) => href.replace("#", ""));

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 20);

          // If a manual click-scroll is animating, skip spy override temporarily
          if (isClickingRef.current) {
            ticking = false;
            return;
          }

          // 1. Top of page activates #hero
          if (scrollY < 120) {
            setActiveSection("#hero");
            ticking = false;
            return;
          }

          // 2. Bottom of page activates #contact
          const scrollPosition = scrollY + window.innerHeight;
          if (scrollPosition >= document.documentElement.scrollHeight - 60) {
            setActiveSection("#contact");
            ticking = false;
            return;
          }

          // 3. Find which section is currently at or above the viewport trigger offset
          const headerOffset = 100;
          let current = "#hero";

          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= headerOffset) {
                current = `#${id}`;
              }
            }
          }

          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  // Smooth scroll and immediate active state change on click
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        setActiveSection(href);
        setMobileMenuOpen(false);

        isClickingRef.current = true;
        setTimeout(() => {
          isClickingRef.current = false;
        }, 900);

        const targetId = href.replace("#", "");
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = 74;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          if (typeof window !== "undefined" && window.history.pushState) {
            window.history.pushState(null, "", href);
          }
        }
      }
    },
    []
  );

  const logoSrc = settings?.logo && settings.logo !== "/logo/csd-logo.png" ? settings.logo : "/logo/csd-logo.svg";
  const companyName = settings?.companyName || "CSD Enterprises";
  const tagline = settings?.tagline || "UNIT OF CSD AUTOMATION & TECHNOLOGIES";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-navy-950/95 backdrop-blur-md shadow-md shadow-slate-900/5 dark:shadow-red-950/20 border-b border-slate-200/80 dark:border-red-500/20 py-2.5"
          : "bg-white/80 dark:bg-navy-950/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-navy-800/60 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-[50px] h-[32px] sm:w-[56px] sm:h-[36px] rounded-xl overflow-hidden bg-white dark:bg-navy-900 p-1 border border-slate-200 dark:border-red-500/30 shadow-sm shadow-red-500/10 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Image
                src={logoSrc}
                alt={`${companyName} Logo`}
                width={56}
                height={36}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-red-600 dark:text-red-500 flex items-center gap-1.5 leading-none">
                <span>CSD</span> <span className="text-red-600 dark:text-red-500">Enterprises</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with real-time ScrollSpy & Active Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {items.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3.5 py-1.5 text-xs xl:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-red-600 dark:text-red-400 font-bold bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-navy-900/60"
                  }`}
                >
                  <span>{item.label}</span>

                  {/* Active bottom red indicator line */}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] bg-red-600 dark:bg-red-500 rounded-full shadow-sm shadow-red-500/50 animate-in fade-in duration-200" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Elements */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            {/* Request Quote Primary CTA */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/25 hover:shadow-md active:scale-[0.98] transition-all duration-200"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Request Quote</span>
            </a>
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Matching Active Navigation State */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-navy-800 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 mt-2.5 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-1">
            {items.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl transition-all ${
                    isActive
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-3 shadow-sm"
                      : "text-slate-800 dark:text-slate-200 font-medium hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-navy-900"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-red-600 dark:text-red-400" : "text-slate-400"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-navy-800 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-md shadow-red-600/25 active:scale-[0.98] transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Quote / RFQ</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
