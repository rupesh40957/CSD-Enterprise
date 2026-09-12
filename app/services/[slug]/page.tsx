import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getServiceDetails } from "@/lib/db-helpers";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  Clock,
  Radio,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { service, settings } = await getServiceDetails(slug);

  if (!service) {
    return {
      title: "Service Not Found | CSD Enterprises",
    };
  }

  const companyName = settings?.companyName || "CSD Enterprises";
  const title = service.seoTitle || `${service.title} | ${companyName}`;
  const description =
    service.seoDescription ||
    service.shortDescription ||
    `${service.title} turnkey engineering solutions by ${companyName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: service.image ? [{ url: service.image }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const { service, settings, relatedServices } = await getServiceDetails(slug);

  if (!service) {
    notFound();
  }

  const whatsappPhone = (settings?.phone || "+91 8355976842").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello CSD Enterprises, I would like to inquire about your specialized solution: ${service.title}.`
  )}`;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar settings={settings} />

      <article className="flex-1 pt-28 sm:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/#services" className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
              Solutions &amp; Verticals
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none">
              {service.title}
            </span>
          </nav>

          {/* Hero Header */}
          <div className="space-y-4 mb-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-red-600/10 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-500/20">
                <Sparkles className="w-3 h-3 text-red-500" />
                <span>Engineering Vertical {service.number}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Turnkey Commissioned
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy-950 dark:text-white tracking-tight leading-[1.15]">
              {service.title}
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-red-600 dark:text-cyan-400">
              {service.tagline}
            </p>
          </div>

          {/* Main Hero Showcase Banner */}
          <div className="relative h-80 sm:h-[420px] lg:h-[480px] w-full rounded-3xl overflow-hidden mb-14 shadow-2xl border border-slate-200 dark:border-navy-800 group">
            <Image
              src={service.image || "/images/automation-hero.jpg"}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

            {/* Bottom Overlay Telemetry Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-white">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
                  Industrial Systems Architecture
                </div>
                <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  <span>Mission-Critical Industrial Standard</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-emerald-900/40"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Inquiry</span>
                </a>
                <Link
                  href="/#contact"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-red-900/40"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Request RFQ</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Column Core Architecture Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            {/* Left Column: Scope, Capabilities, Standards */}
            <div className="lg:col-span-8 space-y-10">
              {/* Executive Overview */}
              <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-navy-800">
                <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white mb-4 flex items-center gap-2.5">
                  <Cpu className="w-6 h-6 text-red-600 dark:text-cyan-400" />
                  <span>Operational Overview &amp; Technical Scope</span>
                </h2>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{service.description || service.shortDescription}</p>
                  <p>
                    From initial front-end engineering design (FEED) through on-site deployment, loop testing,
                    and final statutory handover, CSD Enterprises delivers complete turnkey execution with
                    guaranteed zero-downtime integration into existing SCADA, PLC, and DCS plant topologies.
                  </p>
                </div>
              </div>

              {/* Engineering Capabilities Grid */}
              {service.capabilities && service.capabilities.length > 0 && (
                <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-navy-800">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-navy-800">
                    <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white flex items-center gap-2.5">
                      <ShieldCheck className="w-6 h-6 text-red-600 dark:text-cyan-400" />
                      <span>Technical Capabilities &amp; Deliverables</span>
                    </h2>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {service.capabilities.length} Verified Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.capabilities.map((cap, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 flex items-start gap-3.5 card-hover shadow-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                          {cap}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applicable Sectors & Environments */}
              {service.targetIndustries && service.targetIndustries.length > 0 && (
                <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-navy-800">
                  <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white mb-6 flex items-center gap-2.5">
                    <Building2 className="w-6 h-6 text-red-600 dark:text-cyan-400" />
                    <span>Applicable Industrial Sectors &amp; Environments</span>
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {service.targetIndustries.map((ind, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-navy-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-700 shadow-sm"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance & Safety Standards */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 text-white border border-red-500/20 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold tracking-widest text-red-400">
                      Industrial Compliance
                    </span>
                    <h3 className="text-lg font-bold">Standard Operating Specifications</h3>
                    <p className="text-xs text-slate-400 max-w-lg">
                      Certified compliant with IEC 61131-3, ATEX / IECEx Zone 1 &amp; 2, ISRO INSAT Satcom Protocols, and ISO 9001:2015 Quality Management Standards.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold">
                      SIL-2 / SIL-3 Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar for Quick RFQ & Specs */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Specifications Card */}
                <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-navy-800 shadow-xl">
                  <h3 className="text-lg font-black text-navy-950 dark:text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-600 dark:text-cyan-400" />
                    <span>Vertical At A Glance</span>
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">System Availability</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">99.98% High-Reliability</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">Commissioning Model</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">Turnkey EPC / Integration</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">Engineering Handover</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">FAT / SAT / As-Built CAD</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">Field Support SLA</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">24/7 Pan-India Dispatch</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-navy-800 space-y-3">
                    <Link
                      href="/#contact"
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all btn-press"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Request Proposal &amp; RFQ</span>
                    </Link>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all btn-press"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>Direct WhatsApp Support</span>
                    </a>
                  </div>
                </div>

                {/* Direct Engineering Hotline */}
                <div className="p-6 rounded-2xl bg-slate-100 dark:bg-navy-900/80 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <div className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-red-500" />
                    <span>Have specific tender specifications?</span>
                  </div>
                  <p className="leading-relaxed">
                    Send tender documents or RFQs directly to{" "}
                    <a
                      href={`mailto:${settings?.email || "support@csdenterprises.in"}`}
                      className="text-red-600 dark:text-cyan-400 font-semibold underline underline-offset-2"
                    >
                      {settings?.email || "support@csdenterprises.in"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Specialized Solutions */}
          {relatedServices && relatedServices.length > 0 && (
            <div className="pt-12 border-t border-slate-200 dark:border-navy-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase text-red-600 dark:text-cyan-400">
                    Expand Technical Capability
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
                    Complementary Engineering Verticals
                  </h2>
                </div>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-cyan-400 hover:underline"
                >
                  <span>View All Verticals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.slice(0, 3).map((rel) => (
                  <Link
                    key={rel.slug || String(rel._id)}
                    href={`/services/${rel.slug}`}
                    className="glass-panel-elevated rounded-2xl p-6 group hover:border-red-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800">
                          Vertical {rel.number}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 dark:group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <h3 className="text-base font-bold text-navy-950 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-cyan-400 transition-colors">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {rel.shortDescription || rel.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <FloatingWhatsApp />
      <Footer settings={settings} />
    </main>
  );
}
