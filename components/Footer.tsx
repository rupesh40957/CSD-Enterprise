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

  const logoSrc = settings?.logo || "/logo/csd-logo.png";
  const companyName = settings?.companyName || "CSD Enterprises";
  const tagline = settings?.tagline || "Unit of CSD Automation & Technologies";
  const phone = settings?.phone || "+91 8355976842";
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

  const activeServices = services.length > 0 ? services.slice(0, 6) : [
    { title: "Industrial Automation (PLC / SCADA)", slug: "industrial-automation" },
    { title: "Digitization & Industrial IoT", slug: "digitization-iot" },
    { title: "Explosion-Proof CCTV Surveillance", slug: "cctv-surveillance" },
    { title: "Sensorization & Hydrometrology (AWS)", slug: "sensorization-hydrometrology" },
    { title: "IT Networks & Infrastructure (LAN / OFC)", slug: "it-network-infrastructure" },
    { title: "Manpower & Facility Engineering", slug: "manpower-facility-services" },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-navy-800">
          {/* Col 1: Brand & Summary */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="#hero" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white dark:bg-navy-900 p-1.5 border border-slate-200 dark:border-cyan-500/30 shadow-sm flex items-center justify-center">
                <Image
                  src={logoSrc}
                  alt={`${companyName} Logo`}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-navy-950 dark:text-white">
                  <span>CSD</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Enterprises</span>
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

            {/* Social Links & Admin Gateway */}
            <div className="pt-2 flex items-center gap-3">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-navy-900 hover:bg-cyan-500 hover:text-navy-950 dark:hover:bg-cyan-500 dark:hover:text-navy-950 flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="CSD Enterprises Facebook"
                >
                  FB
                </a>
              )}
              {settings?.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-navy-900 hover:bg-cyan-500 hover:text-navy-950 dark:hover:bg-cyan-500 dark:hover:text-navy-950 flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="CSD Enterprises X"
                >
                  𝕏
                </a>
              )}
              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-navy-900 hover:bg-cyan-500 hover:text-navy-950 dark:hover:bg-cyan-500 dark:hover:text-navy-950 flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="CSD Enterprises LinkedIn"
                >
                  IN
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-navy-950 font-bold"
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div>{copyright}</div>
          <div className="flex items-center gap-6">
            <span>B2B Industrial Systems Integration</span>
            <span>•</span>
            <Link href="#hero" className="hover:text-cyan-500 transition-colors">
              Back to Top ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
