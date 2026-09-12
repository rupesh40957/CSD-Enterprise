import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getProjectDetails } from "@/lib/db-helpers";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project, settings } = await getProjectDetails(slug);

  if (!project) {
    return {
      title: "Project Not Found | CSD Enterprises",
    };
  }

  const companyName = settings?.companyName || "CSD Enterprises";
  const title = `${project.title} | Case Study | ${companyName}`;
  const description =
    project.shortDescription ||
    project.description ||
    `Turnkey deployment for ${project.client} by ${companyName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { project, settings, relatedProjects } = await getProjectDetails(slug);

  if (!project) {
    notFound();
  }

  const whatsappPhone = (settings?.phone || "+91 8355976842").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello CSD Enterprises, I would like to discuss a project deployment similar to: ${project.title} (Client: ${project.client}).`
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
            <Link href="/#projects" className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
              Featured Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none">
              {project.title}
            </span>
          </nav>

          {/* Header Metadata */}
          <div className="space-y-4 mb-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-navy-900 text-cyan-400 border border-cyan-500/30">
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Landmark Enterprise Deployment</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Commissioned &amp; Operational
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy-950 dark:text-white tracking-tight leading-[1.15]">
              {project.title}
            </h1>

            {/* Quick Specs Bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-3 border-y border-slate-200 dark:border-navy-800 py-3.5">
              <div className="flex items-center gap-2 font-bold text-red-600 dark:text-cyan-400">
                <Building2 className="w-4 h-4" />
                <span>Client: {project.client}</span>
              </div>
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{project.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Turnkey Commissioned</span>
              </div>
            </div>
          </div>

          {/* Project Showcase Cover Image */}
          <div className="relative h-80 sm:h-[420px] lg:h-[480px] w-full rounded-3xl overflow-hidden mb-14 shadow-2xl border border-slate-200 dark:border-navy-800 group">
            <Image
              src={project.image || "/images/industrial-facility.jpg"}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-white">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
                  Client Engineering Case Study
                </div>
                <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>100% Zero-Incident Turnkey Execution</span>
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
                  <span>Inquire Similar Project</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2-Column Case Study Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            {/* Left Column: Scope, Challenge, Solution */}
            <div className="lg:col-span-8 space-y-10">
              {/* Project Background & Challenge */}
              <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-navy-800">
                <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white mb-4 flex items-center gap-2.5">
                  <Cpu className="w-6 h-6 text-red-600 dark:text-cyan-400" />
                  <span>Operational Context &amp; Engineering Challenges</span>
                </h2>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{project.description}</p>
                </div>
              </div>

              {/* Engineering Scope of Work */}
              <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-navy-800">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-navy-800">
                  <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-red-600 dark:text-cyan-400" />
                    <span>Contractual Scope of Work &amp; Execution</span>
                  </h2>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Turnkey EPC
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 flex items-start gap-4 shadow-sm">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {project.scope}
                  </div>
                </div>
              </div>

              {/* Execution Rigor & Key Highlights */}
              <div className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-navy-800">
                <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white mb-6 flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span>Key Project Highlights &amp; Compliance Standards</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 flex items-start gap-3 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Complete turnkey procurement, cabling, mountings, and commissioning
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 flex items-start gap-3 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Adherence to PESO, ATEX Ex-d, and DGMS statutory safety codes
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 flex items-start gap-3 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      On-site operator certification and engineering documentation handover
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-navy-900/60 border border-slate-200/80 dark:border-navy-800 flex items-start gap-3 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      24/7 post-deployment warranty support with SLA-backed dispatch
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar Dossier */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Project Dossier Card */}
                <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-navy-800 shadow-xl">
                  <h3 className="text-lg font-black text-navy-950 dark:text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-600 dark:text-cyan-400" />
                    <span>Project Dossier</span>
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">Enterprise Client</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{project.client}</span>
                    </div>
                    {project.location && (
                      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                        <span className="text-slate-500 dark:text-slate-400">Site Location</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{project.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">Discipline</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{project.category}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-navy-800">
                      <span className="text-slate-500 dark:text-slate-400">Operational State</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Commissioned</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-navy-800 space-y-3">
                    <Link
                      href="/#contact"
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all btn-press"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Request Similar Project Proposal</span>
                    </Link>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all btn-press"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <span>Direct WhatsApp Discussion</span>
                    </a>
                  </div>
                </div>

                {/* Tender Support Info */}
                <div className="p-6 rounded-2xl bg-slate-100 dark:bg-navy-900/80 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <div className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span>Public Sector &amp; Enterprise Tenders</span>
                  </div>
                  <p className="leading-relaxed">
                    CSD Enterprises participates in state and central enterprise tenders across India with full vendor credentials and performance bank guarantees.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Landmark Projects */}
          {relatedProjects && relatedProjects.length > 0 && (
            <div className="pt-12 border-t border-slate-200 dark:border-navy-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase text-red-600 dark:text-cyan-400">
                    Track Record of Excellence
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
                    More Landmark Enterprise Projects
                  </h2>
                </div>
                <Link
                  href="/#projects"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-cyan-400 hover:underline"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.slice(0, 3).map((rel) => (
                  <Link
                    key={rel.slug || String(rel._id)}
                    href={`/projects/${rel.slug}`}
                    className="glass-panel-elevated rounded-2xl overflow-hidden group hover:border-red-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-navy-950 overflow-hidden">
                        <Image
                          src={rel.image || "/images/industrial-facility.jpg"}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-navy-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
                          {rel.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="text-[11px] font-semibold text-red-600 dark:text-cyan-400 mb-1">
                          {rel.client}
                        </div>
                        <h3 className="text-base font-bold text-navy-950 dark:text-white line-clamp-1 mb-2 group-hover:text-red-600 dark:group-hover:text-cyan-400 transition-colors">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {rel.shortDescription || rel.description}
                        </p>
                      </div>
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
