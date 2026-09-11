"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = navItems && navItems.length > 0
    ? navItems.filter((i) => i.isActive)
    : DEFAULT_NAV;

  const logoSrc = settings?.logo || "/logo/csd-logo.png";
  const companyName = settings?.companyName || "CSD Enterprises";
  const tagline = settings?.tagline || "Automation & Technologies";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-navy-950/90 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-cyan-950/20 border-b border-slate-200/80 dark:border-cyan-500/10 py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="#hero" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-white dark:bg-navy-900 p-1.5 border border-slate-200 dark:border-cyan-500/30 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src={logoSrc}
                alt={`${companyName} Logo`}
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-navy-950 dark:text-white flex items-center gap-1.5">
                <span>CSD</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Enterprises</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400 rounded-lg transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Elements */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />



            {/* Request Quote Primary CTA */}
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg shadow-sm hover:shadow-cyan-500/20 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Request Quote</span>
            </Link>
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-slate-800 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 rounded-md hover:bg-slate-50 dark:hover:bg-navy-900"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-navy-800 flex flex-col gap-2">

            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Quote / RFQ</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
