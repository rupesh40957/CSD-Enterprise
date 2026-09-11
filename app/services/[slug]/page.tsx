import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { Service, WebsiteSettings } from "@/models";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import {
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Building2,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

async function getServiceData(slug: string) {
  try {
    const db = await getDatabase();
    const [service, settings] = await Promise.all([
      db.collection<Service>("services").findOne({ slug, isActive: true }),
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
    ]);
    function serialize<T>(item: T): T {
      return JSON.parse(JSON.stringify(item));
    }
    return {
      service: service ? serialize(service) : null,
      settings: settings ? serialize(settings) : null,
    };
  } catch {
    return { service: null, settings: null };
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const { service, settings } = await getServiceData(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar settings={settings} />

      <article className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <div className="mb-8">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Solutions &amp; Verticals</span>
            </Link>
          </div>

          {/* Hero Header */}
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Business Vertical {service.number}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-cyan-600 dark:text-cyan-400">
              {service.tagline}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-3xl">
              {service.description || service.shortDescription}
            </p>
          </div>

          {/* Featured Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200 dark:border-cyan-500/20">
            <Image
              src={service.image || "/images/automation-hero.jpg"}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
          </div>

          {/* Key Capabilities */}
          {service.capabilities && service.capabilities.length > 0 && (
            <div className="mb-12 p-8 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-950 dark:text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-500" />
                <span>Technical Scope &amp; Engineering Capabilities</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Industries */}
          {service.targetIndustries && service.targetIndustries.length > 0 && (
            <div className="mb-12 p-8 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
              <h2 className="text-xl font-bold text-navy-950 dark:text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-500" />
                <span>Applicable Sectors &amp; Deployment Environments</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {service.targetIndustries.map((ind, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-700"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* RFQ CTA Bar */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-extrabold">Ready to discuss your requirements?</h3>
              <p className="text-sm text-white/90 mt-1">
                Our senior engineering team provides tailored proposals and technical site audits.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-white hover:bg-slate-100 shadow-md transition-all shrink-0"
            >
              <PhoneCall className="w-4 h-4 text-cyan-600" />
              <span>Request Technical RFQ</span>
            </Link>
          </div>
        </div>
      </article>

      <FloatingWhatsApp />
      <Footer settings={settings} />
    </main>
  );
}
