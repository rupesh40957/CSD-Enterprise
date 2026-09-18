"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { WebsiteSettings, Service, NavigationItem } from "@/models";

interface FooterProps {
  settings?: WebsiteSettings | null;
  services?: Service[];
  navItems?: NavigationItem[];
}

export default function Footer({ settings, services = [], navItems = [] }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { theme } = useTheme();

  const logoSrc = settings?.logo && settings.logo !== "/logo/csd-logo.png" ? settings.logo : "/logo/csd-logo.svg";
  const companyName = settings?.companyName || "CSD Enterprises";
  const tagline = settings?.tagline || "Vision of Connectivity";
  const logoClassName =
    theme === "dark"
      ? "object-contain w-full h-full transition-all duration-300 brightness-0 invert"
      : "object-contain w-full h-full transition-all duration-300";
  const phone = settings?.phone || "+91 7678561876";
  const emailAddr = settings?.email || "support@csdenterprises.in";
  const address = settings?.address || "OM Plaza Commercial Complex, 60, 1st Floor, Nalasopara West, Mumbai - 401203";
  const copyright = settings?.copyrightText || `Copyright © 2019–${new Date().getFullYear()} CSD Enterprises. All Rights Reserved.`;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Subscription failed.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Thank you for subscribing.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const activeServices = [
    { title: "Satellite & V-SAT Communications", slug: "#services" },
    { title: "SCADA Data Transfer & Telemetry", slug: "#services" },
    { title: "CCTV Surveillance & Explosion-Proof", slug: "#services" },
    { title: "Automatic Weather Stations (AWS/AWLR)", slug: "#services" },
    { title: "IT Networks, OFC & LAN Switching", slug: "#services" },
    { title: "Turnkey Comprehensive & Non-Comp AMC", slug: "#services" },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-navy-800">
          {/* Col 1: Brand & Summary */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="#hero" className="flex items-center gap-3 group">
              <div className="w-[50px] h-[32px] sm:w-[56px] sm:h-[36px] rounded-xl overflow-hidden p-1 flex items-center justify-center shrink-0 bg-slate-200/80 dark:bg-slate-800/60 ring-1 ring-slate-300/80 dark:ring-slate-700/80 shadow-sm">
                <Image
                  src={logoSrc}
                  alt={`${companyName} Logo`}
                  width={56}
                  height={36}
                  className={logoClassName}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  <span className="text-red-600 dark:text-red-400">CSD</span> <span className="text-slate-900 dark:text-white">Enterprises</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400">
                  {tagline}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Formed in 2019, CSD Enterprises delivers industrial-grade system integration,
              PLC/SCADA architectures, hazardous-zone CCTV surveillance, and offshore satellite
              communication links for India&apos;s leading enterprises.
            </p>

            {/* Official Social Links */}
            <div className="pt-2 flex items-center gap-2.5">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-navy-800 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 btn-press"
                  aria-label="CSD Enterprises Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {settings?.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-navy-800 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 btn-press"
                  aria-label="CSD Enterprises X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-navy-800 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 btn-press"
                  aria-label="CSD Enterprises LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-navy-800 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 btn-press"
                  aria-label="CSD Enterprises Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Services / Verticals */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
              Business Verticals
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {activeServices.map((serv, idx) => (
                <li key={idx}>
                  <Link
                    href={serv.slug ? `/services/${serv.slug}` : "#services"}
                    className="hover:text-cyan-500 transition-colors"
                  >
                    {serv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
              Enterprise Hub
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#about" className="hover:text-cyan-500 transition-colors">
                  Company Vision &amp; Ethos
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-cyan-500 transition-colors">
                  Featured Landmark Projects
                </Link>
              </li>
              <li>
                <Link href="#presence" className="hover:text-cyan-500 transition-colors">
                  Pan-India Presence
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-cyan-500 transition-colors">
                  Request RFQ / Proposal
                </Link>
              </li>

            </ul>
          </div>

          {/* Col 4: Newsletter & Direct Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white">
              Subscribe to Technical Bulletins
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Receive quarterly engineering insights on industrial IoT, telemetry standards, and automation safety.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white pr-10"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all btn-press shadow-sm shadow-red-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {status === "success" && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{message}</span>
                </div>
              )}
              {status === "error" && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{message}</span>
                </div>
              )}
            </form>

            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:underline">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <a href={`mailto:${emailAddr}`} className="hover:underline">
                  {emailAddr}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>{copyright}</div>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Developed By</span>
            <a
              href="https://www.backcoding.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors underline underline-offset-4"
            >
              BackCoding
            </a>
          </div>
          <div className="flex items-center gap-6">

            <span>•</span>
            <Link href="#hero" className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
              Back to Top ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
